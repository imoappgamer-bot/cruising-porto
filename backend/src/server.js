import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import 'express-async-errors';

import authRoutes from './routes/auth.routes.js';
import locationRoutes from './routes/location.routes.js';
import checkinRoutes from './routes/checkin.routes.js';
import commentRoutes from './routes/comment.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import alertRoutes from './routes/alert.routes.js';

import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS - Configuracao para producao
// ============================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sem origin (apps mobile, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      logger.warn(`CORS bloqueou origem: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24h preflight cache
  })
);

// ============================================
// SECURITY HEADERS
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ============================================
// RATE LIMITING
// ============================================

// Limite geral: 100 requests por 15 minutos por IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos. Tente novamente em 15 minutos.' },
  skip: (req) => process.env.NODE_ENV === 'test',
});

// Limite de auth: 10 tentativas por 15 minutos por IP (anti-brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas tentativas de login. Aguarde 15 minutos.' },
  skip: (req) => process.env.NODE_ENV === 'test',
});

// Limite de check-ins: 5 por minuto por IP
const checkinLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitos check-ins seguidos. Aguarde 1 minuto.' },
  skip: (req) => process.env.NODE_ENV === 'test',
});

// ============================================
// BODY PARSER
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// REQUEST LOGGING (apenas em dev)
// ============================================
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/locations', generalLimiter, locationRoutes);
app.use('/api/checkins', checkinLimiter, checkinRoutes);
app.use('/api/comments', generalLimiter, commentRoutes);
app.use('/api/users', generalLimiter, userRoutes);
app.use('/api/messages', generalLimiter, messageRoutes);
app.use('/api/alerts', generalLimiter, alertRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada' });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Cruising Porto API a correr na porta ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} recebido. A encerrar servidor...`);
  server.close(() => {
    logger.info('Servidor encerrado.');
    process.exit(0);
  });
  // Forcar saida se nao fechar em 10s
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import locationRoutes from './routes/location.routes.js';
import checkinRoutes from './routes/checkin.routes.js';
import commentRoutes from './routes/comment.routes.js';
import alertRoutes from './routes/alert.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor está funcionando' });
});

// Sincronizar banco de dados e iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync({ alter: process.env.NODE_ENV === 'development' }).then(() => {
    app.listen(PORT, () => {
      console.log(`\n Servidor Cruising Porto iniciado na porta ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`API disponivel em: http://localhost:${PORT}\n`);
    });
  }).catch(error => {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  });
}

export default app;

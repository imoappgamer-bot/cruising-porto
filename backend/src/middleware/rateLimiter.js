// Rate Limiting Middleware - Proteção contra abuso de API
import rateLimit from 'express-rate-limit';

// Limiter geral para todas as rotas
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por IP
  message: {
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos',
    status: 429
  },
  standardHeaders: true, // Retornar info de rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilitar headers `X-RateLimit-*`
});

// Limiter estrito para autenticação (login/registro)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por IP
  skipSuccessfulRequests: true, // Não contar requests bem-sucedidos
  message: {
    error: 'Muitas tentativas de login/registro, tente novamente em 15 minutos',
    status: 429
  }
});

// Limiter para criação de conteúdo (comments, check-ins, etc)
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 criações por minuto
  message: {
    error: 'Você está criando conteúdo muito rapidamente. Aguarde um momento.',
    status: 429
  }
});

// Limiter para mensagens privadas
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto  
  max: 20, // 20 mensagens por minuto
  message: {
    error: 'Limite de mensagens atingido. Aguarde um momento.',
    status: 429
  }
});

// Limiter para busca/listagem
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 buscas por minuto
  message: {
    error: 'Muitas buscas. Aguarde um momento.',
    status: 429
  }
});

export default {
  generalLimiter,
  authLimiter,
  createLimiter,
  messageLimiter,
  searchLimiter
};

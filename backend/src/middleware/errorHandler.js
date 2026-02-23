// Middleware de tratamento de erros global

const errorHandler = (err, req, res, next) => {
  // Log do erro no console
  console.error('Erro capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Status code padrão é 500 (Internal Server Error)
  const statusCode = err.statusCode || err.status || 500;

  // Mensagem de erro
  const message = err.message || 'Erro interno do servidor';

  // Resposta de erro
  const errorResponse = {
    error: {
      message: message,
      status: statusCode
    }
  };

  // Em desenvolvimento, incluir stack trace
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = err.details || null;
  }

  res.status(statusCode).json(errorResponse);
};

// Middleware para capturar rotas não encontradas (404)
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Middleware para validar erros de sintaxe JSON
const jsonErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        message: 'JSON inválido',
        status: 400
      }
    });
  }
  next(err);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  jsonErrorHandler
};

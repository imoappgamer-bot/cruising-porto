// Middleware de validação usando Joi schemas

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Retorna todos os erros, não apenas o primeiro
      stripUnknown: true  // Remove campos desconhecidos
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Erro de validação',
        details: errors
      });
    }

    // Substituir req.body pelos dados validados e sanitizados
    req.body = value;
    next();
  };
};

// Validar parâmetros de query
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Erro de validação de query',
        details: errors
      });
    }

    req.query = value;
    next();
  };
};

// Validar parâmetros de rota
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Erro de validação de parâmetros',
        details: errors
      });
    }

    req.params = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams
};

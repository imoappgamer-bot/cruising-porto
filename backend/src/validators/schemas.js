const Joi = require('joi');

// Schema de registro de usuário
const userRegistrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required()
    .messages({
      'string.alphanum': 'Nome de usuário deve conter apenas letras e números',
      'string.min': 'Nome de usuário deve ter pelo menos 3 caracteres',
      'string.max': 'Nome de usuário deve ter no máximo 30 caracteres',
      'any.required': 'Nome de usuário é obrigatório'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório'
    }),
  password: Joi.string().min(8).required()
    .messages({
      'string.min': 'Senha deve ter pelo menos 8 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
  nickname: Joi.string().min(2).max(50).optional(),
  age: Joi.number().integer().min(18).max(120).optional(),
  gender: Joi.string().valid('male', 'female', 'non-binary', 'other').optional(),
  city: Joi.string().max(100).optional()
});

// Schema de login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Schema de atualização de perfil
const updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  bio: Joi.string().max(500).optional(),
  email: Joi.string().email().optional()
});

// Schema de mensagem
const messageSchema = Joi.object({
  receiver_id: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'ID do destinatário é obrigatório'
    }),
  content: Joi.string().min(1).max(1000).required()
    .messages({
      'string.min': 'Mensagem não pode estar vazia',
      'string.max': 'Mensagem muito longa (máximo 1000 caracteres)',
      'any.required': 'Conteúdo da mensagem é obrigatório'
    })
});

// Schema de comentário
const commentSchema = Joi.object({
  location_id: Joi.number().integer().positive().required(),
  content: Joi.string().min(1).max(500).required(),
  rating: Joi.number().integer().min(1).max(5).optional()
});

// Schema de localização
const locationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(1000).optional(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  type: Joi.string().valid('park', 'beach', 'club', 'sauna', 'outdoor', 'other').required(),
  address: Joi.string().max(200).optional(),
  city: Joi.string().max(100).optional()
});

// Schema de check-in
const checkinSchema = Joi.object({
  location_id: Joi.number().integer().positive().required(),
  is_anonymous: Joi.boolean().optional().default(false)
});

// Schema de alerta
const alertSchema = Joi.object({
  location_id: Joi.number().integer().positive().required(),
  alert_type: Joi.string().valid('police', 'safety', 'harassment', 'other').required(),
  description: Joi.string().max(500).required(),
  severity: Joi.string().valid('low', 'medium', 'high').optional().default('medium')
});

// Schema de configurações
const settingsSchema = Joi.object({
  is_visible: Joi.boolean().optional(),
  show_online: Joi.boolean().optional(),
  allow_messages: Joi.boolean().optional(),
  email_notifications: Joi.boolean().optional(),
  push_notifications: Joi.boolean().optional()
});

// Schema de alteração de senha
const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).required()
});

module.exports = {
  userRegistrationSchema,
  loginSchema,
  updateProfileSchema,
  messageSchema,
  commentSchema,
  locationSchema,
  checkinSchema,
  alertSchema,
  settingsSchema,
  changePasswordSchema
};

import express from 'express';
import messageController from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';
import { textModerationMiddleware } from '../middleware/contentModeration.js';

const router = express.Router();

// Todas as rotas de mensagens requerem autenticação
router.use(authenticate);

// Enviar mensagem (com moderação de conteúdo)
router.post('/send', textModerationMiddleware('message'), messageController.sendMessage);

// Obter conversa com um usuário específico
router.get('/conversation/:user_id', messageController.getConversation);

// Marcar mensagem como lida
router.put('/:message_id/read', messageController.markAsRead);

// Marcar todas as mensagens de um usuário como lidas
router.put('/user/:user_id/read-all', messageController.markAllAsRead);

// Deletar mensagem
router.delete('/:message_id', messageController.deleteMessage);

// Obter lista de conversas
router.get('/conversations', messageController.getConversations);

// Obter contagem de mensagens não lidas
router.get('/unread-count', messageController.getUnreadCount);

export default router;

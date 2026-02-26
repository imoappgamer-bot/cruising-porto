import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { textModerationMiddleware } from '../middleware/contentModeration.js';

const router = express.Router();

// Rotas públicas (sem autenticação)
router.get('/:id/profile', userController.getUserProfile);

// Rotas protegidas (requerem autenticação)
router.use(authenticate);

// Perfil do usuário
router.get('/profile', userController.getUserProfile);
router.put('/profile', textModerationMiddleware('profile'), userController.updateProfile);
router.post('/avatar', userController.uploadAvatar);

// Configurações (inclui gravação de consentimentos via updateSettings)
router.get('/settings', userController.getSettings);
router.put('/settings', userController.updateSettings);

// Bloquear/Desbloquear usuários
router.post('/block', userController.blockUser);
router.post('/unblock', userController.unblockUser);
router.get('/blocked', userController.getBlockedUsers);

// Segurança
router.post('/change-password', userController.changePassword);
router.delete('/account', userController.deleteAccount);

export default router;

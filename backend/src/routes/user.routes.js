const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Rotas públicas (sem autenticação)
router.get('/:id/profile', userController.getUserProfile);

// Rotas protegidas (requerem autenticação)
router.use(authenticate);

// Perfil do usuário
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateProfile);
router.post('/avatar', userController.uploadAvatar);

// Configurações
router.get('/settings', userController.getSettings);
router.put('/settings', userController.updateSettings);

// Bloquear/Desbloquear usuários
router.post('/block', userController.blockUser);
router.post('/unblock', userController.unblockUser);
router.get('/blocked', userController.getBlockedUsers);

// Segurança
router.post('/change-password', userController.changePassword);
router.delete('/account', userController.deleteAccount);

module.exports = router;

const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/validate');

const router = express.Router();

// Todas as rotas de favoritos requerem autenticação
router.post('/', authenticate, favoriteController.addFavorite);
router.delete('/:spotId', authenticate, favoriteController.removeFavorite);
router.get('/', authenticate, favoriteController.listFavorites);
router.get('/check/:spotId', authenticate, favoriteController.checkFavorite);

module.exports = router;

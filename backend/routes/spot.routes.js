const express = require('express');
const spotController = require('../controllers/spotController');
const { authenticate } = require('../middleware/validate');

const router = express.Router();

// Públicas (sem autenticação)
router.get('/list', spotController.listSpots);
router.get('/:spotId', spotController.getSpotDetail);

// Protegidas (requerem autenticação)
router.post('/:spotId/rate', authenticate, spotController.rateSpot);
router.post('/:spotId/report', authenticate, spotController.reportSpot);

module.exports = router;

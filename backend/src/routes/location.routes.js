import express from 'express';
import {
  getAllLocations,
  getNearbyLocations,
  getLocationById,
  rateLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  reportLocation
} from '../controllers/locationController.js';
import { authenticateToken } from '../middleware/auth.js';
import { textModerationMiddleware } from '../middleware/contentModeration.js';

const router = express.Router();

// Rotas públicas
router.get('/', getAllLocations);
router.get('/nearby', getNearbyLocations);
router.get('/:id', getLocationById);

// Rotas protegidas
router.post('/:id/rate', authenticateToken, rateLocation);
router.post('/:id/report', authenticateToken, reportLocation);

// Criar local (com moderação de conteúdo)
router.post('/', authenticateToken, textModerationMiddleware('location'), createLocation);

// Atualizar local (com moderação de conteúdo)
router.put('/:id', authenticateToken, textModerationMiddleware('location'), updateLocation);

// Remover local
router.delete('/:id', authenticateToken, deleteLocation);

export default router;

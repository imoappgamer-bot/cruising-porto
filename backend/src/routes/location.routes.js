import express from 'express';
import { 
  getAllLocations, 
  getNearbyLocations, 
  getLocationById, 
  rateLocation 
} from '../controllers/locationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/', getAllLocations);
router.get('/nearby', getNearbyLocations);
router.get('/:id', getLocationById);

// Rotas protegidas
router.post('/:id/rate', authenticateToken, rateLocation);

export default router;

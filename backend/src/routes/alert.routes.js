import express from 'express';
import {
  createAlert,
  getNearbyAlerts,
  getLocationAlerts,
  dismissAlert,
  getLocationSafetyStats
} from '../controllers/alertController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/nearby', getNearbyAlerts);
router.get('/location/:locationId', getLocationAlerts);
router.get('/location/:locationId/stats', getLocationSafetyStats);

// Rotas protegidas
router.post('/', authenticateToken, createAlert);
router.delete('/:alertId', authenticateToken, dismissAlert);

export default router;

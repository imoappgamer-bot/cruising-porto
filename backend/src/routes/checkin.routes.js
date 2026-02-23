import express from 'express';
import { 
  createCheckIn, 
  removeCheckIn, 
  getActiveCheckIn, 
  getActiveUsersAtLocation 
} from '../controllers/checkinController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas de check-in são protegidas
router.post('/', authenticateToken, createCheckIn);
router.delete('/active', authenticateToken, removeCheckIn);
router.get('/active', authenticateToken, getActiveCheckIn);
router.get('/location/:locationId', getActiveUsersAtLocation);

export default router;

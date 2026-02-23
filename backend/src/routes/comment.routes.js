import express from 'express';
import { 
  createComment, 
  getLocationComments, 
  deleteComment, 
  reportComment,
  getUserComments 
} from '../controllers/commentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rota pública para listar comentários de um local
router.get('/location/:locationId', getLocationComments);

// Rotas protegidas
router.post('/', authenticateToken, createComment);
router.get('/my-comments', authenticateToken, getUserComments);
router.delete('/:commentId', authenticateToken, deleteComment);
router.post('/:commentId/report', authenticateToken, reportComment);

export default router;

import express from 'express';
import {
  createComment,
  getLocationComments,
  deleteComment,
  reportComment,
  getUserComments
} from '../controllers/commentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { textModerationMiddleware } from '../middleware/contentModeration.js';

const router = express.Router();

// Rota pública para listar comentários de um local
router.get('/location/:locationId', getLocationComments);

// Rotas protegidas
router.get('/my-comments', authenticateToken, getUserComments);
router.post('/', authenticateToken, textModerationMiddleware('comment'), createComment);
router.delete('/:commentId', authenticateToken, deleteComment);
router.post('/:commentId/report', authenticateToken, reportComment);

export default router;

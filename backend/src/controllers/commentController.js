import { Comment, Location, User } from '../models/index.js';

// Criar comentário
export const createComment = async (req, res) => {
  try {
    const { locationId, text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comentário não pode estar vazio' });
    }

    if (text.length > 500) {
      return res.status(400).json({ error: 'Comentário muito longo (máx. 500 caracteres)' });
    }

    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    const comment = await Comment.create({
      userId: req.userId,
      locationId,
      text: text.trim()
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }]
    });

    res.status(201).json({
      message: 'Comentário criado com sucesso',
      comment: commentWithUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar comentários de um local
export const getLocationComments = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const comments = await Comment.findAll({
      where: { locationId },
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Comment.count({ where: { locationId } });

    res.json({
      comments,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar comentário
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    // Apenas o autor pode deletar
    if (comment.userId !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar este comentário' });
    }

    await comment.destroy();

    res.json({ message: 'Comentário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reportar comentário
export const reportComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reason } = req.body;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    // Aqui você pode implementar lógica de report
    // Por exemplo: salvar em tabela de reports, enviar email para admin, etc
    
    res.json({ 
      message: 'Comentário reportado com sucesso',
      commentId,
      reason 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter comentários do usuário
export const getUserComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { userId: req.userId },
      include: [{
        model: Location,
        attributes: ['id', 'name', 'address']
      }],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Message Controller - Sistema de mensagens privadas entre usuários

const pool = require('../config/database');

// Enviar mensagem
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !content) {
      return res.status(400).json({ error: 'Destinatário e conteúdo são obrigatórios' });
    }

    if (sender_id === receiver_id) {
      return res.status(400).json({ error: 'Você não pode enviar mensagens para si mesmo' });
    }

    // Verificar se o destinatário existe
    const receiverCheck = await pool.query(
      'SELECT id, allow_messages FROM users WHERE id = $1 AND is_active = true',
      [receiver_id]
    );

    if (receiverCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (!receiverCheck.rows[0].allow_messages) {
      return res.status(403).json({ error: 'Este usuário não aceita mensagens' });
    }

    // Verificar se está bloqueado
    const blockCheck = await pool.query(
      `SELECT id FROM blocked_users 
       WHERE (user_id = $1 AND blocked_user_id = $2) 
       OR (user_id = $2 AND blocked_user_id = $1)`,
      [sender_id, receiver_id]
    );

    if (blockCheck.rows.length > 0) {
      return res.status(403).json({ error: 'Não é possível enviar mensagem para este usuário' });
    }

    // Inserir mensagem
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, sender_id, receiver_id, content, is_read, created_at`,
      [sender_id, receiver_id, content]
    );

    res.status(201).json({
      message: 'Mensagem enviada com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
};

// Obter conversa com um usuário específico
exports.getConversation = async (req, res) => {
  try {
    const { user_id } = req.params;
    const currentUserId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    if (!user_id) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    // Buscar mensagens entre os dois usuários
    const result = await pool.query(
      `SELECT 
        m.id,
        m.sender_id,
        m.receiver_id,
        m.content,
        m.is_read,
        m.created_at,
        sender.username as sender_username,
        sender.avatar_url as sender_avatar
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      WHERE (m.sender_id = $1 AND m.receiver_id = $2)
         OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY m.created_at DESC
      LIMIT $3 OFFSET $4`,
      [currentUserId, user_id, limit, offset]
    );

    // Marcar mensagens como lidas
    await pool.query(
      `UPDATE messages 
       SET is_read = true 
       WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false`,
      [currentUserId, user_id]
    );

    res.json({
      conversation: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao obter conversa:', error);
    res.status(500).json({ error: 'Erro ao obter conversa' });
  }
};

// Marcar mensagem como lida
exports.markAsRead = async (req, res) => {
  try {
    const { message_id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE messages 
       SET is_read = true 
       WHERE id = $1 AND receiver_id = $2
       RETURNING id, is_read`,
      [message_id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    res.json({
      message: 'Mensagem marcada como lida',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao marcar mensagem como lida:', error);
    res.status(500).json({ error: 'Erro ao marcar mensagem como lida' });
  }
};

// Deletar mensagem
exports.deleteMessage = async (req, res) => {
  try {
    const { message_id } = req.params;
    const userId = req.user.id;

    // Verificar se a mensagem pertence ao usuário
    const result = await pool.query(
      `DELETE FROM messages 
       WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)
       RETURNING id`,
      [message_id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mensagem não encontrada ou você não tem permissão' });
    }

    res.json({ message: 'Mensagem deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
    res.status(500).json({ error: 'Erro ao deletar mensagem' });
  }
};

// Obter lista de conversas
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT DISTINCT ON (other_user_id)
        other_user_id,
        other_username,
        other_avatar,
        last_message,
        last_message_time,
        unread_count
      FROM (
        SELECT 
          CASE 
            WHEN m.sender_id = $1 THEN m.receiver_id 
            ELSE m.sender_id 
          END as other_user_id,
          CASE 
            WHEN m.sender_id = $1 THEN receiver.username 
            ELSE sender.username 
          END as other_username,
          CASE 
            WHEN m.sender_id = $1 THEN receiver.avatar_url 
            ELSE sender.avatar_url 
          END as other_avatar,
          m.content as last_message,
          m.created_at as last_message_time,
          (
            SELECT COUNT(*) 
            FROM messages 
            WHERE receiver_id = $1 
              AND sender_id = CASE 
                WHEN m.sender_id = $1 THEN m.receiver_id 
                ELSE m.sender_id 
              END
              AND is_read = false
          ) as unread_count
        FROM messages m
        JOIN users sender ON m.sender_id = sender.id
        JOIN users receiver ON m.receiver_id = receiver.id
        WHERE m.sender_id = $1 OR m.receiver_id = $1
        ORDER BY m.created_at DESC
      ) conversations
      ORDER BY other_user_id, last_message_time DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao obter conversas:', error);
    res.status(500).json({ error: 'Erro ao obter lista de conversas' });
  }
};

// Obter contagem de mensagens não lidas
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT COUNT(*) as unread_count FROM messages WHERE receiver_id = $1 AND is_read = false',
      [userId]
    );

    res.json({ unread_count: parseInt(result.rows[0].unread_count) });
  } catch (error) {
    console.error('Erro ao obter contagem de mensagens não lidas:', error);
    res.status(500).json({ error: 'Erro ao obter contagem' });
  }
};

// Marcar todas as mensagens de um usuário como lidas
exports.markAllAsRead = async (req, res) => {
  try {
    const { user_id } = req.params;
    const currentUserId = req.user.id;

    const result = await pool.query(
      `UPDATE messages 
       SET is_read = true 
       WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false
       RETURNING id`,
      [currentUserId, user_id]
    );

    res.json({
      message: 'Mensagens marcadas como lidas',
      count: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao marcar mensagens como lidas:', error);
    res.status(500).json({ error: 'Erro ao marcar mensagens como lidas' });
  }
};

module.exports = exports;

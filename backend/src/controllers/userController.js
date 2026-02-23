// User Controller - Gerenciamento de perfis e configurações de usuários

const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Obter perfil do usuário
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    const result = await pool.query(
      `SELECT 
        id, 
        username, 
        email, 
        bio, 
        avatar_url, 
        is_visible, 
        show_online, 
        created_at
      FROM users 
      WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se o usuário está bloqueado pelo usuário logado
    if (req.user && req.user.id !== userId) {
      const blockCheck = await pool.query(
        'SELECT id FROM blocked_users WHERE user_id = $1 AND blocked_user_id = $2',
        [req.user.id, userId]
      );
      
      if (blockCheck.rows.length > 0) {
        return res.status(403).json({ error: 'Você bloqueou este usuário' });
      }
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ error: 'Erro ao obter perfil do usuário' });
  }
};

// Atualizar perfil do usuário
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, email } = req.body;
    const userId = req.user.id;

    // Verificar se o username já existe (se estiver sendo alterado)
    if (username) {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Nome de usuário já está em uso' });
      }
    }

    const result = await pool.query(
      `UPDATE users 
       SET username = COALESCE($1, username),
           bio = COALESCE($2, bio),
           email = COALESCE($3, email),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, username, email, bio, avatar_url, created_at`,
      [username, bio, email, userId]
    );

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

// Upload de avatar (URL ou base64)
exports.uploadAvatar = async (req, res) => {
  try {
    const { avatar_url } = req.body;
    const userId = req.user.id;

    if (!avatar_url) {
      return res.status(400).json({ error: 'URL do avatar é obrigatório' });
    }

    const result = await pool.query(
      `UPDATE users 
       SET avatar_url = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING avatar_url`,
      [avatar_url, userId]
    );

    res.json({
      message: 'Avatar atualizado com sucesso',
      avatar_url: result.rows[0].avatar_url
    });
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    res.status(500).json({ error: 'Erro ao atualizar avatar' });
  }
};

// Obter configurações do usuário
exports.getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        is_visible,
        show_online,
        allow_messages,
        email_notifications,
        push_notifications
      FROM users 
      WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter configurações:', error);
    res.status(500).json({ error: 'Erro ao obter configurações' });
  }
};

// Atualizar configurações do usuário
exports.updateSettings = async (req, res) => {
  try {
    const {
      is_visible,
      show_online,
      allow_messages,
      email_notifications,
      push_notifications
    } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE users 
       SET is_visible = COALESCE($1, is_visible),
           show_online = COALESCE($2, show_online),
           allow_messages = COALESCE($3, allow_messages),
           email_notifications = COALESCE($4, email_notifications),
           push_notifications = COALESCE($5, push_notifications),
           updated_at = NOW()
       WHERE id = $6
       RETURNING is_visible, show_online, allow_messages, email_notifications, push_notifications`,
      [is_visible, show_online, allow_messages, email_notifications, push_notifications, userId]
    );

    res.json({
      message: 'Configurações atualizadas com sucesso',
      settings: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
};

// Bloquear usuário
exports.blockUser = async (req, res) => {
  try {
    const { blocked_user_id } = req.body;
    const userId = req.user.id;

    if (userId === blocked_user_id) {
      return res.status(400).json({ error: 'Você não pode bloquear a si mesmo' });
    }

    // Verificar se o usuário existe
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [blocked_user_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se já está bloqueado
    const existingBlock = await pool.query(
      'SELECT id FROM blocked_users WHERE user_id = $1 AND blocked_user_id = $2',
      [userId, blocked_user_id]
    );

    if (existingBlock.rows.length > 0) {
      return res.status(400).json({ error: 'Usuário já está bloqueado' });
    }

    await pool.query(
      'INSERT INTO blocked_users (user_id, blocked_user_id) VALUES ($1, $2)',
      [userId, blocked_user_id]
    );

    res.json({ message: 'Usuário bloqueado com sucesso' });
  } catch (error) {
    console.error('Erro ao bloquear usuário:', error);
    res.status(500).json({ error: 'Erro ao bloquear usuário' });
  }
};

// Desbloquear usuário
exports.unblockUser = async (req, res) => {
  try {
    const { blocked_user_id } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM blocked_users WHERE user_id = $1 AND blocked_user_id = $2 RETURNING id',
      [userId, blocked_user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bloqueio não encontrado' });
    }

    res.json({ message: 'Usuário desbloqueado com sucesso' });
  } catch (error) {
    console.error('Erro ao desbloquear usuário:', error);
    res.status(500).json({ error: 'Erro ao desbloquear usuário' });
  }
};

// Obter lista de usuários bloqueados
exports.getBlockedUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        u.id,
        u.username,
        u.avatar_url,
        bu.created_at as blocked_at
      FROM blocked_users bu
      JOIN users u ON bu.blocked_user_id = u.id
      WHERE bu.user_id = $1
      ORDER BY bu.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao obter usuários bloqueados:', error);
    res.status(500).json({ error: 'Erro ao obter lista de bloqueados' });
  }
};

// Alterar senha
exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.id;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 8 caracteres' });
    }

    // Verificar senha atual
    const user = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    const isValidPassword = await bcrypt.compare(current_password, user.rows[0].password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
};

// Deletar conta
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória para deletar a conta' });
    }

    // Verificar senha
    const user = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Soft delete - apenas marca como deletado
    await pool.query(
      'UPDATE users SET is_active = false, deleted_at = NOW() WHERE id = $1',
      [userId]
    );

    res.json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({ error: 'Erro ao deletar conta' });
  }
};

module.exports = exports;

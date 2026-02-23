import { CheckIn, Location, User } from '../models/index.js';
import { Op } from 'sequelize';

// Fazer check-in em um local
export const createCheckIn = async (req, res) => {
  try {
    const { locationId, latitude, longitude, anonymous = true } = req.body;

    // Verificar se o local existe
    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    // Desativar check-ins anteriores do usuário
    await CheckIn.update(
      { active: false },
      { where: { userId: req.userId, active: true } }
    );

    // Criar novo check-in
    const checkIn = await CheckIn.create({
      userId: req.userId,
      locationId,
      latitude,
      longitude,
      anonymous,
      active: true
    });

    res.status(201).json({
      message: 'Check-in realizado com sucesso',
      checkIn
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remover check-in (checkout)
export const removeCheckIn = async (req, res) => {
  try {
    const checkIn = await CheckIn.findOne({
      where: {
        userId: req.userId,
        active: true
      }
    });

    if (!checkIn) {
      return res.status(404).json({ error: 'Nenhum check-in ativo encontrado' });
    }

    await checkIn.update({ active: false });

    res.json({ message: 'Check-out realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter check-in ativo do usuário
export const getActiveCheckIn = async (req, res) => {
  try {
    const checkIn = await CheckIn.findOne({
      where: {
        userId: req.userId,
        active: true
      },
      include: [{
        model: Location,
        attributes: ['id', 'name', 'address', 'latitude', 'longitude']
      }]
    });

    if (!checkIn) {
      return res.json({ checkIn: null });
    }

    res.json({ checkIn });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar usuários ativos em um local
export const getActiveUsersAtLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    const activeCheckIns = await CheckIn.findAll({
      where: {
        locationId,
        active: true,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 4 * 60 * 60 * 1000) // Últimas 4 horas
        }
      },
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }]
    });

    const users = activeCheckIns.map(checkIn => ({
      anonymous: checkIn.anonymous,
      checkedInAt: checkIn.createdAt,
      user: checkIn.anonymous ? null : checkIn.User
    }));

    res.json({
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Limpar check-ins expirados (para cron job)
export const cleanExpiredCheckIns = async () => {
  try {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    
    await CheckIn.update(
      { active: false },
      {
        where: {
          active: true,
          createdAt: {
            [Op.lt]: fourHoursAgo
          }
        }
      }
    );

    console.log('Check-ins expirados limpos com sucesso');
  } catch (error) {
    console.error('Erro ao limpar check-ins:', error);
  }
};

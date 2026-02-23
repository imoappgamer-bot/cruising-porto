import { Alert, Location, User } from '../models/index.js';
import { Op } from 'sequelize';

// Função para calcular distância (reutilizada do locationController)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Criar alerta de segurança
export const createAlert = async (req, res) => {
  try {
    const { locationId, type, description, latitude, longitude } = req.body;

    // Validar tipo de alerta
    const validTypes = ['police', 'robbery', 'homophobia', 'harassment', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Tipo de alerta inválido',
        validTypes 
      });
    }

    // Verificar se o local existe
    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    // Limitar descrição
    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Descrição muito longa (máx. 500 caracteres)' });
    }

    // Criar alerta
    const alert = await Alert.create({
      userId: req.userId,
      locationId,
      type,
      description: description || '',
      latitude: latitude || location.latitude,
      longitude: longitude || location.longitude,
      active: true
    });

    const alertWithDetails = await Alert.findByPk(alert.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Location,
          attributes: ['id', 'name', 'address']
        }
      ]
    });

    res.status(201).json({
      message: 'Alerta criado com sucesso',
      alert: alertWithDetails
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar alertas próximos (nas últimas 24 horas)
export const getNearbyAlerts = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5, hours = 24 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude e longitude são obrigatórias' });
    }

    const timeLimit = new Date(Date.now() - hours * 60 * 60 * 1000);

    const alerts = await Alert.findAll({
      where: {
        active: true,
        createdAt: {
          [Op.gte]: timeLimit
        }
      },
      include: [
        {
          model: Location,
          attributes: ['id', 'name', 'address', 'latitude', 'longitude']
        },
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Filtrar por distância
    const nearbyAlerts = alerts
      .map(alert => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          alert.latitude,
          alert.longitude
        );
        return {
          ...alert.toJSON(),
          distance: distance.toFixed(2)
        };
      })
      .filter(alert => alert.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    // Agregar por tipo
    const alertsByType = nearbyAlerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      alerts: nearbyAlerts,
      total: nearbyAlerts.length,
      byType: alertsByType,
      radius: parseFloat(radius),
      hours: parseInt(hours)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter alertas de um local específico
export const getLocationAlerts = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { hours = 24 } = req.query;

    const timeLimit = new Date(Date.now() - hours * 60 * 60 * 1000);

    const alerts = await Alert.findAll({
      where: {
        locationId,
        active: true,
        createdAt: {
          [Op.gte]: timeLimit
        }
      },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });

    const alertsByType = alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      alerts,
      total: alerts.length,
      byType: alertsByType
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Desativar alerta (apenas autor)
export const dismissAlert = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findByPk(alertId);

    if (!alert) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }

    // Apenas o autor pode desativar
    if (alert.userId !== req.userId) {
      return res.status(403).json({ error: 'Apenas o autor pode desativar este alerta' });
    }

    await alert.update({ active: false });

    res.json({ message: 'Alerta desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter estatísticas de segurança de um local
export const getLocationSafetyStats = async (req, res) => {
  try {
    const { locationId } = req.params;

    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    // Alertas nas últimas 24 horas
    const last24h = await Alert.count({
      where: {
        locationId,
        active: true,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    // Alertas na última semana
    const lastWeek = await Alert.count({
      where: {
        locationId,
        active: true,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Alertas por tipo (semana)
    const alertsByType = await Alert.findAll({
      where: {
        locationId,
        active: true,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      attributes: ['type'],
      group: ['type'],
      raw: true
    });

    res.json({
      location: {
        id: location.id,
        name: location.name,
        safetyRating: location.safetyRating
      },
      alerts: {
        last24h,
        lastWeek,
        byType: alertsByType
      },
      safetyLevel: last24h === 0 ? 'safe' : last24h < 3 ? 'moderate' : 'caution'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Limpar alertas antigos (cron job)
export const cleanOldAlerts = async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    await Alert.update(
      { active: false },
      {
        where: {
          active: true,
          createdAt: {
            [Op.lt]: sevenDaysAgo
          }
        }
      }
    );

    console.log('Alertas antigos limpos com sucesso');
  } catch (error) {
    console.error('Erro ao limpar alertas:', error);
  }
};

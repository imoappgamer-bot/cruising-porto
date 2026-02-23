import { Location, CheckIn, Comment, User } from '../models/index.js';
import { Op } from 'sequelize';

// Função para calcular distância entre dois pontos (Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Listar todos os locais
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      include: [
        {
          model: CheckIn,
          attributes: ['id'],
          where: { active: true },
          required: false
        }
      ]
    });

    const locationsWithStats = locations.map(location => ({
      ...location.toJSON(),
      activeUsers: location.CheckIns ? location.CheckIns.length : 0
    }));

    res.json(locationsWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar locais próximos
export const getNearbyLocations = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude e longitude são obrigatórias' });
    }

    const locations = await Location.findAll({
      include: [
        {
          model: CheckIn,
          attributes: ['id'],
          where: { active: true },
          required: false
        }
      ]
    });

    const nearbyLocations = locations
      .map(location => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          location.latitude,
          location.longitude
        );
        return {
          ...location.toJSON(),
          distance: distance.toFixed(2),
          activeUsers: location.CheckIns ? location.CheckIns.length : 0
        };
      })
      .filter(location => location.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyLocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter detalhes de um local
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id, {
      include: [
        {
          model: CheckIn,
          where: { active: true },
          required: false,
          attributes: ['id', 'createdAt']
        },
        {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'username']
          }],
          order: [['createdAt', 'DESC']],
          limit: 20
        }
      ]
    });

    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    const locationData = {
      ...location.toJSON(),
      activeUsers: location.CheckIns ? location.CheckIns.length : 0
    };

    res.json(locationData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Adicionar avaliação a um local
export const rateLocation = async (req, res) => {
  try {
    const { rating } = req.body;
    const location = await Location.findByPk(req.params.id);

    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Avaliação deve estar entre 1 e 5' });
    }

    // Atualizar média de avaliação
    const totalRatings = location.totalRatings || 0;
    const currentRating = location.rating || 0;
    const newTotalRatings = totalRatings + 1;
    const newRating = ((currentRating * totalRatings) + rating) / newTotalRatings;

    await location.update({
      rating: newRating,
      totalRatings: newTotalRatings
    });

    res.json({ 
      message: 'Avaliação adicionada com sucesso',
      rating: newRating,
      totalRatings: newTotalRatings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

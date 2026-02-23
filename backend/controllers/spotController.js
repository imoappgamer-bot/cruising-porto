// spotController.js - Controlador para operações de spots de cruising

// Listar todos os spots com filtros opcionais
exports.listSpots = async (req, res) => {
  try {
    const { limit = 20, offset = 0, type, location } = req.query;

    // Simular busca no banco de dados
    // Em produção, usar consulta ao banco com filtros
    const spots = [
      {
        id: 1,
        name: 'Praia da Ribeira',
        description: 'Spot popular junto ao rio, com boa vista',
        location: 'Ribeira',
        latitude: 41.1579,
        longitude: -8.6291,
        type: 'Praia',
        rating: 4.5,
        visits: 234,
        safety: 'moderate',
      },
      {
        id: 2,
        name: 'Parque da Cidade',
        description: 'Zona verde com várias áreas isoladas',
        location: 'Parque',
        latitude: 41.1621,
        longitude: -8.6471,
        type: 'Parque',
        rating: 4.2,
        visits: 189,
        safety: 'high',
      },
      {
        id: 3,
        name: 'Zona Ribeirinha',
        description: 'Junto ao rio, espaço discreto',
        location: 'Porto Centro',
        latitude: 41.1592,
        longitude: -8.6238,
        type: 'Ribeira',
        rating: 3.8,
        visits: 156,
        safety: 'moderate',
      },
    ];

    // Aplicar filtros se fornecidos
    let filtered = spots;
    if (type) {
      filtered = filtered.filter((s) => s.type === type);
    }
    if (location) {
      filtered = filtered.filter((s) =>
        s.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Aplicar paginação
    const paginatedSpots = filtered.slice(offset, offset + parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        spots: paginatedSpots,
        total: filtered.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar spots',
      error: error.message,
    });
  }
};

// Obter detalhes de um spot específico
exports.getSpotDetail = async (req, res) => {
  try {
    const { spotId } = req.params;

    // Simular busca no banco
    const spot = {
      id: parseInt(spotId),
      name: 'Praia da Ribeira',
      description: 'Spot popular junto ao rio, com boa vista. Muito discreto e seguro.',
      fullDescription: 'Localizado na zona histórica da Ribeira, este spot oferece privacidade relativa e é frequentado principalmente durante as noites de fim de semana.',
      location: 'Ribeira',
      latitude: 41.1579,
      longitude: -8.6291,
      type: 'Praia',
      rating: 4.5,
      visits: 234,
      safety: 'moderate',
      photos: ['photo1.jpg', 'photo2.jpg'],
      amenities: ['Estacionamento', 'Iluminação noturna', 'Acesso fácil'],
      bestTimes: ['Quinta-feira à noite', 'Sexta-feira à noite', 'Sábado'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-20'),
    };

    if (!spot) {
      return res.status(404).json({
        success: false,
        message: 'Spot não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: { spot },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter detalhes do spot',
      error: error.message,
    });
  }
};

// Avaliar um spot
exports.rateSpot = async (req, res) => {
  try {
    const { spotId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    // Validar rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating deve ser entre 1 e 5',
      });
    }

    // Em produção, salvar no banco de dados
    res.status(200).json({
      success: true,
      message: 'Avaliação registrada com sucesso',
      data: {
        spotId,
        userId,
        rating,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao avaliar spot',
      error: error.message,
    });
  }
};

// Reportar um spot
exports.reportSpot = async (req, res) => {
  try {
    const { spotId } = req.params;
    const { reason, description } = req.body;
    const userId = req.user.id;

    // Validar reason
    const validReasons = ['inseguro', 'fechado', 'lixo', 'outro'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: 'Motivo de report inválido',
      });
    }

    // Em produção, salvar no banco de dados
    res.status(201).json({
      success: true,
      message: 'Report enviado com sucesso',
      data: {
        spotId,
        userId,
        reason,
        description,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao reportar spot',
      error: error.message,
    });
  }
};

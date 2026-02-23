// favoriteController.js - Controlador para gerenciar spots favoritos dos usuários

// Adicionar spot aos favoritos
exports.addFavorite = async (req, res) => {
  try {
    const { spotId } = req.body;
    const userId = req.user.id;

    if (!spotId) {
      return res.status(400).json({
        success: false,
        message: 'spotId é obrigatório',
      });
    }

    // Em produção, verificar se o spot existe e se já não está nos favoritos
    // Simulação de adição ao banco de dados
    const favorite = {
      id: Math.floor(Math.random() * 1000),
      userId,
      spotId,
      createdAt: new Date(),
    };

    res.status(201).json({
      success: true,
      message: 'Spot adicionado aos favoritos',
      data: { favorite },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar favorito',
      error: error.message,
    });
  }
};

// Remover spot dos favoritos
exports.removeFavorite = async (req, res) => {
  try {
    const { spotId } = req.params;
    const userId = req.user.id;

    // Em produção, buscar e deletar do banco de dados
    // Verificar se o favorito pertence ao usuário

    res.status(200).json({
      success: true,
      message: 'Spot removido dos favoritos',
      data: {
        userId,
        spotId,
        removedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao remover favorito',
      error: error.message,
    });
  }
};

// Listar todos os favoritos do usuário
exports.listFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    // Em produção, buscar do banco com join para trazer detalhes dos spots
    const favorites = [
      {
        id: 1,
        userId,
        spotId: 1,
        spot: {
          id: 1,
          name: 'Praia da Ribeira',
          description: 'Spot popular junto ao rio',
          location: 'Ribeira',
          rating: 4.5,
          type: 'Praia',
        },
        createdAt: new Date('2025-02-20'),
      },
      {
        id: 2,
        userId,
        spotId: 2,
        spot: {
          id: 2,
          name: 'Parque da Cidade',
          description: 'Zona verde com várias áreas isoladas',
          location: 'Parque',
          rating: 4.2,
          type: 'Parque',
        },
        createdAt: new Date('2025-02-18'),
      },
    ];

    // Aplicar paginação
    const paginatedFavorites = favorites.slice(
      offset,
      offset + parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: {
        favorites: paginatedFavorites,
        total: favorites.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar favoritos',
      error: error.message,
    });
  }
};

// Verificar se um spot está nos favoritos
exports.checkFavorite = async (req, res) => {
  try {
    const { spotId } = req.params;
    const userId = req.user.id;

    // Em produção, verificar no banco de dados
    const isFavorite = Math.random() > 0.5; // Simulação

    res.status(200).json({
      success: true,
      data: {
        isFavorite,
        spotId,
        userId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar favorito',
      error: error.message,
    });
  }
};

const express = require('express');
const router = express.Router();

// Importar rotas
const authRoutes = require('./auth.routes');
const locationRoutes = require('./location.routes');
const checkinRoutes = require('./checkin.routes');
const commentRoutes = require('./comment.routes');
const alertRoutes = require('./alert.routes');
const userRoutes = require('./user.routes');
const messageRoutes = require('./message.routes');

// Rotas da API
router.use('/auth', authRoutes);
router.use('/locations', locationRoutes);
router.use('/checkins', checkinRoutes);
router.use('/comments', commentRoutes);
router.use('/alerts', alertRoutes);
router.use('/users', userRoutes);
router.use('/messages', messageRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'cruising-porto-api'
  });
});

module.exports = router;

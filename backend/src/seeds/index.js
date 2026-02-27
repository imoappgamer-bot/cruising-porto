import sequelize from '../config/database.js';
import { User, Location } from '../models/index.js';
import bcrypt from 'bcryptjs';

// =============================================
// SEED DATA - Dados iniciais para Cruising Porto
// =============================================

const seedUsers = async () => {
  console.log('Seeding users...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@cruisingporto.app',
      password: passwordHash,
      nickname: 'admin',
      age: 30,
      gender: 'other',
      role: 'versatile',
      isAdmin: true,
      consentAccepted: true,
      consentAcceptedAt: new Date(),
    },
    {
      email: 'user1@example.com',
      password: passwordHash,
      nickname: 'porto_user1',
      age: 28,
      gender: 'male',
      role: 'top',
      consentAccepted: true,
      consentAcceptedAt: new Date(),
    },
    {
      email: 'user2@example.com',
      password: passwordHash,
      nickname: 'porto_user2',
      age: 35,
      gender: 'male',
      role: 'bottom',
      consentAccepted: true,
      consentAcceptedAt: new Date(),
    },
  ];

  for (const userData of users) {
    await User.findOrCreate({
      where: { email: userData.email },
      defaults: userData,
    });
  }

  console.log('Users seeded successfully.');
};

const seedLocations = async () => {
  console.log('Seeding locations...');

  const locations = [
    {
      name: 'Parque da Cidade',
      description: 'Grande parque urbano junto ao mar. Area tranquila com varios percursos.',
      type: 'park',
      city: 'Porto',
      district: 'Nevogilde',
      latitude: 41.1731,
      longitude: -8.6774,
      isActive: true,
      averageRating: 4.2,
      totalRatings: 15,
      amenities: ['estacionamento', 'wc_publico', 'iluminacao'],
      bestTimes: ['tarde', 'noite'],
      safetyLevel: 'medium',
    },
    {
      name: 'Jardins do Palacio de Cristal',
      description: 'Jardins historicos com vistas para o Douro. Popular ao fim do dia.',
      type: 'park',
      city: 'Porto',
      district: 'Massarelos',
      latitude: 41.1467,
      longitude: -8.6261,
      isActive: true,
      averageRating: 4.5,
      totalRatings: 23,
      amenities: ['wc_publico', 'iluminacao', 'transporte_publico'],
      bestTimes: ['tarde', 'anoitecer'],
      safetyLevel: 'high',
    },
    {
      name: 'Praia do Ourigo',
      description: 'Zona junto a praia com area de dunas. Muito frequentada no verao.',
      type: 'beach',
      city: 'Porto',
      district: 'Foz do Douro',
      latitude: 41.1498,
      longitude: -8.6818,
      isActive: true,
      averageRating: 3.9,
      totalRatings: 18,
      amenities: ['estacionamento', 'bar_proximo'],
      bestTimes: ['manha', 'tarde'],
      safetyLevel: 'medium',
    },
    {
      name: 'WC Publico - Rotunda da Boavista',
      description: 'Casa de banho publica proxima da Rotunda. Frequentada regularmente.',
      type: 'restroom',
      city: 'Porto',
      district: 'Boavista',
      latitude: 41.1578,
      longitude: -8.6390,
      isActive: true,
      averageRating: 2.8,
      totalRatings: 31,
      amenities: ['wc_publico'],
      bestTimes: ['almoco', 'tarde'],
      safetyLevel: 'low',
    },
    {
      name: 'Centro Comercial NorteShopping',
      description: 'Zona dos WCs do piso inferior. Bastante movimentado em dias de semana.',
      type: 'mall',
      city: 'Matosinhos',
      district: 'Senhora da Hora',
      latitude: 41.1957,
      longitude: -8.6378,
      isActive: true,
      averageRating: 3.5,
      totalRatings: 44,
      amenities: ['estacionamento', 'wc_publico', 'transporte_publico', 'iluminacao'],
      bestTimes: ['almoco', 'tarde'],
      safetyLevel: 'medium',
    },
    {
      name: 'Parque de Serralves',
      description: 'Parque do Museu de Serralves. Excelente para caminhadas discretas.',
      type: 'park',
      city: 'Porto',
      district: 'Lordelo do Ouro',
      latitude: 41.1596,
      longitude: -8.6582,
      isActive: true,
      averageRating: 4.7,
      totalRatings: 29,
      amenities: ['estacionamento', 'wc_publico', 'iluminacao', 'transporte_publico'],
      bestTimes: ['manha', 'tarde'],
      safetyLevel: 'high',
    },
  ];

  for (const locationData of locations) {
    await Location.findOrCreate({
      where: { name: locationData.name, city: locationData.city },
      defaults: locationData,
    });
  }

  console.log('Locations seeded successfully.');
};

const runSeeds = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync models (creates tables if not exist)
    await sequelize.sync({ alter: false });

    await seedUsers();
    await seedLocations();

    console.log('All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
};

runSeeds();

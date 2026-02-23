import sequelize from './src/config/database.js';
import { Location } from './src/models/index.js';
import bcrypt from 'bcryptjs';
import { User } from './src/models/index.js';

const seedLocations = async () => {
  const locations = [
    {
      name: 'Parque Serralves',
      description: 'Parque junto ao museu de arte moderna. Área arborizada e tranquila com vistas para o rio.',
      address: 'Avenida Serralves, 977, Porto',
      latitude: 41.1579,
      longitude: -8.6291,
      type: 'park',
      safetyRating: 8,
      rating: 4.2,
      totalRatings: 45
    },
    {
      name: 'Jardim Serralves',
      description: 'Jardim público bem mantido. Popular ao entardecer.',
      address: 'Rua de Serralves, Porto',
      latitude: 41.1585,
      longitude: -8.6305,
      type: 'park',
      safetyRating: 7,
      rating: 4.0,
      totalRatings: 32
    },
    {
      name: 'Praia da Maia',
      description: 'Praia urbana com área de cruising conhecida. Frequentada principalmente à noite.',
      address: 'Praia da Maia, 4400-382 Vila Nova de Gaia',
      latitude: 41.1194,
      longitude: -8.6481,
      type: 'beach',
      safetyRating: 6,
      rating: 3.8,
      totalRatings: 58
    },
    {
      name: 'Praça Carlos Alberto',
      description: 'Monumento histórico. Área movimentada durante o dia e à noite.',
      address: 'Prça Carlos Alberto, 4000 Porto',
      latitude: 41.1596,
      longitude: -8.6291,
      type: 'square',
      safetyRating: 8,
      rating: 4.1,
      totalRatings: 42
    },
    {
      name: 'Banheiros do Bolhão',
      description: 'Histórico. Localizado próximo ao mercado do Bolhão, área central.',
      address: 'Rua Formosa, Porto',
      latitude: 41.1406,
      longitude: -8.6149,
      type: 'restroom',
      safetyRating: 5,
      rating: 3.5,
      totalRatings: 35
    },
    {
      name: 'Livraria Lello',
      description: 'Nas proximidades desta livraria histórica há áreas de encontro.',
      address: 'Rua das Carmelitas, 144, Porto',
      latitude: 41.1443,
      longitude: -8.6179,
      type: 'landmark',
      safetyRating: 8,
      rating: 4.3,
      totalRatings: 28
    },
    {
      name: 'Ponte Luís I',
      description: 'Ícone da cidade. Beleza arquitetônica e vistas panoramicas. Popular ao entardecer.',
      address: 'Porto - Vila Nova de Gaia',
      latitude: 41.1767,
      longitude: -8.6421,
      type: 'landmark',
      safetyRating: 7,
      rating: 4.5,
      totalRatings: 64
    },
    {
      name: 'Miradouro da Vitoria',
      description: 'Terrace com vistas panoramicas. Ambiente agradavel com boa iluminacao noturna.',
      address: 'R. de Miragaia, Porto',
      latitude: 41.1725,
      longitude: -8.6327,
      type: 'viewpoint',
      safetyRating: 8,
      rating: 4.4,
      totalRatings: 51
    }
  ];

  try {
    for (const location of locations) {
      await Location.findOrCreate({
        where: { address: location.address },
        defaults: location
      });
    }
    console.log('✓ Locais criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar locais:', error);
  }
};

const seedUsers = async () => {
  const users = [
    {
      username: 'usuario_teste',
      email: 'teste@cruising.pt',
      password: await bcrypt.hash('senha123', 10),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=usuario1',
      isVerified: true
    },
    {
      username: 'explorador_porto',
      email: 'explorador@cruising.pt',
      password: await bcrypt.hash('senha123', 10),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=usuario2',
      isVerified: true
    }
  ];

  try {
    for (const user of users) {
      await User.findOrCreate({
        where: { email: user.email },
        defaults: user
      });
    }
    console.log('✓ Usuários de teste criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuários:', error);
  }
};

const runSeed = async () => {
  try {
    console.log('\n🏛️ Sincronizando banco de dados...');
    await sequelize.sync({ alter: true });
    console.log('✓ Banco de dados sincronizado!\n');

    console.log('🌱 Populando banco de dados...');
    await seedLocations();
    await seedUsers();
    console.log('\n🌟 Seed data criado com sucesso!\n');
  } catch (error) {
    console.error('Erro durante seed:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

runSeed();

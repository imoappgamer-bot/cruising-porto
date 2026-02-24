/**
 * Testes de Integração do Backend - Cruising Porto
 * Valida fluxos críticos: Autenticação, Locations, Messages
 */

const request = require('supertest');
const app = require('../index');

describe('API Integration Tests - Cruising Porto', () => {
  let authToken;
  let userId;
  let locationId;
  let messageId;

  // ==================== AUTHENTICATION ====================
  describe('POST /api/users/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'João Teste',
          email: 'joao@test.com',
          password: 'senha123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('joao@test.com');
      
      authToken = res.body.token;
      userId = res.body.user.id;
    });

    it('deve retornar erro se email já existe', async () => {
      // Registrar primeira vez
      await request(app)
        .post('/api/users/register')
        .send({
          name: 'Teste',
          email: 'duplicate@test.com',
          password: 'senha123'
        });

      // Tentar registrar novamente
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Outro',
          email: 'duplicate@test.com',
          password: 'senha456'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      // Registrar usuário
      await request(app)
        .post('/api/users/register')
        .send({
          name: 'Login Test',
          email: 'login@test.com',
          password: 'senha123'
        });

      // Fazer login
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@test.com',
          password: 'senha123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token;
    });

    it('deve retornar erro com senha incorreta', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@test.com',
          password: 'senhaErrada'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  // ==================== LOCATIONS ====================
  describe('GET /api/locations', () => {
    it('deve listar todas as locations com autenticação', async () => {
      const res = await request(app)
        .get('/api/locations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      
      if (res.body.length > 0) {
        locationId = res.body[0].id;
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('latitude');
        expect(res.body[0]).toHaveProperty('longitude');
      }
    });

    it('deve retornar 401 sem token de autenticação', async () => {
      const res = await request(app).get('/api/locations');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/locations/:id', () => {
    it('deve obter detalhes de uma location', async () => {
      const res = await request(app)
        .get(`/api/locations/${locationId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('description');
    });
  });

  // ==================== MESSAGES ====================
  describe('POST /api/messages', () => {
    it('deve enviar uma mensagem autenticada', async () => {
      const res = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          recipientId: userId,
          content: 'Oi! Tudo bem?'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.content).toBe('Oi! Tudo bem?');
      messageId = res.body.id;
    });

    it('deve retornar erro se content está vazio', async () => {
      const res = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          recipientId: userId,
          content: ''
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/messages/inbox', () => {
    it('deve listar caixa de entrada autenticada', async () => {
      const res = await request(app)
        .get('/api/messages/inbox')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ==================== PROFILE ====================
  describe('GET /api/users/profile', () => {
    it('deve retornar perfil do usuário autenticado', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('name');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('deve atualizar perfil do usuário', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'João Atualizado',
          bio: 'Novo bio interessante'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('João Atualizado');
    });
  });

  // ==================== CHECKINS ====================
  describe('POST /api/checkins', () => {
    it('deve criar um novo check-in', async () => {
      if (!locationId) {
        console.log('Pulando test de check-in - sem locationId');
        return;
      }

      const res = await request(app)
        .post('/api/checkins')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          locationId: locationId
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  // ==================== ERROR HANDLING ====================
  describe('Error Handling', () => {
    it('deve retornar 404 para rota não existente', async () => {
      const res = await request(app).get('/api/rota-inexistente');
      expect(res.statusCode).toBe(404);
    });

    it('deve retornar 400 para JSON inválido', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send('{ json inválido');
      
      expect([400, 422]).toContain(res.statusCode);
    });
  });
});

/**
 * Instruções para executar testes:
 * 
 * 1. Instalar dependências:
 *    npm install --save-dev jest supertest
 * 
 * 2. Adicionar ao package.json:
 *    "test": "jest --detectOpenHandles"
 * 
 * 3. Executar:
 *    npm test
 * 
 * 4. Com cobertura:
 *    npm test -- --coverage
 */

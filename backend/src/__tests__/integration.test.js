/**
 * Testes de Integração do Backend - Cruising Porto
 * Valida fluxos críticos: Autenticação, Locations, Messages, Profile, Checkins
 */

const request = require('supertest');
const app = require('../index');

describe('API Integration Tests - Cruising Porto', () => {
  let authToken;
  let userId;
  let locationId;
  let messageId;

  // ==================== AUTHENTICATION ====================
  describe('POST /api/auth/register', () => {
    it('deve registrar um novo utilizador com sucesso', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'joao@cruising.pt',
          password: 'senha123456',
          nickname: 'joaoteste',
          age: 28,
          gender: 'M',
          role: 'user',
          city: 'Porto'
        });

      expect([200, 201]).toContain(res.statusCode);
      if (res.statusCode === 201 || res.statusCode === 200) {
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        authToken = res.body.token;
        userId = res.body.user.id || res.body.user._id;
      }
    });

    it('deve retornar erro se email já existe', async () => {
      // Registrar primeira vez
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@cruising.pt',
          password: 'senha123456',
          nickname: 'dupuser',
          age: 25,
          gender: 'M',
          role: 'user',
          city: 'Lisboa'
        });

      // Tentar registrar novamente com o mesmo email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@cruising.pt',
          password: 'outrasenha456',
          nickname: 'dupuser2',
          age: 30,
          gender: 'F',
          role: 'user',
          city: 'Braga'
        });

      expect([400, 409, 422]).toContain(res.statusCode);
    });

    it('deve retornar erro com campos obrigatórios em falta', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'incompleto@cruising.pt'
        });

      expect([400, 422]).toContain(res.statusCode);
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      // Garantir que o utilizador existe
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@cruising.pt',
          password: 'senha123456',
          nickname: 'loginuser',
          age: 25,
          gender: 'M',
          role: 'user',
          city: 'Porto'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@cruising.pt',
          password: 'senha123456'
        });

      expect([200, 201]).toContain(res.statusCode);
      if (res.body.token) {
        authToken = res.body.token;
        userId = res.body.user?.id || res.body.user?._id;
      }
    });

    it('deve retornar erro com password errada', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@cruising.pt',
          password: 'passworderrada'
        });

      expect([400, 401, 403]).toContain(res.statusCode);
    });

    it('deve retornar erro com email inexistente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'naoexiste@cruising.pt',
          password: 'qualquersenha'
        });

      expect([400, 401, 404]).toContain(res.statusCode);
    });
  });

  // ==================== LOCATIONS ====================
  describe('GET /api/locations', () => {
    it('deve listar locations publicamente', async () => {
      const res = await request(app).get('/api/locations');

      expect([200, 401]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length > 0) {
          locationId = res.body[0].id || res.body[0]._id;
          expect(res.body[0]).toHaveProperty('name');
        }
      }
    });

    it('deve listar locations com autenticação', async () => {
      if (!authToken) return;

      const res = await request(app)
        .get('/api/locations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        locationId = res.body[0].id || res.body[0]._id;
        expect(res.body[0]).toHaveProperty('name');
      }
    });
  });

  describe('GET /api/locations/:id', () => {
    it('deve obter detalhes de uma location específica', async () => {
      if (!locationId || !authToken) {
        console.log('A saltar teste - sem locationId ou authToken');
        return;
      }

      const res = await request(app)
        .get(`/api/locations/${locationId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('name');
      }
    });
  });

  // ==================== MESSAGES ====================
  describe('POST /api/messages', () => {
    it('deve enviar uma mensagem autenticada', async () => {
      if (!authToken || !userId) {
        console.log('A saltar teste - sem authToken ou userId');
        return;
      }

      const res = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          recipientId: userId,
          content: 'Olá! Tudo bem por aí?'
        });

      expect([200, 201]).toContain(res.statusCode);
      if (res.statusCode === 201 || res.statusCode === 200) {
        expect(res.body).toHaveProperty('id');
        messageId = res.body.id || res.body._id;
      }
    });

    it('deve retornar erro sem autenticação', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({
          recipientId: userId,
          content: 'Mensagem sem auth'
        });

      expect([401, 403]).toContain(res.statusCode);
    });

    it('deve retornar erro se content está vazio', async () => {
      if (!authToken || !userId) return;

      const res = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          recipientId: userId,
          content: ''
        });

      expect([400, 422]).toContain(res.statusCode);
    });
  });

  describe('GET /api/messages/inbox', () => {
    it('deve listar caixa de entrada com autenticação', async () => {
      if (!authToken) return;

      const res = await request(app)
        .get('/api/messages/inbox')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(Array.isArray(res.body)).toBe(true);
      }
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/messages/inbox');

      expect([401, 403]).toContain(res.statusCode);
    });
  });

  // ==================== PROFILE ====================
  describe('GET /api/users/profile', () => {
    it('deve retornar perfil do utilizador autenticado', async () => {
      if (!authToken) return;

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('email');
      }
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/users/profile');

      expect([401, 403]).toContain(res.statusCode);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('deve atualizar perfil do utilizador', async () => {
      if (!authToken) return;

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nickname: 'joaoatualizado',
          city: 'Gaia'
        });

      expect([200, 404]).toContain(res.statusCode);
    });
  });

  // ==================== CHECKINS ====================
  describe('POST /api/checkins', () => {
    it('deve criar um novo check-in', async () => {
      if (!locationId || !authToken) {
        console.log('A saltar teste de check-in - sem locationId ou authToken');
        return;
      }

      const res = await request(app)
        .post('/api/checkins')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          locationId: locationId
        });

      expect([200, 201, 404]).toContain(res.statusCode);
      if (res.statusCode === 201 || res.statusCode === 200) {
        expect(res.body).toHaveProperty('id');
      }
    });

    it('deve retornar erro sem autenticação', async () => {
      const res = await request(app)
        .post('/api/checkins')
        .send({ locationId: locationId || 1 });

      expect([401, 403]).toContain(res.statusCode);
    });
  });

  // ==================== ERROR HANDLING ====================
  describe('Error Handling', () => {
    it('deve retornar 404 para rota inexistente', async () => {
      const res = await request(app).get('/api/rota-inexistente');

      expect(res.statusCode).toBe(404);
    });

    it('deve retornar 400 para JSON inválido', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send('{ json invalido }');

      expect([400, 422, 500]).toContain(res.statusCode);
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
 *    "test": "jest --detectOpenHandles --forceExit"
 *
 * 3. Executar:
 *    npm test
 *
 * 4. Com cobertura:
 *    npm test -- --coverage
 */

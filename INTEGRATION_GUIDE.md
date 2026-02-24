# 🔗 Guia de Integração - Mobile, Web e Backend

## Status Atual (Fevereiro 2026)

✅ **Backend**: 85% Completo
✅ **Web Frontend**: 85% Completo  
🟡 **Mobile**: 60% Completo

---

## Arquitetura da Aplicação

```
┌─────────────────────────────────────────────────────┐
│              Cruising Porto Full Stack              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Mobile (React Native/Expo)                         │
│  └─ LoginScreen ✅                                  │
│  └─ RegisterScreen ✅                               │
│  └─ HomeScreen ✅                                   │
│  └─ MapScreen ✅                                    │
│  └─ SpotsScreen ✅                                  │
│  └─ SpotDetailScreen ✅                             │
│  └─ ProfileScreen ✅                                │
│  └─ MessagesScreen ✅                               │
│                                                     │
│  Web (React + Vite)                                │
│  └─ Auth.jsx ✅                                     │
│  └─ Map.jsx ✅                                      │
│  └─ Location.jsx ✅                                 │
│  └─ Profile.jsx ✅                                  │
│                                                     │
│                    API (Express.js)                 │
│  ├─ POST /api/users/register                        │
│  ├─ POST /api/users/login                           │
│  ├─ GET /api/users/profile                          │
│  ├─ PUT /api/users/profile                          │
│  ├─ GET /api/spots                                  │
│  ├─ GET /api/spots/:id                              │
│  ├─ POST /api/messages                              │
│  └─ GET /api/messages/inbox                         │
│                                                     │
│            Database (PostgreSQL)                    │
│  ├─ users                                           │
│  ├─ locations                                       │
│  ├─ messages                                        │
│  ├─ check_ins                                       │
│  └─ alerts                                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 1. Setup Local do Desenvolvimento

### 1.1 Preparar o Banco de Dados

```bash
# No diretório raiz
docker-compose up -d postgres redis

# Aguarde até que o PostgreSQL esteja rodando
sleep 10

# Crie as tabelas
cd backend
node src/index.js
```

### 1.2 Iniciar o Backend

```bash
cd backend
npm install
npm run dev

# Backend rodando em: http://localhost:5000
# Rotas disponíveis em: http://localhost:5000/api
```

### 1.3 Iniciar o Frontend Web

```bash
cd web
npm install

# Criar arquivo .env.local
echo 'VITE_API_URL=http://localhost:5000/api' > .env.local

npm run dev
# Frontend Web em: http://localhost:5173
```

### 1.4 Iniciar o Mobile

```bash
cd mobile
npm install

# Criar arquivo .env
echo 'EXPO_APP_API_URL=http://localhost:5000/api' > .env

npx expo start
# Escanear QR code no seu telefone com Expo Go app
```

---

## 2. Fluxo de Autenticação

### 2.1 Registro de Novo Usuário

**Endpoint**: `POST /api/users/register`

```javascript
// Mobile
const response = await userService.register({
  name: 'João Silva',
  email: 'joao@example.com',
  password: 'senha123'
});

// Resposta
{
  data: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'joao@example.com',
      name: 'João Silva'
    }
  }
}
```

**Próximos Passos**:
1. Armazenar token em AsyncStorage: `await AsyncStorage.setItem('authToken', token)`
2. App.js detecta token e navega para TabNavigator
3. Renderizar tela Home automaticamente

### 2.2 Login Existente

**Endpoint**: `POST /api/users/login`

```javascript
const response = await userService.login(
  'joao@example.com',
  'senha123'
);

// Token retornado no response
await AsyncStorage.setItem('authToken', response.data.token);
```

### 2.3 Token Management

**Interceptor de Request** (`mobile/services/api.js`):
```javascript
// Adiciona automaticamente header ao cada request
config.headers.Authorization = `Bearer ${token}`;
```

**Interceptor de Response**:
```javascript
// Se receber 401, remove token e redireciona para login
if (error.response?.status === 401) {
  await AsyncStorage.removeItem('authToken');
  // Navigation.navigate('Login');
}
```

---

## 3. Endpoints Críticos da API

### 3.1 Usuários

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|----------|
| POST | `/users/register` | ❌ | Criar nova conta |
| POST | `/users/login` | ❌ | Fazer login |
| GET | `/users/profile` | ✅ Bearer | Obter perfil |
| PUT | `/users/profile` | ✅ Bearer | Atualizar perfil |

### 3.2 Locations (Pontos de Cruising)

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|----------|
| GET | `/locations` | ✅ Bearer | Listar todos |
| GET | `/locations/nearby` | ✅ Bearer | Por proximidade |
| GET | `/locations/:id` | ✅ Bearer | Detalhes |
| POST | `/locations/:id/rate` | ✅ Bearer | Avaliar |

### 3.3 Messages (Chat)

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|----------|
| POST | `/messages` | ✅ Bearer | Enviar mensagem |
| GET | `/messages/inbox` | ✅ Bearer | Listar conversas |
| GET | `/messages/conversation/:userId` | ✅ Bearer | Conversa |

### 3.4 Check-ins

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|----------|
| POST | `/checkins` | ✅ Bearer | Fazer check-in |
| DELETE | `/checkins/:id` | ✅ Bearer | Sair (checkout) |
| GET | `/checkins/active` | ✅ Bearer | Ativos agora |

---

## 4. Testes de Integração

### 4.1 Teste Manual com Postman

**1. Registrar**
```
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "name": "Teste User",
  "email": "teste@example.com",
  "password": "password123"
}
```

**2. Login** (copie o token da resposta)
```
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "teste@example.com",
  "password": "password123"
}

# Resposta contém o token
```

**3. Obter Perfil**
```
GET http://localhost:5000/api/users/profile
Authorization: Bearer <TOKEN_AQUI>
```

**4. Listar Locations**
```
GET http://localhost:5000/api/locations
Authorization: Bearer <TOKEN_AQUI>
```

### 4.2 Testes Automatizados

```bash
# Unit tests
cd backend
npm test

# E2E tests (Cypress)
cd web
npx cypress open
```

---

## 5. Troubleshooting

### 5.1 Erro de CORS

**Problema**: "Access to XMLHttpRequest blocked by CORS policy"

**Solução**:
```javascript
// backend/src/index.js
app.use(cors({
  origin: [
    'http://localhost:5173',      // Web
    'http://localhost:3000',      // Local mobile
    'exp://localhost:8081',       // Expo tunnel
  ],
  credentials: true
}));
```

### 5.2 Erro de Conexão do Mobile

**Problema**: "Network Error"

**Solução**:
```bash
# Verificar IP local
ifconfig | grep "inet" | grep -v "127.0.0.1"

# Atualizar .env no mobile
EXPO_APP_API_URL=http://<YOUR_LOCAL_IP>:5000/api
```

### 5.3 Token Expirado

**Problema**: Request retorna 401 Unauthorized

**Solução**:
- Fazer novo login
- Backend armazena token em AsyncStorage
- Interceptor detecta 401 e redireciona para LoginScreen

---

## 6. Checklist de Deployment

- [ ] Backend no Railway.app
- [ ] Web no Vercel ou Netlify
- [ ] Mobile build no EAS
- [ ] PostgreSQL remoto configurado
- [ ] Variáveis de ambiente atualizadas
- [ ] CORS configurado para domínios de produção
- [ ] Testes passando 100%
- [ ] Documentation atualizada

---

## 7. Próximos Passos

1. ✅ Integração básica Mobile ↔ Backend
2. 🔄 Testes automatizados de integração
3. 🔄 Deployment em staging (Heroku/Railway)
4. 🔄 Otimização de performance
5. 🔄 Implementar chat em tempo real (WebSockets)
6. 🔄 Notificações push
7. 🔄 Análise de segurança

---

## 8. Contato e Suporte

- 📧 Email: dev@cruisingporto.com
- 🐛 Issues: GitHub Issues
- 📖 Wiki: Wiki do Projeto
- 💬 Discussões: GitHub Discussions

---

**Última atualização**: Fevereiro 2026  
**Responsável**: @imoappgamer-bot  
**Status**: ✅ Integração em Progresso

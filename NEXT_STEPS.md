# 🚀 Próximos Passos - Continuando o Desenvolvimento

## 1️⃣ Fase Atual: Backend (60%)

### Imediato (Esta Semana)

```bash
# 1. Clonar e setup local
git clone https://github.com/imoappgamer-bot/cruising-porto.git
cd cruising-porto/backend
npm install
cp .env.example .env

# 2. Rodar banco de dados
docker-compose up -d

# 3. Popular dados
npm run seed

# 4. Iniciar servidor
npm start
# API rodando em http://localhost:5000
```

### Controllers Faltando

#### CommentController (`src/controllers/commentController.js`)
```javascript
// Funções a implementar:
- createComment(req, res)     // Criar comentário
- getLocationComments(req, res) // Listar por local
- deleteComment(req, res)     // Deletar comentário
- reportComment(req, res)     // Denunciar comentário
```

#### AlertController (`src/controllers/alertController.js`)
```javascript
// Funções a implementar:
- createAlert(req, res)       // Criar alerta de segurança
- getAlerts(req, res)         // Listar alertas próximos
- dismissAlert(req, res)      // Desativar alerta
- getAlertStats(req, res)     // Estatísticas de segurança
```

#### UserController (`src/controllers/userController.js`)
```javascript
// Funções a implementar:
- getUserProfile(req, res)    // Obter perfil
- updateProfile(req, res)     // Atualizar perfil
- uploadAvatar(req, res)      // Upload de foto
- getSettings(req, res)       // Configurações
- updateSettings(req, res)    // Atualizar configurações
- blockUser(req, res)         // Bloquear usuário
- getBlockedUsers(req, res)   // Lista de bloqueados
```

#### MessageController (`src/controllers/messageController.js`)
```javascript
// Funções a implementar:
- sendMessage(req, res)       // Enviar mensagem
- getConversation(req, res)   // Conversa
- markAsRead(req, res)        // Marcar como lido
- deleteMessage(req, res)     // Deletar mensagem
- getConversations(req, res)  // Listar conversas
```

### Melhorias de Segurança

```javascript
// 1. Validação de entrada (use Joi)
// arquivo: src/validators/schemas.js

import Joi from 'joi';

export const userRegistrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

// 2. Rate limiting
// npm install express-rate-limit

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requests por IP
});

app.use(limiter);

// 3. Error handler globalizado
// arquivo: src/middleware/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## 2️⃣ Fase Frontend Web (20%)

### Setup Inicial

```bash
cd web
npm install

# Variáveis de ambiente
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=seu_token
EOF

npm run dev
# Acessar em http://localhost:5173
```

### Telas Prioritárias

1. **Login/Registro** (`src/pages/Auth.jsx`)
   - Formulário de registro
   - Formulário de login
   - Recuperação de senha

2. **Mapa Principal** (`src/pages/Map.jsx`)
   - Integração Leaflet
   - Localização do usuário
   - Marcadores de locais
   - Filtros por tipo

3. **Detalhes do Local** (`src/pages/LocationDetail.jsx`)
   - Botão check-in/check-out
   - Comentários
   - Avaliações
   - Alertas de segurança

4. **Perfil** (`src/pages/Profile.jsx`)
   - Foto de perfil
   - Configurações de privacidade
   - Histórico de check-ins
   - Bloqueados

### Exemplo de Componente

```jsx
// src/components/LocationCard.jsx

import React from 'react';
import { Card, Button, Rating } from '@/components';

export default function LocationCard({ location, onCheckIn }) {
  const distance = Math.round(location.distance * 10) / 10;
  
  return (
    <Card className="location-card">
      <h3>{location.name}</h3>
      <p className="distance">{distance} km away</p>
      <Rating value={location.rating} />
      <p className="safety">Safety: {location.safetyRating}/10</p>
      <p>{location.activeUsers} people here</p>
      <Button onClick={() => onCheckIn(location.id)}>
        Check In
      </Button>
    </Card>
  );
}
```

## 3️⃣ Fase Mobile (20%)

### Setup Inicial

```bash
cd mobile
npm install

# Autenticidade
cat > .env << EOF
EXPO_API_URL=https://seu-backend.railway.app/api
EOF

npx expo start
```

### Telas Prioritárias

1. **MapScreen** - Mapa com localização em tempo real
2. **LocationDetailsScreen** - Detalhes com check-in
3. **ProfileScreen** - Perfil do usuário
4. **ChatScreen** - Mensagens privadas
5. **SettingsScreen** - Configurações

### Dependências Principais

```bash
npm install \
  react-native-maps \
  react-native-geolocation-service \
  react-native-push-notification \
  @react-navigation/native \
  @react-navigation/bottom-tabs
```

## 4️⃣ Deployment (10%)

### 1. Backend no Railway

1. Push para GitHub
2. Ir para railway.app
3. Conectar repositório
4. Adicionar PostgreSQL
5. Configurar variáveis de ambiente
6. Deploy automático

### 2. Frontend no Vercel

1. Ir para vercel.com
2. Importar repositório
3. Selecionar pasta `web`
4. Adicionar variáveis de ambiente
5. Deploy

### 3. Mobile no Expo

```bash
npm install -g eas-cli
eas login
eas build --platform android  # Gera APK
eas build --platform ios      # Requer Mac
```

## 5️⃣ Testes

### Unit Tests (Jest)

```bash
# Instalar
cd backend
npm install --save-dev jest supertest

# arquivo: src/__tests__/auth.test.js
import request from 'supertest';
import app from '../index';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

### E2E Tests (Cypress)

```bash
npm install --save-dev cypress
npx cypress open
```

## 6️⃣ Ci/CD (GitHub Actions)

### Arquivo: `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install
        run: npm install
      
      - name: Run tests
        run: npm test
```

## 7️⃣ Monitoramento

### Logs

```bash
# Railway
railway logs

# Vercel
vercel logs
```

### Uptime

Use UptimeRobot (grátis):
1. Ir para uptimerobot.com
2. Monitorar `https://seu-backend.railway.app/health`

## 📄 Timeline Estimado

- **Semana 1**: Completar Backend (controllers + testes)
- **Semana 2**: Implementar Frontend Web (mapa + auth)
- **Semana 3**: Implementar Mobile (estrutura básica)
- **Semana 4**: Testes e ajustes
- **Semana 5**: Deploy em produção

## 📞 Suporte

Este projeto está documentado e mantido no GitHub:
https://github.com/imoappgamer-bot/cruising-porto

Para dúvidas:
1. Consulte a documentação
2. Verifique issues existentes
3. Crie uma nova issue
4. Faça um pull request

---

**Bom desenvolvimento! 🚀**

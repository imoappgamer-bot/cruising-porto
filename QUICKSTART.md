# 🚀 Cruising Porto - Quick Start Guide

## Instalação em 5 minutos

### 1. Clone o repositório
```bash
git clone https://github.com/imoappgamer-bot/cruising-porto.git
cd cruising-porto
```

### 2. Setup com Docker (Recomendado - 100% grátis)
```bash
# Instale Docker em: https://www.docker.com/products/docker-desktop (Grátis)
docker-compose up -d
# Espere 30 segundos para PostgreSQL e Redis iniciarem
```

### 3. Setup manual (sem Docker)

#### Pré-requisitos:
- Node.js 18+ (https://nodejs.org - Grátis)
- PostgreSQL 12+ (https://www.postgresql.org - Grátis)
- Redis (https://redis.io - Grátis)

#### Backend setup:
```bash
cd backend
npm install
cp ../.env.example .env
# Edite o .env com suas credenciais PostgreSQL
npm run dev  # Inicia em http://localhost:3001
```

#### Mobile setup:
```bash
cd mobile
npm install
npm start  # Scan QR com Expo Go (https://expo.dev - Grátis)
```

#### Web setup:
```bash
cd web
npm install
npm run dev  # Inicia em http://localhost:3000
```

## 🗺️ API Endpoints (sem autenticação para começar)

### Health Check
```bash
curl http://localhost:3001/health
```

### Locais em Porto
```bash
# Listar tudo
curl http://localhost:3001/api/locations

# Próximos a mim (41.1579, -8.6291 = Porto Centro)
curl 'http://localhost:3001/api/locations/near/41.1579/-8.6291?radius=5'
```

## 🔓 Autenticação (Usar Postman ou Thunder Client)

### Registrar usuário
```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "password123",
  "nickname": "testuser",
  "age": 25,
  "gender": "male",
  "role": "top",
  "city": "Porto"
}
```

### Login
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "password123"
}
```

Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

## 📍 Locais de Pegação em Porto (Reais)

1. **Parque da Quinta da Conceição** - 41.1607, -8.6273 (Parque)
2. **Miradouro do Monte da Virgem** - 41.1534, -8.6249 (Miradouro)
3. **Estação de Trindade** - 41.1608, -8.6344 (Estação de comboios)
4. **NorteShopping** - 41.1774, -8.6482 (Shopping)
5. **Parque Oriental** - 41.1445, -8.5978 (Parque)
6. **WC Público - Praça da República** - 41.1599, -8.6334 (WC)
7. **Praia de Matosinhos** - 41.1890, -8.6871 (Praia)
8. **Parque Municipal de Maia** - 41.2375, -8.6295 (Parque)
9. **Estação Campanhã** - 41.1408, -8.5898 (Estação)
10. **Jardim do Palácio de Cristal** - 41.1583, -8.6296 (Jardim)

## 🗺️ Mapas GRÁTIS (Sem custos!)

### OpenStreetMap + Leaflet (Recomendado para web)
- ✅ Totalmente grátis
- ✅ Sem limite de requisições
- ✅ Código aberto
- Instale: `npm install leaflet react-leaflet`

### Leaflet + OpenStreetMap (Mobile)
- ✅ Grátis para React Native
- ✅ Sem API key necessária
- Instale: `npm install react-native-maps`

## 🚀 Deploy (Grátis)

### Opção 1: Railway (10GB/mês grátis)
```bash
# Instale: https://railway.app (Sign up com GitHub)
npm install -g @railway/cli
railway login
railway init
railway up
# URL: https://seu-app.railway.app
```

### Opção 2: Heroku (deixou de ser grátis, mas Railway é alternativa)

### Opção 3: Render.com (grátis)
```bash
# Conecte seu GitHub: https://render.com
# New > Web Service
# Deploy automático a cada push
```

### Opção 4: Vercel (Web grátis)
```bash
cd web
npm install -g vercel
vercel
# URL: seu-app.vercel.app
```

## 📱 Testar Mobile

1. Baixe Expo Go:
   - iOS: https://apps.apple.com/us/app/expo-go/id1054983313
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Execute: `cd mobile && npm start`
3. Escaneie QR code com Expo Go

## 🗣️ Chat em tempo real (Grátis)

### Socket.io (já incluído)
```javascript
// Já configurado em backend
// Mensagens aparecem em tempo real
```

## 📊 Banco de Dados

### Visualizar dados PostgreSQL
```bash
# pgAdmin (Web UI - Grátis)
docker run -p 5050:80 \
  -e PGADMIN_DEFAULT_EMAIL=admin@pgadmin.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  dpage/pgadmin4

# Acesse: http://localhost:5050
# Email: admin@pgadmin.com
# Password: admin
```

## 🔑 Variáveis de Ambiente Importantes

Crie `.env` na raiz com:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://cruising_user:cruising_password@localhost:5432/cruising_porto
REDIS_URL=redis://localhost:6379
JWT_SECRET=sua_chave_secreta_muito_segura
```

## 🐛 Troubleshooting

### PostgreSQL não conecta
```bash
# Verifique se está rodando
docker ps | grep postgres

# Reinicie
docker-compose restart postgres
```

### Port já em uso
```bash
# Mude a porta no .env
PORT=3002
```

### Sem GPS no mobile
- Ative localização nas permissões do app
- Use emulador Android Studio com GPS mock

## ✅ Checklist Pronto para Produção

- [ ] Banco PostgreSQL com backups
- [ ] Redis para cache
- [ ] JWT funcionando
- [ ] Mapas (OpenStreetMap)
- [ ] Localizações de Porto carregadas
- [ ] Check-ins funcionando
- [ ] Mensagens em tempo real
- [ ] Autenticação segura
- [ ] HTTPS/SSL
- [ ] Deploy em servidor cloud

## 📞 Suporte

- GitHub Issues: https://github.com/imoappgamer-bot/cruising-porto/issues
- Discussions: https://github.com/imoappgamer-bot/cruising-porto/discussions

**Tudo 100% grátis! 🎉**

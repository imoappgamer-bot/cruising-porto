# ⚚️ Guia de Setup de Ambiente - Cruising Porto

Guia completo para configurar todas as variáveis de ambiente necessárias para executar o projeto Cruising Porto em desenvolvimento e produção.

---

## 💻 Desenvolvimento Local

### 1. Backend (Node.js/Express)

Crie o arquivo `backend/.env`:

```bash
# Servidor
PORT=5000
NODE_ENV=development

# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cruising_porto_dev
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Secret (gerar com: openssl rand -base64 32)
JWT_SECRET=seu-secret-jwt-super-secreto-aqui-min-32-chars
JWT_EXPIRES_IN=7d

# CORS (URLs permitidas)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,exp://localhost:8081

# URLs Base
FRONTEND_URL=http://localhost:5173
MOBILE_URL=exp://localhost:8081

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (opcional para dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
FROM_EMAIL=noreply@cruisingporto.com

# Redis (opcional para cache)
REDIS_URL=redis://localhost:6379
```

**Gerar JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### 2. Web Frontend (React/Vite)

Crie o arquivo `web/.env.local`:

```bash
# API Backend
VITE_API_URL=http://localhost:5000/api

# Mapbox Token (opcional, Leaflet também funciona sem)
VITE_MAPBOX_TOKEN=seu-token-mapbox-aqui

# Google Maps API Key (opcional)
VITE_GOOGLE_MAPS_API_KEY=sua-key-aqui

# App Config
VITE_APP_NAME=Cruising Porto
VITE_APP_VERSION=1.0.0

# Features Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
```

---

### 3. Mobile (React Native/Expo)

Crie o arquivo `mobile/.env`:

```bash
# API Backend (use seu IP local para testar no celular)
EXPO_APP_API_URL=http://192.168.1.100:5000/api

# Google Maps API Key (Android)
GOOGLE_MAPS_API_KEY_ANDROID=sua-key-android

# Google Maps API Key (iOS)
GOOGLE_MAPS_API_KEY_IOS=sua-key-ios

# Expo Config
EXPO_PROJECT_ID=seu-expo-project-id

# Features
ENABLE_PUSH_NOTIFICATIONS=false
ENABLE_ANALYTICS=false
```

**Descobrir seu IP local:**
```bash
# Linux/Mac
ifconfig | grep "inet" | grep -v "127.0.0.1"

# Windows
ipconfig
```

---

## 🚀 Produção

### 1. Backend no Railway

Configure as variáveis no painel do Railway:

```bash
PORT=5000
NODE_ENV=production

# Database (provido automaticamente pelo Railway)
DB_HOST=${{RAILWAY_POSTGRES_HOST}}
DB_PORT=${{RAILWAY_POSTGRES_PORT}}
DB_NAME=${{RAILWAY_POSTGRES_DATABASE}}
DB_USER=${{RAILWAY_POSTGRES_USER}}
DB_PASSWORD=${{RAILWAY_POSTGRES_PASSWORD}}

# JWT (gerar novo com crypto)
JWT_SECRET=novo-secret-super-forte-production-64-chars
JWT_EXPIRES_IN=7d

# CORS (URLs de produção)
CORS_ORIGIN=https://seu-app.vercel.app,https://www.cruisingporto.com

# URLs Base
FRONTEND_URL=https://seu-app.vercel.app

# Rate Limiting (mais restritivo em prod)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# Email (configurar SendGrid ou Mailgun)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=seu-sendgrid-api-key
FROM_EMAIL=noreply@cruisingporto.com

# Redis (Railway Add-on ou Upstash)
REDIS_URL=${{RAILWAY_REDIS_URL}}

# Monitoring
SENTRY_DSN=seu-sentry-dsn-aqui
```

---

### 2. Web no Vercel

Configure as variáveis no painel do Vercel:

```bash
# API Backend
VITE_API_URL=https://seu-backend.railway.app/api

# Mapbox
VITE_MAPBOX_TOKEN=seu-token-mapbox

# Google Analytics (opcional)
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=true

# Sentry
VITE_SENTRY_DSN=seu-sentry-dsn-web
```

---

### 3. Mobile no EAS (Expo)

Configure no arquivo `mobile/eas.json` e secrets do Expo:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_APP_API_URL": "https://seu-backend.railway.app/api",
        "ENABLE_PUSH_NOTIFICATIONS": "true",
        "ENABLE_ANALYTICS": "true"
      }
    }
  }
}
```

**Adicionar secrets via CLI:**
```bash
eas secret:create --scope project --name GOOGLE_MAPS_API_KEY_ANDROID --value "sua-key"
eas secret:create --scope project --name GOOGLE_MAPS_API_KEY_IOS --value "sua-key"
```

---

## 🔐 Segurança e Boas Práticas

### 1. Gerar Secrets Fortes

```bash
# JWT Secret (mínimo 32 caracteres)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# API Keys
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Passwords de Banco (64 caracteres)
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### 2. Nunca Commitar Secrets

Verifique se `.env` está no `.gitignore`:
```bash
# .gitignore
.env
.env.local
.env.*.local
*.env
```

### 3. Rotar Secrets Periodicamente

- JWT_SECRET: A cada 3-6 meses
- API Keys: Anualmente
- Database Passwords: A cada 6 meses

### 4. Usar Gerenciadores de Secrets

**Desenvolvimento:**
- direnv
- dotenv-cli
- docker secrets

**Produção:**
- Railway Secrets
- Vercel Environment Variables
- AWS Secrets Manager
- HashiCorp Vault

---

## 🧪 Testes

### Arquivo `.env.test` (Backend)

```bash
PORT=5001
NODE_ENV=test

# Database de testes (separado)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cruising_porto_test
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Secret (pode ser simples para testes)
JWT_SECRET=test-secret-jwt-not-for-production
JWT_EXPIRES_IN=1h

CORS_ORIGIN=*

# Desabilitar rate limiting em testes
RATE_LIMIT_WINDOW_MS=0
RATE_LIMIT_MAX_REQUESTS=1000
```

**Executar testes:**
```bash
NODE_ENV=test npm test
```

---

## ✔️ Checklist de Setup

### Desenvolvimento
- [ ] Backend `.env` criado com todas as variáveis
- [ ] Web `.env.local` criado
- [ ] Mobile `.env` criado com IP local
- [ ] PostgreSQL rodando (Docker ou local)
- [ ] Redis rodando (opcional)
- [ ] Testado `npm run dev` em cada projeto

### Produção
- [ ] Railway configurado com PostgreSQL
- [ ] Variáveis de ambiente do backend no Railway
- [ ] Vercel configurado com variáveis
- [ ] EAS configurado com secrets
- [ ] JWT_SECRET forte gerado
- [ ] CORS configurado corretamente
- [ ] Rate limiting ajustado
- [ ] Monitoring configurado (Sentry)
- [ ] Backup de Database configurado

---

## 🎓 Tutoriais Rápidos

### Criar Database PostgreSQL local

```bash
# Com Docker
docker run --name cruising-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cruising_porto_dev \
  -p 5432:5432 \
  -d postgres:14

# Verificar
psql -h localhost -U postgres -d cruising_porto_dev
```

### Testar Conexão com Backend

```bash
# Health check
curl http://localhost:5000/health

# Registrar usuário
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"senha123"}'
```

### Configurar Ngrok para testar Mobile com backend local

```bash
# Expor backend local para internet
ngrok http 5000

# Usar URL do ngrok no mobile/.env
EXPO_APP_API_URL=https://abc123.ngrok.io/api
```

---

## 📞 Suporte

Problemas com environment setup?

1. Verificar se todas as variáveis estão definidas
2. Confirmar que não há espaços em branco
3. Testar conexão com database
4. Verificar logs de erro
5. Consultar INTEGRATION_GUIDE.md

---

**Última atualização**: 24 de Fevereiro de 2026  
**Responsável**: @imoappgamer-bot  
**Versão**: 1.0.0

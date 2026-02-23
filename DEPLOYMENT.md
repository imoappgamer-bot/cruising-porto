# Guia de Deployment - Cruising Porto

## 🚀 Colocar o App Online - 100% GRÁTIS

Este guia fornece instruções passo a passo para fazer deploy da aplicação Cruising Porto usando apenas serviços gratuitos.

## 📚 Arquitetura do Projeto

```
cruising-porto/
├── backend/          (Node.js + Express + PostgreSQL)
├── web/              (React + Vite)
├── mobile/           (React Native)
└── docs/
```

## 1️⃣ Pré-requisitos

- Conta GitHub (grátis)
- Conta Railway.app (grátis com cartão de crédito para validação, $5/més em créditos)
- Conta Vercel (grátis)
- Conta Supabase (grátis)
- Conta Mapbox (grátis - 50k requisisoes/mês)

## 🖤️ Back-end (API Node.js)

### Opção 1: Railway.app (Recomendado)

#### Passo 1: Preparar o repositório

1. Certifique-se que o `backend/` tem um arquivo `package.json` válido
2. Crie um arquivo `Procfile` na raiz do backend:
   ```
   web: npm start
   ```

#### Passo 2: Deploy no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub"
4. Autorize o Railway a acessar seu GitHub
5. Selecione o repositório `cruising-porto`
6. Escolha o branch `main`
7. Railway detectará automaticamente que é um projeto Node.js

#### Passo 3: Configuração de Variáveis de Ambiente

No painel do Railway, vá para `Variables` e adicione:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=sua_chave_super_secreta_aqui
DB_HOST=seu_host_postgres
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=cruising_porto
DB_PORT=5432
CORS_ORIGIN=https://seu-dominio-web.vercel.app
```

#### Passo 4: Database PostgreSQL

Railway oferece PostgreSQL grátis:
1. No mesmo projeto Railway, clique em "Add a Service"
2. Selecione "PostgreSQL"
3. Railway gerará automaticamente as variáveis de ambiente `DATABASE_URL`

## 🍰 Front-end Web (React)

### Deployment no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe do GitHub o repositório `cruising-porto`
4. Selecione a pasta raiz do projeto web
5. Configure as variáveis de ambiente:
   ```
   VITE_API_URL=https://seu-backend-railway.railway.app
   VITE_MAPBOX_TOKEN=seu_token_mapbox
   ```
6. Clique em "Deploy"

Vercel fazerá deploy automático a cada push no GitHub.

## 📱 Mobile (React Native)

### Opção 1: Expo (Nuvem)

```bash
# Instalar Expo CLI
npm install -g expo-cli

# Fazer login
expo login

# Publicar
cd mobile
expo publish
```

### Opção 2: Compilar localmente

```bash
# Android
eas build --platform android

# iOS (requer Mac)
eas build --platform ios
```

## 🖺️ Banco de Dados

### PostgreSQL no Railway

Já configurado acima. A URL será:
```
postgres://user:password@host:5432/database
```

### Alternativa: Supabase (PostgreSQL gerenciado)

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a `DATABASE_URL`
4. Configure no Railway ou render.com

## 🗺️ Mapas (OpenStreetMap + Leaflet)

### Configuração

Já incluso no projeto. Usa OpenStreetMap que é 100% grátis.

Para geocódigo e direções, use:
- [Nominatim](https://nominatim.org) - Geocoding grátis
- [OSRM](https://router.project-osrm.org) - Roteamento grátis

## 🗐️ Scripts Üteis

### Executar localmente

```bash
# Backend
cd backend
npm install
npm run seed  # Popular banco com dados
npm start

# Web (novo terminal)
cd web
npm install
npm run dev

# Mobile (novo terminal)
cd mobile
npm install
npm start
```

### Criar variáveis de ambiente

```bash
cp backend/.env.example backend/.env
# Editar backend/.env com suas configurações

cp web/.env.example web/.env
cp mobile/.env.example mobile/.env
```

## 🔐 Segurança

### HTTPS
- Railway: Automático
- Vercel: Automático
- OpenStreetMap/Nominatim: Automático

### Secrets
- Nunca commit `.env` para o GitHub
- Use variáveis de ambiente em produção
- Rotine a chave JWT regularmente

## 📅 Monitoramento

### Logs
- Railway: Dashboard > Logs
- Vercel: Dashboard > Deployments > Logs

### Health Check
API responde em `GET /health`

## 🚀 Próximos Passos

1. Fazer deploy do Backend no Railway
2. Fazer deploy do Front-end no Vercel
3. Testar a integração
4. Publicar app mobile no Expo/App Store/Play Store
5. Configurar custom domain (opcional)

## 📖 Recursos Adicionais

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [PostgreSQL Free Tier](https://www.postgresql.org/)
- [OpenStreetMap Tiles](https://tile.openstreetmap.org/)

## 🎉 Custo Total

- Railway Backend: $0-5/mês (com créditos gratuitos)
- Vercel Frontend: $0/mês (1 projeto grátis)
- PostgreSQL: Incluso no Railway
- Mapas: $0/mês (OpenStreetMap)
- **TOTAL: $0-5/mês**

---

🙏 Dicas Importantes:
1. Mantenha os créditos gratuitos do Railway ativos
2. Configure o CI/CD no GitHub Actions
3. Fazer backup do banco de dados regularmente
4. Monitore o uso de API do Mapbox

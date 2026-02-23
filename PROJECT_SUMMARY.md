# Cruising Porto - Project Summary

## Visão Geral
Cruising Porto é uma aplicação mobile-first desenvolvida para conectar pessoas interessadas em "cruising" em Porto, Portugal. A plataforma oferece funcionalidades de descoberta de locais, autenticação de usuários, sistema de mensagens em tempo real e avaliações de spots.

## Arquitetura do Projeto

### Backend (Node.js + Express)
Server RESTful API com:
- **Controllers**: `userController.js` e `messageController.js` - Lógica de negócio
- **Routes**: Rotas da API organizadas em `user.routes.js` e `message.routes.js`
- **Middleware**: Validação, tratamento de erros e autenticação
- **Validators**: Schemas de validação Joi para entrada de dados
- **Database**: PostgreSQL (configurado via .env)
- **Autenticação**: JWT com tokens seguros

### Frontend Web (React + Vite)
Aplicação web responsiva com:
- **Frameworks**: React com Vite para build otimizado
- **HTTP Client**: Axios com interceptadores para autenticação
- **Componentes**: Estrutura modular de componentes React
- **Estilos**: CSS com Leaflet para integração de mapas
- **Serviços**: API abstraction layer em `services/api.js`

### Mobile (React Native)
Aplicativo nativo multiplataforma com:
- **Framework**: React Native com Expo
- **Navegação**: React Navigation (Stack e Bottom Tab)
- **Armazenamento**: AsyncStorage para persistência local
- **HTTP Client**: Axios com interceptadores automáticos de autenticação
- **Serviços**: Mesma abstração de API do web

## Estrutura de Pastas

```
cruising-porto/
├── backend/
│   ├── controllers/
│   │   ├── userController.js
│   │   └── messageController.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── message.routes.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── validators/
│   │   └── schemas.js
│   ├── server.js
│   ├── package.json
│   └── BACKEND_SUMMARY.md
├── web/
│   ├── src/
│   ├── services/
│   │   └── api.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── WEBGUIDE.md
├── mobile/
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── package.json
│   └── app.json
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
├── .env.example
├── docker-compose.yml
├── README.md
└── PROJECT_STATUS.md
```

## Features Implementadas

### Autenticação
- ✅ Registro de usuários
- ✅ Login com JWT
- ✅ Validação de tokens
- ✅ Proteção de rotas

### Usuários
- ✅ Perfil de usuário
- ✅ Busca de usuários
- ✅ Edição de perfil

### Mensagens
- ✅ Envio de mensagens
- ✅ Conversas entre usuários
- ✅ Inbox de mensagens
- ✅ Exclusão de mensagens

### Spots de Cruising
- ✅ Listagem de spots
- ✅ Detalhes de spots
- ✅ Avaliações de spots
- ✅ Reports de segurança

### Favoritos
- ✅ Adicionar favoritos
- ✅ Remover favoritos
- ✅ Listar favoritos

## Tecnologias Utilizadas

### Backend
- Node.js + Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- Joi (validação)
- Nodemailer (email)
- Cors

### Frontend Web
- React 18+
- Vite
- Axios
- Leaflet (mapas)
- CSS3

### Mobile
- React Native
- React Navigation
- Expo
- AsyncStorage
- Axios

### DevOps
- Docker & Docker Compose
- Git & GitHub
- Vercel (Web)
- Netlify (Web)
- EAS (Mobile)

## Variáveis de Ambiente

Ver arquivo `.env.example` para todas as variáveis necessárias:
- Backend: PORT, ENV, DATABASE_URL, JWT_SECRET
- Email: SMTP configuração
- AWS S3: (opcional) para uploads de imagens
- OAuth: (opcional) Google e GitHub

## Como Contribuir

1. Clone o repositório
2. Configure `.env` baseado em `.env.example`
3. Instale dependências: `npm install`
4. Execute em desenvolvimento: `npm run dev`
5. Siga os padrões de código documentados em NEXT_STEPS.md

## Roadmap Futuro

- [ ] Suporte a uploads de imagens/vídeos
- [ ] Sistema de ratings mais robusto
- [ ] Notificações em tempo real (Socket.io)
- [ ] Integração com Google Maps API
- [ ] Sistema de reputação de usuários
- [ ] Premium features
- [ ] i18n (Internacionalização)
- [ ] Testes automatizados (Jest, React Testing Library)

## Status do Projeto

**Fase**: MVP (Minimum Viable Product) Completo
**Data Última Atualização**: 23 de Fevereiro de 2026

Ver `PROJECT_STATUS.md` para detalhes completos de progresso.

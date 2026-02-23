# Cruising Porto - Web Frontend Guide

## 💻 Status Atual

O frontend web do Cruising Porto está configurado com **Vite + Vue.js** e pronto para desenvolvimento.

### ✅ Estrutura Criada

```
web/
├── src/
│   ├── components/      → Componentes Vue reutilizáveis
│   ├── pages/           → Páginas/Views da aplicação
│   ├── services/        → API service layer ✨ NOVO
│   │   └── api.js       → Centraliza chamadas ao backend
│   ├── App.jsx          → Componente raiz
│   ├── main.jsx         → Entry point
│   └── index.css        → Estilos globais
├── vite.config.js       → Config Vite
├── package.json         → Dependências
└── index.html           → HTML base
```

## 🔧 API Service (Criado)

O arquivo `src/services/api.js` centraliza todas as chamadas ao backend:

### Módulos Disponíveis

```javascript
import { 
  authAPI,          // Autenticação
  usersAPI,         // Gerenciam. usuários
  locationsAPI,     // Locais
  messagesAPI,      // Mensagens
  checkinsAPI,      // Check-ins
  commentsAPI,      // Comentários
  alertsAPI         // Alertas
} from '@/services/api';
```

### Funcionalidades

- ✅ Gerenciamento automático de tokens JWT
- ✅ Tratamento global de erros
- ✅ Logout automático em 401 Unauthorized
- ✅ Headers configurados automaticamente
- ✅ Base URL configurada via env vars

### Exemplo de Uso

```javascript
// Login
try {
  const response = await authAPI.login(email, password);
  setAuthToken(response.token);
  // Redirecionar para dashboard
} catch (error) {
  console.error(error.message);
}

// Obter locais próximos
const locations = await locationsAPI.getNearbyLocations(
  latitude, 
  longitude, 
  5 // raio em km
);

// Enviar mensagem
await messagesAPI.sendMessage(receiverId, content);
```

## 📄 Páginas Recomendadas

### 1. Autenticação
```
src/pages/
├── Login.vue         → Página de login
├── Register.vue      → Registro de novo usuário
└── ForgotPassword.vue → Recuperar senha
```

### 2. Mapa e Localizações
```
src/pages/
├── Map.vue               → Mapa principal com marcadores
├── LocationDetail.vue    → Detalhes de um local
└── CreateLocation.vue    → Criar novo local
```

### 3. Perfil e Configurações
```
src/pages/
├── Profile.vue       → Perfil do usuário
├── Settings.vue      → Configurações
└── EditProfile.vue   → Editar perfil
```

### 4. Mensagens
```
src/pages/
├── Messages.vue      → Lista de conversas
└── Chat.vue          → Conversa individual
```

## 🧑‍💻 Componentes Recomendados

### Navegação
```
src/components/
├── Navbar.vue           → Barra de navegação superior
├── Sidebar.vue          → Menu lateral
└── BottomNav.vue        → Navegação inferior (mobile)
```

### Locais
```
src/components/
├── LocationCard.vue     → Card de local
├── LocationList.vue     → Lista de locais
├── MapView.vue          → Mapa interativo
└── CheckInButton.vue    → Botão de check-in
```

### Mensagens
```
src/components/
├── MessageBubble.vue    → Bolha de mensagem
├── MessageInput.vue     → Input para enviar msg
└── ConversationList.vue → Lista de conversas
```

### UI Comum
```
src/components/
├── Button.vue          → Botão customizado
├── Input.vue           → Input customizado
├── Modal.vue           → Modal genérico
├── Loading.vue         → Indicador de loading
└── Alert.vue           → Alertas e notificações
```

## 🚀 Setup do Projeto

### Instalar Dependências
```bash
cd web
npm install
```

### Configurar Variáveis de Ambiente
```bash
# Criar .env.local
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=seu_token_mapbox
```

### Rodar em Desenvolvimento
```bash
npm run dev
# Abrir http://localhost:5173
```

### Build para Produção
```bash
npm run build
npm run preview  # Preview da build
```

## 📚 Bibliotecas Recomendadas

### Mapas
```bash
npm install leaflet vue-leaflet
# ou
npm install @react-google-maps/api
```

### Rotas
```bash
npm install vue-router@4
```

### State Management
```bash
npm install pinia
# ou
npm install zustand (se React)
```

### UI Components
```bash
npm install @headlessui/vue
npm install @heroicons/vue
# ou
npm install primevue
```

### Formulários
```bash
npm install vee-validate yup
```

### Data/Hora
```bash
npm install date-fns
```

## 🎨 Estilo e Design

### Cores Sugeridas
```css
:root {
  --primary: #6366f1;      /* Indigo */
  --secondary: #8b5cf6;    /* Purple */
  --success: #10b981;      /* Green */
  --danger: #ef4444;       /* Red */
  --warning: #f59e0b;      /* Amber */
  --dark: #1f2937;         /* Gray-800 */
  --light: #f9fafb;        /* Gray-50 */
}
```

### Tailwind CSS (Opcional)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 🔐 Autenticação e Rotas Protegidas

### Exemplo de Router Guard
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/pages/Login.vue'),
    },
    {
      path: '/map',
      component: () => import('@/pages/Map.vue'),
      meta: { requiresAuth: true }
    },
  ]
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');
  
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
```

## 📊 Próximos Passos

### Fase 1 - Autenticação
1. ⏳ Criar páginas Login/Register
2. ⏳ Implementar router
3. ⏳ State management (Pinia/Zustand)
4. ⏳ Proteger rotas privadas

### Fase 2 - Mapa
1. ⏳ Integrar Leaflet/Google Maps
2. ⏳ Mostrar locais no mapa
3. ⏳ Implementar filtros
4. ⏳ Detalhes do local

### Fase 3 - Funcionalidades
1. ⏳ Check-ins
2. ⏳ Comentários e ratings
3. ⏳ Alertas de segurança
4. ⏳ Sistema de mensagens

### Fase 4 - UI/UX
1. ⏳ Responsividade mobile
2. ⏳ Loading states
3. ⏳ Error handling visual
4. ⏳ Animações e transições

### Fase 5 - Deploy
1. ⏳ Build otimizada
2. ⏳ Deploy Vercel/Netlify
3. ⏳ CI/CD
4. ⏳ Analytics e monitoring

## 📈 Status Geral

| Item | Status | Progress |
|------|--------|----------|
| API Service | ✅ Completo | 100% |
| Estrutura Base | ✅ Pronto | 100% |
| Autenticação | ⏳ Pendente | 0% |
| Mapa | ⏳ Pendente | 0% |
| Mensagens | ⏳ Pendente | 0% |
| UI Components | ⏳ Pendente | 20% |
| **WEB TOTAL** | **🚧 EM PROGRESSO** | **~25%** |

## 📝 Documentação

- Backend API: Ver `BACKEND_SUMMARY.md`
- Endpoints: `backend/BACKEND_SUMMARY.md`
- Deploy: Ver `DEPLOYMENT.md`

---

**Data**: 23 de Fevereiro de 2026  
**Status**: API Service criado, pronto para desenvolvimento das páginas  
**Repositório**: https://github.com/imoappgamer-bot/cruising-porto

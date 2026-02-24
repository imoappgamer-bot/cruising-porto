// Serviço de API para aplicativo mobile React Native
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Criar instância do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar token de autenticação
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de resposta para tratar erros
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, limpar e redirecionar para login
      await AsyncStorage.removeItem('authToken');
      // Emitir evento de logout (implementar com EventEmitter ou Redux)
    }
    return Promise.reject(error);
  }
);

// Usuários
export const userService = {
  register: (data) => apiClient.post('/users/register', data),
  login: (email, password) => apiClient.post('/users/login', { email, password }),
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  searchUsers: (query) => apiClient.get('/users/search', { params: { q: query } }),
};

// Mensagens
export const messageService = {
  send: (data) => apiClient.post('/messages', data),
  getConversation: (userId) => apiClient.get(`/messages/conversation/${userId}`),
  getInbox: () => apiClient.get('/messages/inbox'),
  deleteMessage: (messageId) => apiClient.delete(`/messages/${messageId}`),
};

// Cruising Spots
export const spotService = {
  list: (filters) => apiClient.get('/spots', { params: filters }),
  getDetail: (spotId) => apiClient.get(`/spots/${spotId}`),
  rate: (spotId, rating) => apiClient.post(`/spots/${spotId}/rate`, { rating }),
  report: (spotId, reason) => apiClient.post(`/spots/${spotId}/report`, { reason }),
};

// Favoritos
export const favoriteService = {
  add: (spotId) => apiClient.post('/favorites', { spotId }),
  remove: (spotId) => apiClient.delete(`/favorites/${spotId}`),
  list: () => apiClient.get('/favorites'),
};

                                  // Funções auxiliares de Usuário
export const getUserProfile = () => userService.getProfile();
export const updateUserProfile = (data) => userService.updateProfile(data);



export default apiClient;

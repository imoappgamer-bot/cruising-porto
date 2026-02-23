// API Service - Centraliza todas as chamadas ao backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token de autenticação
let authToken = localStorage.getItem('authToken');

// Função para atualizar token
export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Função para fazer requisição com tratamento de erros
const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token inválido - fazer logout
    setAuthToken(null);
    window.location.href = '/login';
  }

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.error || 'Erro na requisição',
      details: data.details,
    };
  }

  return data;
};

// Autenticação
export const authAPI = {
  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getCurrentUser: () =>
    apiRequest('/auth/me'),
};

// Usuários
export const usersAPI = {
  getProfile: (userId) =>
    apiRequest(`/users/${userId}/profile`),
  updateProfile: (userData) =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  uploadAvatar: (avatarUrl) =>
    apiRequest('/users/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatar_url: avatarUrl }),
    }),
  getSettings: () =>
    apiRequest('/users/settings'),
  updateSettings: (settings) =>
    apiRequest('/users/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  blockUser: (userId) =>
    apiRequest('/users/block', {
      method: 'POST',
      body: JSON.stringify({ blocked_user_id: userId }),
    }),
  getBlockedUsers: () =>
    apiRequest('/users/blocked'),
  changePassword: (currentPassword, newPassword) =>
    apiRequest('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }),
};

// Locais
export const locationsAPI = {
  getLocations: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/locations?${params}`);
  },
  getLocationById: (id) =>
    apiRequest(`/locations/${id}`),
  createLocation: (locationData) =>
    apiRequest('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    }),
  updateLocation: (id, locationData) =>
    apiRequest(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    }),
  deleteLocation: (id) =>
    apiRequest(`/locations/${id}`, {
      method: 'DELETE',
    }),
  getNearbyLocations: (latitude, longitude, radius = 5) =>
    apiRequest(`/locations/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`),
};

// Mensagens
export const messagesAPI = {
  sendMessage: (receiverId, content) =>
    apiRequest('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: receiverId, content }),
    }),
  getConversation: (userId, options = {}) => {
    const params = new URLSearchParams(options);
    return apiRequest(`/messages/conversation/${userId}?${params}`);
  },
  getConversations: () =>
    apiRequest('/messages/conversations'),
  markAsRead: (messageId) =>
    apiRequest(`/messages/${messageId}/read`, {
      method: 'PUT',
    }),
  deleteMessage: (messageId) =>
    apiRequest(`/messages/${messageId}`, {
      method: 'DELETE',
    }),
  getUnreadCount: () =>
    apiRequest('/messages/unread-count'),
};

// Check-ins
export const checkinsAPI = {
  checkIn: (locationId, isAnonymous = false) =>
    apiRequest('/checkins', {
      method: 'POST',
      body: JSON.stringify({ location_id: locationId, is_anonymous: isAnonymous }),
    }),
  checkOut: (checkInId) =>
    apiRequest(`/checkins/${checkInId}/checkout`, {
      method: 'POST',
    }),
  getActiveCheckIns: (locationId) =>
    apiRequest(`/checkins/location/${locationId}/active`),
  getMyCheckIns: () =>
    apiRequest('/checkins/me'),
};

// Comentários
export const commentsAPI = {
  createComment: (locationId, content, rating) =>
    apiRequest('/comments', {
      method: 'POST',
      body: JSON.stringify({ location_id: locationId, content, rating }),
    }),
  getLocationComments: (locationId) =>
    apiRequest(`/comments/location/${locationId}`),
  deleteComment: (commentId) =>
    apiRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    }),
};

// Alertas
export const alertsAPI = {
  createAlert: (locationId, alertType, description, severity) =>
    apiRequest('/alerts', {
      method: 'POST',
      body: JSON.stringify({ location_id: locationId, alert_type: alertType, description, severity }),
    }),
  getNearbyAlerts: (latitude, longitude, radius = 5) =>
    apiRequest(`/alerts/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`),
  dismissAlert: (alertId) =>
    apiRequest(`/alerts/${alertId}/dismiss`, {
      method: 'POST',
    }),
};

export default {
  authAPI,
  usersAPI,
  locationsAPI,
  messagesAPI,
  checkinsAPI,
  commentsAPI,
  alertsAPI,
};

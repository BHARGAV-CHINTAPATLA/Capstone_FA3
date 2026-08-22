import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to automatically attach JWT token on requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to catch 401 Unauthorized responses and force client logout
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // If user is currently in a protected workspace route, redirect to login
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/* Per-module Endpoint Implementations */

// Auth
export const loginUser = (email, password) => apiClient.post('/auth/login', { email, password });
export const signupUser = (email, password) => apiClient.post('/auth/signup', { email, password });

// Mood Tracking
export const saveMood = (moodData) => apiClient.post('/mood-tracking', moodData);
export const getMoodHistory = () => apiClient.get('/mood-history');

// Mindfulness Exercises
export const getMindfulnessExercises = () => apiClient.get('/mindfulness-exercises');

// Reminders CRUD
export const getReminders = () => apiClient.get('/reminders');
export const createReminder = (reminder) => apiClient.post('/reminders', reminder);
export const updateReminder = (id, reminder) => apiClient.put(`/reminders/${id}`, reminder);
export const deleteReminder = (id) => apiClient.delete(`/reminders/${id}`);

// Peer Support
export const getPeers = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.mood) params.append('mood', filters.mood);
  
  if (filters.affectingMood) {
    if (Array.isArray(filters.affectingMood)) {
      filters.affectingMood.forEach(tag => params.append('affectingMood', tag));
    } else {
      params.append('affectingMood', filters.affectingMood);
    }
  }

  return apiClient.get(`/peer-support/users?${params.toString()}`);
};

// Chats
export const startChat = (anonymousUsername) => apiClient.post('/chats', { anonymousUsername });
export const getChats = () => apiClient.get('/chats');
export const getChatMessages = (chatId) => apiClient.get(`/chats/${chatId}/messages`);
export const postChatMessage = (chatId, message) => apiClient.post(`/chats/${chatId}/messages`, { message });

// Notifications Push Subscriptions
export const subscribePushNotifications = (subscription) => apiClient.post('/notifications/subscribe', subscription);
export const unsubscribePushNotifications = (subscription) => apiClient.delete('/notifications/subscribe', { data: subscription });

export default apiClient;

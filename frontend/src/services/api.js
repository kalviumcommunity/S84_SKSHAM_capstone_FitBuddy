import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitbuddy-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fitbuddy-token');
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup' && path !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  google: (data) => api.post('/auth/google', data),
  me: () => api.get('/auth/me'),
};

// Profile
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  uploadAvatar: (avatar) => api.put('/profile/avatar', { avatar }),
};

// Plan
export const planAPI = {
  generate: () => api.post('/plan/generate'),
  getCurrent: () => api.get('/plan/current'),
};

// Tracker
export const trackerAPI = {
  getByDate: (date) => api.get(`/tracker/${date}`),
  toggleExercise: (data) => api.post('/tracker/exercise', data),
  toggleMeal: (data) => api.post('/tracker/meal', data),
  updateWater: (data) => api.post('/tracker/water', data),
};

// Feedback
export const feedbackAPI = {
  reportBug: (data) => api.post('/feedback/bug', data),
  suggestFeature: (data) => api.post('/feedback/feature', data),
};

// Chat
export const chatAPI = {
  getHistory: () => api.get('/chat'),
  sendMessage: (message) => api.post('/chat', { message }),
  clearHistory: () => api.delete('/chat'),
};

export default api;

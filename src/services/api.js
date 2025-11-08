import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Tạo axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AUTH API
export const authAPI = {
  // Register
  register: (data) => api.post('/auth/register', data),
  
  // Login
  login: (data) => api.post('/auth/login', data),
  
  // Get current user
  me: () => api.get('/auth/me')
};

// TODO API
export const todoAPI = {
  // Get all todos
  getAll: () => api.get('/todos'),
  
  // Create todo
  create: (data) => api.post('/todos', data),
  
  // Update todo
  update: (id, data) => api.put(`/todos/${id}`, data),
  
  // Delete todo
  delete: (id) => api.delete(`/todos/${id}`)
};

export default api;
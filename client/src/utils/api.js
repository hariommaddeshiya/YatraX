import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

const api = axios.create({
  baseURL: apiBase,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor with graceful error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('[API Error]:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || { success: false, message: error.message });
  }
);

export default api;

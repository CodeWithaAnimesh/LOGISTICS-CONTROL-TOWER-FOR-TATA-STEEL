import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lct_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle auth failures and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token expired or invalid — redirect to login
        localStorage.removeItem('lct_auth_token');
        // window.location.href = '/login';
        console.warn('[API] Unauthorized — token cleared');
      }

      if (status === 403) {
        console.warn('[API] Forbidden — insufficient permissions');
      }

      if (status >= 500) {
        console.error('[API] Server error:', error.response.data);
      }
    } else if (error.request) {
      console.error('[API] Network error — no response received:', error.message);
    } else {
      console.error('[API] Request configuration error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

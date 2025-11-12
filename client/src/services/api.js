// client/src/services/api.js
import axios from 'axios';
import { supabase } from './supabase'; // Import your new supabase client

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add Supabase token to requests
api.interceptors.request.use(
  async (config) => {
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // A 401 from our *own* server is a critical error.
      // Supabase's client handles its own 401s for token refreshing.
      console.error('Unauthorized request to custom API');
      // You could redirect to login here, but Supabase auth state
      // might still be valid.
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
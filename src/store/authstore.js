import { create } from 'zustand';
import axios from 'axios';

// Configure standard axios instance
export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  getMe: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.payload, loading: false });
    } catch (err) {
      set({ user: null, loading: false, error: err.response?.data?.message || 'Not authenticated' });
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', credentials);
      set({ user: data.payload, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },

  register: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', credentials);
      set({ user: data.payload, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, error: null });
    } catch (err) {
      console.error('Logout failed', err);
    }
  }
}));

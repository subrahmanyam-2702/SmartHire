import { create } from 'zustand';

const storedUser = localStorage.getItem('smarthire_user');

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem('smarthire_token') || null,

  setAuth: (user, token) => {
    localStorage.setItem('smarthire_user', JSON.stringify(user));
    localStorage.setItem('smarthire_token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('smarthire_user');
    localStorage.removeItem('smarthire_token');
    set({ user: null, token: null });
  },
}));

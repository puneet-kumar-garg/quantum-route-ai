import api from '@/lib/api';
import type { AuthTokens, User } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AuthTokens> {
    const form = new FormData();
    form.append('username', email);
    form.append('password', password);
    const { data } = await api.post<AuthTokens>('/auth/login', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async register(payload: { email: string; username: string; full_name: string; password: string }): Promise<User> {
    const { data } = await api.post<User>('/auth/register', payload);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};

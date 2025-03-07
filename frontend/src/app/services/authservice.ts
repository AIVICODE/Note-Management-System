import api from './api';
import { AuthResponse } from '../types/auth';

export const login = async (username: string, password: string) => {
    console.log('URL de login:', process.env.API_URL + '/auth/login');  
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  };


export const register = async (username: string, password: string) => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

// 🟢 Logout
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const isAuthenticated = async (): Promise<boolean> => {
    try {
      const response = await api.get<AuthResponse>('/auth/session');  
      return response.data.authenticated;  
    } catch {
      return false;  
    }
  };
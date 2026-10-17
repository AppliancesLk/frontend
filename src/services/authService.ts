import apiClient from '../api/apiClient';
import type { AuthUser, LoginInput, RegisterInput } from '../types/auth.types';
export const getProfile = async () =>
  (await apiClient.get<AuthUser>('/auth/profile')).data;
export const login = async (input: LoginInput) =>
  (await apiClient.post<{ user: AuthUser }>('/auth/login', input)).data.user;
export const register = async (input: RegisterInput) =>
  (await apiClient.post<{ user: AuthUser }>('/auth/register', input)).data.user;
export const logout = async () => {
  await apiClient.post('/auth/logout');
};

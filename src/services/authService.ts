import apiClient from '../api/apiClient';
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
  RegistrationResult,
} from '../types/auth.types';
export const getProfile = async () =>
  (await apiClient.get<AuthUser>('/auth/profile')).data;
export const login = async (input: LoginInput) =>
  (await apiClient.post<{ user: AuthUser }>('/auth/login', input)).data.user;
export const register = async (input: RegisterInput) =>
  (await apiClient.post<RegistrationResult>('/auth/register', input)).data;
export const verifyEmail = async (token: string) =>
  (await apiClient.post<{ message: string }>('/auth/verify-email', { token }))
    .data;
export const resendVerification = async (email: string) =>
  (
    await apiClient.post<{ message: string }>('/auth/resend-verification', {
      email,
    })
  ).data;
export const forgotPassword = async (email: string) =>
  (
    await apiClient.post<{ message: string }>('/auth/forgot-password', {
      email,
    })
  ).data;
export const resetPassword = async (token: string, password: string) =>
  (
    await apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      password,
    })
  ).data;
export const logout = async () => {
  await apiClient.post('/auth/logout');
};

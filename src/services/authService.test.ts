/**
 * @file authService.test.ts
 * @description Tests for authentication service API calls
 *
 * Test Case IDs:
 * - TC-FE-AUTH-SVC-001: login calls correct endpoint with credentials
 * - TC-FE-AUTH-SVC-002: login returns user on success
 * - TC-FE-AUTH-SVC-003: login propagates API errors
 * - TC-FE-AUTH-SVC-004: register calls correct endpoint with user data
 * - TC-FE-AUTH-SVC-005: register returns registration result
 * - TC-FE-AUTH-SVC-006: getProfile calls correct endpoint
 * - TC-FE-AUTH-SVC-007: logout calls correct endpoint
 * - TC-FE-AUTH-SVC-008: verifyEmail sends token to correct endpoint
 * - TC-FE-AUTH-SVC-009: forgotPassword sends email to correct endpoint
 * - TC-FE-AUTH-SVC-010: resetPassword sends token and password
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from './authService';
import apiClient from '../api/apiClient';
import type { AuthUser, RegistrationResult } from '../types/auth.types';

vi.mock('../api/apiClient');

const mockedApiClient = vi.mocked(apiClient);

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    const mockUser: AuthUser = {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'CUSTOMER',
    };

    // TC-FE-AUTH-SVC-001
    it('should call POST /auth/login with credentials', async () => {
      mockedApiClient.post.mockResolvedValue({ data: { user: mockUser } });

      await authService.login({ username: 'testuser', password: 'password123' });

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/login', {
        username: 'testuser',
        password: 'password123',
      });
    });

    // TC-FE-AUTH-SVC-002
    it('should return user on successful login', async () => {
      mockedApiClient.post.mockResolvedValue({ data: { user: mockUser } });

      const result = await authService.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toEqual(mockUser);
    });

    // TC-FE-AUTH-SVC-003
    it('should propagate API errors', async () => {
      const error = new Error('Invalid credentials');
      mockedApiClient.post.mockRejectedValue(error);

      await expect(
        authService.login({ username: 'testuser', password: 'wrong' }),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    const mockResult: RegistrationResult = {
      requiresVerification: true,
      email: 'test@example.com',
      message: 'Please verify your email',
    };

    // TC-FE-AUTH-SVC-004
    it('should call POST /auth/register with user data', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockResult });

      await authService.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/register', {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });
    });

    // TC-FE-AUTH-SVC-005
    it('should return registration result', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockResult });

      const result = await authService.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResult);
    });
  });

  describe('getProfile', () => {
    const mockUser: AuthUser = {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'CUSTOMER',
    };

    // TC-FE-AUTH-SVC-006
    it('should call GET /auth/profile and return user', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockUser });

      const result = await authService.getProfile();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/auth/profile');
      expect(result).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    // TC-FE-AUTH-SVC-007
    it('should call POST /auth/logout', async () => {
      mockedApiClient.post.mockResolvedValue({});

      await authService.logout();

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('verifyEmail', () => {
    // TC-FE-AUTH-SVC-008
    it('should call POST /auth/verify-email with token', async () => {
      mockedApiClient.post.mockResolvedValue({
        data: { message: 'Email verified' },
      });

      const result = await authService.verifyEmail('verify-token-123');

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/verify-email', {
        token: 'verify-token-123',
      });
      expect(result).toEqual({ message: 'Email verified' });
    });
  });

  describe('forgotPassword', () => {
    // TC-FE-AUTH-SVC-009
    it('should call POST /auth/forgot-password with email', async () => {
      mockedApiClient.post.mockResolvedValue({
        data: { message: 'Reset email sent' },
      });

      const result = await authService.forgotPassword('user@example.com');

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'user@example.com',
      });
      expect(result).toEqual({ message: 'Reset email sent' });
    });
  });

  describe('resetPassword', () => {
    // TC-FE-AUTH-SVC-010
    it('should call POST /auth/reset-password with token and password', async () => {
      mockedApiClient.post.mockResolvedValue({
        data: { message: 'Password reset successful' },
      });

      const result = await authService.resetPassword('reset-token', 'newpassword');

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'reset-token',
        password: 'newpassword',
      });
      expect(result).toEqual({ message: 'Password reset successful' });
    });
  });

  describe('resendVerification', () => {
    it('should call POST /auth/resend-verification with email', async () => {
      mockedApiClient.post.mockResolvedValue({
        data: { message: 'Verification email sent' },
      });

      const result = await authService.resendVerification('user@example.com');

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/auth/resend-verification',
        { email: 'user@example.com' },
      );
      expect(result).toEqual({ message: 'Verification email sent' });
    });
  });
});

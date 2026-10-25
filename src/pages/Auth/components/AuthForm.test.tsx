/**
 * @file AuthForm.test.tsx
 * @description Tests for the AuthForm component (Login/Register)
 *
 * Test Case IDs:
 * - TC-FE-AUTH-011: Login form should render required fields
 * - TC-FE-AUTH-012: Login form should validate required fields
 * - TC-FE-AUTH-013: Login form should call signIn on valid submission
 * - TC-FE-AUTH-014: Login form should display API errors
 * - TC-FE-AUTH-015: Login form should show loading state during submission
 * - TC-FE-AUTH-016: Register form should render all required fields
 * - TC-FE-AUTH-017: Register form should validate password confirmation
 * - TC-FE-AUTH-018: Register form should call signUp on valid submission
 * - TC-FE-AUTH-019: Should toggle password visibility
 * - TC-FE-AUTH-020: Should redirect authenticated users
 */

import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import AuthForm from './AuthForm';
import {
  renderWithProviders,
  createAuthenticatedContext,
  defaultAuthContext,
} from '../../../test/test-utils';
import { createMockCustomer } from '../../../test/factories';
import type { AuthContextValue } from '../../../context/auth-context';

describe('AuthForm', () => {
  describe('Login Mode', () => {
    // TC-FE-AUTH-011
    it('should render login form with username and password fields', () => {
      // Arrange & Act
      renderWithProviders(<AuthForm mode="login" />, {
        route: '/login',
      });

      // Assert
      expect(
        screen.getByRole('heading', { name: /sign in to your account/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /sign in/i }),
      ).toBeInTheDocument();
    });

    // TC-FE-AUTH-012
    it('should mark username and password as required', () => {
      // Arrange & Act
      renderWithProviders(<AuthForm mode="login" />, {
        route: '/login',
      });

      // Assert
      const usernameInput = screen.getByLabelText(/username or email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);

      expect(usernameInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    // TC-FE-AUTH-013
    it('should call signIn with credentials on valid form submission', async () => {
      // Arrange
      const mockSignIn = vi.fn().mockResolvedValue(createMockCustomer());
      const authContext: AuthContextValue = {
        ...defaultAuthContext,
        signIn: mockSignIn,
      };

      const { user } = renderWithProviders(<AuthForm mode="login" />, {
        authContext,
        routes: [
          { path: '/login', element: <AuthForm mode="login" /> },
          { path: '/', element: <div>Home</div> },
        ],
        route: '/login',
      });

      // Act
      await user.type(screen.getByLabelText(/username or email/i), 'testuser');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Assert
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123',
        });
      });
    });

    // TC-FE-AUTH-014
    it('should display API error messages on login failure', async () => {
      // Arrange
      const mockSignIn = vi.fn().mockRejectedValue({
        isAxiosError: true,
        response: { data: { message: 'Invalid credentials' } },
      });
      const authContext: AuthContextValue = {
        ...defaultAuthContext,
        signIn: mockSignIn,
      };

      const { user } = renderWithProviders(<AuthForm mode="login" />, {
        authContext,
        route: '/login',
      });

      // Act
      await user.type(screen.getByLabelText(/username or email/i), 'testuser');
      await user.type(screen.getByLabelText(/^password$/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    // TC-FE-AUTH-015
    it('should show loading state during form submission', async () => {
      // Arrange
      let resolveSignIn: (value: unknown) => void;
      const signInPromise = new Promise((resolve) => {
        resolveSignIn = resolve;
      });
      const mockSignIn = vi.fn().mockReturnValue(signInPromise);
      const authContext: AuthContextValue = {
        ...defaultAuthContext,
        signIn: mockSignIn,
      };

      const { user } = renderWithProviders(<AuthForm mode="login" />, {
        authContext,
        route: '/login',
      });

      // Act
      await user.type(screen.getByLabelText(/username or email/i), 'testuser');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Assert - Check loading state
      await waitFor(() => {
        expect(screen.getByText(/signing in/i)).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /signing in/i });
      expect(submitButton).toBeDisabled();

      // Cleanup
      resolveSignIn!(createMockCustomer());
    });

    // TC-FE-AUTH-019
    it('should toggle password visibility', async () => {
      // Arrange
      const { user } = renderWithProviders(<AuthForm mode="login" />, {
        route: '/login',
      });

      const passwordInput = screen.getByLabelText(/^password$/i);
      const toggleButton = screen.getByRole('button', { name: /show/i });

      // Assert initial state
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Act - Show password
      await user.click(toggleButton);

      // Assert - Password visible
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: /hide/i })).toBeInTheDocument();

      // Act - Hide password
      await user.click(screen.getByRole('button', { name: /hide/i }));

      // Assert - Password hidden again
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    // TC-FE-AUTH-020
    it('should redirect authenticated users away from login page', () => {
      // Arrange
      const customer = createMockCustomer();
      const authContext = createAuthenticatedContext(customer);

      // Act
      renderWithProviders(<AuthForm mode="login" />, {
        authContext,
        routes: [
          { path: '/login', element: <AuthForm mode="login" /> },
          { path: '/', element: <div>Home Page</div> },
        ],
        route: '/login',
      });

      // Assert
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: /sign in/i }),
      ).not.toBeInTheDocument();
    });

    it('should show link to forgot password', () => {
      // Arrange & Act
      renderWithProviders(<AuthForm mode="login" />, {
        route: '/login',
      });

      // Assert
      expect(screen.getByRole('link', { name: /forgot/i })).toBeInTheDocument();
    });

    it('should show link to registration page', () => {
      // Arrange & Act
      renderWithProviders(<AuthForm mode="login" />, {
        route: '/login',
      });

      // Assert
      expect(
        screen.getByRole('link', { name: /create an account/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Register Mode', () => {
    // TC-FE-AUTH-016
    it('should render registration form with all required fields', () => {
      // Arrange & Act
      renderWithProviders(<AuthForm mode="register" />, {
        route: '/register',
      });

      // Assert
      expect(
        screen.getByRole('heading', { name: /create your account/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/^username$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /create account/i }),
      ).toBeInTheDocument();
    });

    // TC-FE-AUTH-017
    it('should show error when passwords do not match', async () => {
      // Arrange
      const { user } = renderWithProviders(<AuthForm mode="register" />, {
        route: '/register',
      });

      // Act
      await user.type(screen.getByLabelText(/^username$/i), 'newuser');
      await user.type(
        screen.getByLabelText(/email address/i),
        'new@example.com',
      );
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(
        screen.getByLabelText(/confirm password/i),
        'different123',
      );
      await user.click(screen.getByRole('button', { name: /create account/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(
          screen.getByText(/passwords do not match/i),
        ).toBeInTheDocument();
      });
    });

    // TC-FE-AUTH-018
    it('should call signUp with user data on valid registration', async () => {
      // Arrange
      const mockSignUp = vi.fn().mockResolvedValue({
        requiresVerification: true,
        email: 'new@example.com',
        message: 'Please verify your email',
      });
      const authContext: AuthContextValue = {
        ...defaultAuthContext,
        signUp: mockSignUp,
      };

      const { user } = renderWithProviders(<AuthForm mode="register" />, {
        authContext,
        routes: [
          { path: '/register', element: <AuthForm mode="register" /> },
          { path: '/verify-email', element: <div>Verify Email</div> },
        ],
        route: '/register',
      });

      // Act
      await user.type(screen.getByLabelText(/^username$/i), 'newuser');
      await user.type(
        screen.getByLabelText(/email address/i),
        'new@example.com',
      );
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(
        screen.getByLabelText(/confirm password/i),
        'password123',
      );
      await user.click(screen.getByRole('button', { name: /create account/i }));

      // Assert
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
        });
      });
    });

    it('should display username format hint', () => {
      // Arrange & Act
      renderWithProviders(<AuthForm mode="register" />, {
        route: '/register',
      });

      // Assert
      expect(
        screen.getByText(/3-32 letters, numbers or underscores/i),
      ).toBeInTheDocument();
    });

    it('should display password requirements hint', () => {
      // Arrange & Act
      renderWithProviders(<AuthForm mode="register" />, {
        route: '/register',
      });

      // Assert
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });

    it('should show link to login page', () => {
      // Arrange & Act
      renderWithProviders(<AuthForm mode="register" />, {
        route: '/register',
      });

      // Assert
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should show loading state during registration', async () => {
      // Arrange
      let resolveSignUp: (value: unknown) => void;
      const signUpPromise = new Promise((resolve) => {
        resolveSignUp = resolve;
      });
      const mockSignUp = vi.fn().mockReturnValue(signUpPromise);
      const authContext: AuthContextValue = {
        ...defaultAuthContext,
        signUp: mockSignUp,
      };

      const { user } = renderWithProviders(<AuthForm mode="register" />, {
        authContext,
        route: '/register',
      });

      // Act
      await user.type(screen.getByLabelText(/^username$/i), 'newuser');
      await user.type(
        screen.getByLabelText(/email address/i),
        'new@example.com',
      );
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(
        screen.getByLabelText(/confirm password/i),
        'password123',
      );
      await user.click(screen.getByRole('button', { name: /create account/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/creating your account/i)).toBeInTheDocument();
      });

      // Cleanup
      resolveSignUp!({
        requiresVerification: true,
        email: 'new@example.com',
        message: 'Check email',
      });
    });

    it('should display API errors on registration failure', async () => {
      // Arrange
      const mockSignUp = vi.fn().mockRejectedValue({
        isAxiosError: true,
        response: { data: { message: 'Username already exists' } },
      });
      const authContext: AuthContextValue = {
        ...defaultAuthContext,
        signUp: mockSignUp,
      };

      const { user } = renderWithProviders(<AuthForm mode="register" />, {
        authContext,
        route: '/register',
      });

      // Act
      await user.type(screen.getByLabelText(/^username$/i), 'existinguser');
      await user.type(
        screen.getByLabelText(/email address/i),
        'existing@example.com',
      );
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(
        screen.getByLabelText(/confirm password/i),
        'password123',
      );
      await user.click(screen.getByRole('button', { name: /create account/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Username already exists')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state while checking session', () => {
      // Arrange & Act
      renderWithProviders(<AuthForm mode="login" />, {
        authContext: { ...defaultAuthContext, loading: true },
        route: '/login',
      });

      // Assert
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/checking your session/i)).toBeInTheDocument();
    });
  });
});

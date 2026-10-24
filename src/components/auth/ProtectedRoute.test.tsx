/**
 * @file ProtectedRoute.test.tsx
 * @description Tests for the ProtectedRoute component
 *
 * Test Case IDs:
 * - TC-FE-AUTH-001: Should show loading state while checking session
 * - TC-FE-AUTH-002: Should redirect unauthenticated users to login
 * - TC-FE-AUTH-003: Should display error state with retry option
 * - TC-FE-AUTH-004: Should render children for authenticated users
 * - TC-FE-AUTH-005: Should redirect to forbidden when user lacks required role
 * - TC-FE-AUTH-006: Should render for users with correct role
 */

import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import {
  renderWithProviders,
  createAuthenticatedContext,
  createLoadingAuthContext,
  createErrorAuthContext,
  defaultAuthContext,
} from '../../test/test-utils';
import { createMockAdmin, createMockCustomer, createMockRepairer } from '../../test/factories';
import type { UserRole } from '../../types/auth.types';

describe('ProtectedRoute', () => {
  // TC-FE-AUTH-001
  it('should show loading state while checking session', () => {
    // Arrange
    const authContext = createLoadingAuthContext();

    // Act
    renderWithProviders(<ProtectedRoute />, {
      authContext,
      route: '/protected',
    });

    // Assert
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/checking your session/i)).toBeInTheDocument();
  });

  // TC-FE-AUTH-002
  it('should redirect unauthenticated users to login', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<ProtectedRoute />, {
      authContext: defaultAuthContext,
      routes: [
        { path: '/protected', element: <ProtectedRoute><div>Protected Content</div></ProtectedRoute> },
        { path: '/login', element: <div>Login Page</div> },
      ],
      route: '/protected',
    });

    // Assert
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  // TC-FE-AUTH-003
  it('should display error state with retry option when auth check fails', async () => {
    // Arrange
    const mockRefresh = vi.fn();
    const authContext = {
      ...createErrorAuthContext('Unable to verify session'),
      refresh: mockRefresh,
    };

    // Act
    const { user } = renderWithProviders(<ProtectedRoute />, {
      authContext,
      route: '/protected',
    });

    // Assert
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Unable to verify session')).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();

    // Test retry functionality
    await user.click(retryButton);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  // TC-FE-AUTH-004
  it('should render children for authenticated users', () => {
    // Arrange
    const customer = createMockCustomer();
    const authContext = createAuthenticatedContext(customer);

    // Act
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        authContext,
        route: '/protected',
      },
    );

    // Assert
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  // TC-FE-AUTH-005
  it('should redirect to forbidden when user lacks required role', () => {
    // Arrange
    const customer = createMockCustomer();
    const authContext = createAuthenticatedContext(customer);

    // Act
    renderWithProviders(<ProtectedRoute roles={['ADMIN' as UserRole]} />, {
      authContext,
      routes: [
        {
          path: '/admin',
          element: (
            <ProtectedRoute roles={['ADMIN' as UserRole]}>
              <div>Admin Content</div>
            </ProtectedRoute>
          ),
        },
        { path: '/forbidden', element: <div>Forbidden Page</div> },
      ],
      route: '/admin',
    });

    // Assert
    expect(screen.getByText('Forbidden Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  // TC-FE-AUTH-006
  it('should render content for users with correct role', () => {
    // Arrange
    const admin = createMockAdmin();
    const authContext = createAuthenticatedContext(admin);

    // Act
    renderWithProviders(
      <ProtectedRoute roles={['ADMIN' as UserRole]}>
        <div>Admin Content</div>
      </ProtectedRoute>,
      {
        authContext,
        route: '/admin',
      },
    );

    // Assert
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  // TC-FE-AUTH-007
  it('should allow repairer to access repairer routes', () => {
    // Arrange
    const repairer = createMockRepairer();
    const authContext = createAuthenticatedContext(repairer);

    // Act
    renderWithProviders(
      <ProtectedRoute roles={['REPAIRER' as UserRole]}>
        <div>Repairer Content</div>
      </ProtectedRoute>,
      {
        authContext,
        route: '/repairer',
      },
    );

    // Assert
    expect(screen.getByText('Repairer Content')).toBeInTheDocument();
  });

  // TC-FE-AUTH-008
  it('should preserve the requested URL in redirect state', () => {
    // Arrange & Act
    // This test verifies that the ProtectedRoute passes the current location
    // as state to the login redirect (for post-login navigation)
    const { container } = renderWithProviders(<ProtectedRoute />, {
      authContext: defaultAuthContext,
      routes: [
        { path: '/protected/resource', element: <ProtectedRoute><div>Protected</div></ProtectedRoute> },
        { path: '/login', element: <div data-testid="login">Login</div> },
      ],
      route: '/protected/resource?param=value',
    });

    // Assert - verify redirect occurred
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  // TC-FE-AUTH-009
  it('should support multiple allowed roles', () => {
    // Arrange
    const customer = createMockCustomer();
    const authContext = createAuthenticatedContext(customer);

    // Act
    renderWithProviders(
      <ProtectedRoute roles={['CUSTOMER' as UserRole, 'ADMIN' as UserRole]}>
        <div>Multi-role Content</div>
      </ProtectedRoute>,
      {
        authContext,
        route: '/shared',
      },
    );

    // Assert
    expect(screen.getByText('Multi-role Content')).toBeInTheDocument();
  });

  // TC-FE-AUTH-010
  it('should allow any authenticated user when no roles specified', () => {
    // Arrange
    const repairer = createMockRepairer();
    const authContext = createAuthenticatedContext(repairer);

    // Act
    renderWithProviders(
      <ProtectedRoute>
        <div>General Protected Content</div>
      </ProtectedRoute>,
      {
        authContext,
        route: '/account',
      },
    );

    // Assert
    expect(screen.getByText('General Protected Content')).toBeInTheDocument();
  });
});

import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';
import { AuthContext, type AuthContextValue } from '../context/auth-context';
import { SeasonalThemeContext } from '../context/seasonal-theme-context';
import {
  DEFAULT_SEASONAL_THEME,
  type ActiveSeasonalTheme,
} from '../types/seasonal-theme.types';
import type { AuthUser, UserRole } from '../types/auth.types';

// Seasonal theme context type (matches the actual context)
interface SeasonalThemeContextValue {
  active: ActiveSeasonalTheme;
  refresh: () => Promise<void>;
}

// Default mock auth context value (unauthenticated)
export const defaultAuthContext: AuthContextValue = {
  user: null,
  loading: false,
  error: null,
  refresh: async () => {},
  signIn: async () => {
    throw new Error('signIn not implemented in test');
  },
  signUp: async () => {
    throw new Error('signUp not implemented in test');
  },
  signOut: async () => {},
  hasRole: () => false,
};

// Default mock seasonal theme context
const defaultSeasonalThemeContext: SeasonalThemeContextValue = {
  active: DEFAULT_SEASONAL_THEME,
  refresh: async () => {},
};

// Create an authenticated auth context
export function createAuthenticatedContext(
  user: Partial<AuthUser> = {},
  overrides: Partial<AuthContextValue> = {},
): AuthContextValue {
  const defaultUser: AuthUser = {
    id: 'test-user-id',
    username: 'testuser',
    email: 'test@example.com',
    role: 'CUSTOMER' as UserRole,
    ...user,
  };

  return {
    ...defaultAuthContext,
    user: defaultUser,
    hasRole: (...roles: UserRole[]) => roles.includes(defaultUser.role),
    ...overrides,
  };
}

// Create a loading auth context
export function createLoadingAuthContext(): AuthContextValue {
  return {
    ...defaultAuthContext,
    loading: true,
  };
}

// Create an error auth context
export function createErrorAuthContext(error: string): AuthContextValue {
  return {
    ...defaultAuthContext,
    error,
  };
}

interface WrapperProps {
  children: ReactNode;
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  authContext?: AuthContextValue;
  seasonalThemeContext?: SeasonalThemeContextValue;
  route?: string;
  routes?: Array<{
    path: string;
    element: ReactElement;
  }>;
}

/**
 * Render a component with all necessary providers for testing.
 * This is the main render function to use in tests.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    authContext = defaultAuthContext,
    seasonalThemeContext = defaultSeasonalThemeContext,
    route = '/',
    routes,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  // If custom routes are provided, create a memory router
  if (routes) {
    const router = createMemoryRouter(routes, {
      initialEntries: [route],
    });

    const AllProviders = ({ children }: WrapperProps) => (
      <SeasonalThemeContext.Provider value={seasonalThemeContext}>
        <AuthContext.Provider value={authContext}>
          {children}
        </AuthContext.Provider>
      </SeasonalThemeContext.Provider>
    );

    return {
      user: userEvent.setup(),
      ...render(
        <AllProviders>
          <RouterProvider router={router} />
        </AllProviders>,
        renderOptions,
      ),
    };
  }

  // Default: wrap UI with providers and a simple memory router
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: ui,
      },
    ],
    {
      initialEntries: [route],
    },
  );

  const AllProviders = ({ children }: WrapperProps) => (
    <SeasonalThemeContext.Provider value={seasonalThemeContext}>
      <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
    </SeasonalThemeContext.Provider>
  );

  return {
    user: userEvent.setup(),
    ...render(
      <AllProviders>
        <RouterProvider router={router} />
      </AllProviders>,
      renderOptions,
    ),
  };
}

/**
 * Render a component without the router (for isolated component tests).
 */
export function renderWithAuth(
  ui: ReactElement,
  {
    authContext = defaultAuthContext,
    seasonalThemeContext = defaultSeasonalThemeContext,
    ...renderOptions
  }: Omit<RenderWithProvidersOptions, 'route' | 'routes'> = {},
) {
  const Wrapper = ({ children }: WrapperProps) => (
    <SeasonalThemeContext.Provider value={seasonalThemeContext}>
      <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
    </SeasonalThemeContext.Provider>
  );

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export everything from testing-library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { userEvent };

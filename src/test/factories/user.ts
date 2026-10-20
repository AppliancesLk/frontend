import type { AuthUser, UserRole } from '../../types/auth.types';

let userCounter = 0;

/**
 * Create a mock user for testing.
 */
export function createMockUser(overrides: Partial<AuthUser> = {}): AuthUser {
  userCounter++;
  return {
    id: `user-${userCounter}`,
    username: `testuser${userCounter}`,
    email: `testuser${userCounter}@example.com`,
    role: 'CUSTOMER' as UserRole,
    ...overrides,
  };
}

/**
 * Create a mock admin user.
 */
export function createMockAdmin(overrides: Partial<AuthUser> = {}): AuthUser {
  return createMockUser({ role: 'ADMIN', ...overrides });
}

/**
 * Create a mock customer user.
 */
export function createMockCustomer(overrides: Partial<AuthUser> = {}): AuthUser {
  return createMockUser({ role: 'CUSTOMER', ...overrides });
}

/**
 * Create a mock repairer user.
 */
export function createMockRepairer(overrides: Partial<AuthUser> = {}): AuthUser {
  return createMockUser({ role: 'REPAIRER', ...overrides });
}

/**
 * Reset the user counter (for test isolation).
 */
export function resetUserFactory(): void {
  userCounter = 0;
}

/**
 * @file apiErrors.test.ts
 * @description Tests for API error handling utilities
 *
 * Test Case IDs:
 * - TC-FE-UTIL-030: Should return session expired message for 401 errors
 * - TC-FE-UTIL-031: Should return access denied message for 403 errors
 * - TC-FE-UTIL-032: Should return API error message for client errors
 * - TC-FE-UTIL-033: Should join array error messages
 * - TC-FE-UTIL-034: Should return fallback for server errors
 * - TC-FE-UTIL-035: Should return fallback for non-Axios errors
 */

import { describe, it, expect, vi } from 'vitest';
import { getApiError } from './apiErrors';
import { translations } from './translations';

// Mock axios.isAxiosError - must be on default export to match how it's imported
vi.mock('axios', () => {
  const isAxiosError = (error: unknown): error is { response?: { status?: number; data?: { message?: string | string[] } } } => {
    return !!error && typeof error === 'object' && 'isAxiosError' in error && (error as { isAxiosError: boolean }).isAxiosError === true;
  };
  return {
    default: { isAxiosError },
    isAxiosError,
  };
});

describe('apiErrors', () => {
  describe('getApiError', () => {
    // TC-FE-UTIL-030
    it('should return session expired message for 401 errors', () => {
      // Arrange
      const error = {
        isAxiosError: true,
        response: { status: 401, data: { message: 'Unauthorized' } },
      };

      // Act
      const result = getApiError(error);

      // Assert
      expect(result).toBe(translations.auth.sessionExpired);
    });

    // TC-FE-UTIL-031
    it('should return access denied message for 403 errors', () => {
      // Arrange
      const error = {
        isAxiosError: true,
        response: { status: 403, data: { message: 'Forbidden' } },
      };

      // Act
      const result = getApiError(error);

      // Assert
      expect(result).toBe(translations.auth.accessDenied);
    });

    // TC-FE-UTIL-032
    it('should return API error message for client errors (4xx)', () => {
      // Arrange
      const errorMessage = 'Invalid input provided';
      const error = {
        isAxiosError: true,
        response: { status: 400, data: { message: errorMessage } },
      };

      // Act
      const result = getApiError(error);

      // Assert
      expect(result).toBe(errorMessage);
    });

    // TC-FE-UTIL-033
    it('should join array error messages', () => {
      // Arrange
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: ['Error 1', 'Error 2', 'Error 3'] },
        },
      };

      // Act
      const result = getApiError(error);

      // Assert
      expect(result).toBe('Error 1. Error 2. Error 3');
    });

    // TC-FE-UTIL-034
    it('should return fallback for server errors (5xx)', () => {
      // Arrange
      const fallback = 'Something went wrong';
      const error = {
        isAxiosError: true,
        response: { status: 500, data: { message: 'Internal Server Error' } },
      };

      // Act
      const result = getApiError(error, fallback);

      // Assert
      expect(result).toBe(fallback);
    });

    // TC-FE-UTIL-035
    it('should return fallback for non-Axios errors', () => {
      // Arrange
      const fallback = 'Custom fallback message';
      const error = new Error('Regular JavaScript error');

      // Act
      const result = getApiError(error, fallback);

      // Assert
      expect(result).toBe(fallback);
    });

    it('should use default fallback when not provided', () => {
      // Arrange
      const error = new Error('Some error');

      // Act
      const result = getApiError(error);

      // Assert
      expect(result).toBe(translations.admin.saveError);
    });

    it('should return fallback for network errors without response', () => {
      // Arrange
      const error = {
        isAxiosError: true,
        // No response property (network error)
      };

      // Act
      const result = getApiError(error, 'Network error fallback');

      // Assert
      expect(result).toBe('Network error fallback');
    });

    it('should handle null error', () => {
      // Arrange & Act
      const result = getApiError(null, 'Fallback');

      // Assert
      expect(result).toBe('Fallback');
    });

    it('should handle undefined error', () => {
      // Arrange & Act
      const result = getApiError(undefined, 'Fallback');

      // Assert
      expect(result).toBe('Fallback');
    });

    it('should return API message for 404 errors', () => {
      // Arrange
      const errorMessage = 'Resource not found';
      const error = {
        isAxiosError: true,
        response: { status: 404, data: { message: errorMessage } },
      };

      // Act
      const result = getApiError(error);

      // Assert
      expect(result).toBe(errorMessage);
    });

    it('should return API message for 422 validation errors', () => {
      // Arrange
      const errorMessage = 'Validation failed';
      const error = {
        isAxiosError: true,
        response: { status: 422, data: { message: errorMessage } },
      };

      // Act
      const result = getApiError(error);

      // Assert
      expect(result).toBe(errorMessage);
    });
  });
});

/**
 * @file validation.test.ts
 * @description Tests for general validation utilities
 *
 * Test Case IDs:
 * - TC-FE-UTIL-020: isUuid should return true for valid UUIDs
 * - TC-FE-UTIL-021: isUuid should return false for invalid UUIDs
 * - TC-FE-UTIL-022: isUuid should return false for undefined
 * - TC-FE-UTIL-023: isUuid should return false for empty string
 */

import { describe, it, expect } from 'vitest';
import { isUuid } from './validation';

describe('validation', () => {
  describe('isUuid', () => {
    // TC-FE-UTIL-020
    it('should return true for valid UUIDs', () => {
      // Arrange
      const validUuids = [
        '123e4567-e89b-12d3-a456-426614174000',
        '550e8400-e29b-41d4-a716-446655440000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        'A47AC10B-58CC-4372-A567-0E02B2C3D479', // Uppercase
        'a47ac10b-58cc-4372-a567-0e02b2c3d479', // Lowercase
      ];

      // Act & Assert
      for (const uuid of validUuids) {
        expect(isUuid(uuid)).toBe(true);
      }
    });

    // TC-FE-UTIL-021
    it('should return false for invalid UUIDs', () => {
      // Arrange
      const invalidUuids = [
        'not-a-uuid',
        '123e4567-e89b-12d3-a456', // Too short
        '123e4567-e89b-12d3-a456-426614174000-extra', // Too long
        '123e4567-e89b-12d3-a456-42661417400g', // Invalid character 'g'
        '123e4567e89b12d3a456426614174000', // Missing hyphens
        '123e4567-e89b-12d3-a456-42661417400', // One character short
        'xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Wrong characters
        '123e4567-e89b-12d3-a456_426614174000', // Underscore instead of hyphen
      ];

      // Act & Assert
      for (const uuid of invalidUuids) {
        expect(isUuid(uuid)).toBe(false);
      }
    });

    // TC-FE-UTIL-022
    it('should return false for undefined', () => {
      // Arrange & Act & Assert
      expect(isUuid(undefined)).toBe(false);
    });

    // TC-FE-UTIL-023
    it('should return false for empty string', () => {
      // Arrange & Act & Assert
      expect(isUuid('')).toBe(false);
    });

    it('should be case-insensitive', () => {
      // Arrange
      const lowercaseUuid = '123e4567-e89b-12d3-a456-426614174000';
      const uppercaseUuid = '123E4567-E89B-12D3-A456-426614174000';
      const mixedCaseUuid = '123e4567-E89B-12d3-A456-426614174000';

      // Act & Assert
      expect(isUuid(lowercaseUuid)).toBe(true);
      expect(isUuid(uppercaseUuid)).toBe(true);
      expect(isUuid(mixedCaseUuid)).toBe(true);
    });

    it('should work as a type guard', () => {
      // This test verifies the type narrowing behavior
      const maybeUuid: string | undefined = '123e4567-e89b-12d3-a456-426614174000';

      if (isUuid(maybeUuid)) {
        // TypeScript should narrow the type to string here
        const uuid: string = maybeUuid;
        expect(uuid.length).toBe(36);
      }
    });
  });
});

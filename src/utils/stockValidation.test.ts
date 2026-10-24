/**
 * @file stockValidation.test.ts
 * @description Tests for stock quantity validation utilities
 *
 * Test Case IDs:
 * - TC-FE-UTIL-010: Should return valid for zero stock
 * - TC-FE-UTIL-011: Should return valid for positive whole numbers
 * - TC-FE-UTIL-012: Should return invalid for empty input
 * - TC-FE-UTIL-013: Should return invalid for negative numbers
 * - TC-FE-UTIL-014: Should return invalid for decimal numbers
 * - TC-FE-UTIL-015: Should return invalid for numbers exceeding MAX_STOCK_QUANTITY
 * - TC-FE-UTIL-016: Should return invalid for non-numeric input
 */

import { describe, it, expect } from 'vitest';
import { validateStockQuantity, MAX_STOCK_QUANTITY } from './stockValidation';

describe('stockValidation', () => {
  describe('validateStockQuantity', () => {
    // TC-FE-UTIL-010
    it('should return valid for zero stock', () => {
      // Arrange & Act
      const result = validateStockQuantity('0');

      // Assert
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.value).toBe(0);
      }
    });

    // TC-FE-UTIL-011
    it('should return valid for positive whole numbers', () => {
      // Arrange
      const validInputs = ['1', '10', '100', '1000', '999999'];

      // Act & Assert
      for (const input of validInputs) {
        const result = validateStockQuantity(input);
        expect(result.valid).toBe(true);
        if (result.valid) {
          expect(result.value).toBe(Number(input));
        }
      }
    });

    // TC-FE-UTIL-012
    it('should return invalid for empty input', () => {
      // Arrange & Act
      const result = validateStockQuantity('');

      // Assert
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.message).toContain('Enter a stock quantity');
      }
    });

    it('should return invalid for whitespace-only input', () => {
      // Arrange & Act
      const result = validateStockQuantity('   ');

      // Assert
      expect(result.valid).toBe(false);
    });

    // TC-FE-UTIL-013
    it('should return invalid for negative numbers', () => {
      // Arrange
      const negativeInputs = ['-1', '-100', '-999'];

      // Act & Assert
      for (const input of negativeInputs) {
        const result = validateStockQuantity(input);
        expect(result.valid).toBe(false);
        if (!result.valid) {
          expect(result.message).toContain('cannot be negative');
        }
      }
    });

    // TC-FE-UTIL-014
    it('should return invalid for decimal numbers', () => {
      // Arrange
      const decimalInputs = ['1.5', '10.99', '0.5', '100.1'];

      // Act & Assert
      for (const input of decimalInputs) {
        const result = validateStockQuantity(input);
        expect(result.valid).toBe(false);
        if (!result.valid) {
          expect(result.message).toContain('whole number');
        }
      }
    });

    // TC-FE-UTIL-015
    it('should return invalid for numbers exceeding MAX_STOCK_QUANTITY', () => {
      // Arrange
      const tooLarge = String(MAX_STOCK_QUANTITY + 1);

      // Act
      const result = validateStockQuantity(tooLarge);

      // Assert
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.message).toContain('cannot be more than');
      }
    });

    it('should return valid for MAX_STOCK_QUANTITY exactly', () => {
      // Arrange & Act
      const result = validateStockQuantity(String(MAX_STOCK_QUANTITY));

      // Assert
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.value).toBe(MAX_STOCK_QUANTITY);
      }
    });

    // TC-FE-UTIL-016
    it('should return invalid for non-numeric input', () => {
      // Arrange
      const invalidInputs = ['abc', 'one', '12abc', 'abc12', '!@#'];

      // Act & Assert
      for (const input of invalidInputs) {
        const result = validateStockQuantity(input);
        expect(result.valid).toBe(false);
      }
    });

    it('should trim whitespace from input', () => {
      // Arrange & Act
      const result = validateStockQuantity('  100  ');

      // Assert
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.value).toBe(100);
      }
    });

    it('should handle leading zeros', () => {
      // Arrange & Act
      const result = validateStockQuantity('007');

      // Assert
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.value).toBe(7);
      }
    });
  });

  describe('MAX_STOCK_QUANTITY', () => {
    it('should be the maximum 32-bit signed integer', () => {
      // Assert
      expect(MAX_STOCK_QUANTITY).toBe(2147483647);
    });
  });
});

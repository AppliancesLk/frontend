/**
 * @file currency.test.ts
 * @description Tests for currency formatting utilities
 *
 * Test Case IDs:
 * - TC-FE-UTIL-001: formatCurrency should format string decimals correctly
 * - TC-FE-UTIL-002: formatCurrency should format number values correctly
 * - TC-FE-UTIL-003: formatCurrency should handle large values
 * - TC-FE-UTIL-004: parseMinorUnits should convert decimal string to bigint
 * - TC-FE-UTIL-005: parseMinorUnits should return null for invalid input
 * - TC-FE-UTIL-006: formatMinorUnits should convert bigint to decimal string
 */

import { describe, it, expect } from 'vitest';
import { formatCurrency, parseMinorUnits, formatMinorUnits } from './currency';

describe('currency utilities', () => {
  describe('formatCurrency', () => {
    // TC-FE-UTIL-001
    it('should format string decimals correctly', () => {
      // Arrange & Act
      const result = formatCurrency('9999.99');

      // Assert
      expect(result).toBe('LKR 9,999.99');
    });

    // TC-FE-UTIL-002
    it('should format number values correctly', () => {
      // Arrange & Act
      const result = formatCurrency(1234.56);

      // Assert
      expect(result).toBe('LKR 1,234.56');
    });

    // TC-FE-UTIL-003
    it('should handle large values', () => {
      // Arrange & Act
      const result = formatCurrency('1234567890.50');

      // Assert
      expect(result).toBe('LKR 1,234,567,890.50');
    });

    it('should handle zero', () => {
      // Arrange & Act
      const stringResult = formatCurrency('0.00');
      const numberResult = formatCurrency(0);

      // Assert
      expect(stringResult).toBe('LKR 0.00');
      expect(numberResult).toBe('LKR 0.00');
    });

    it('should handle string with single decimal place', () => {
      // Arrange & Act
      const result = formatCurrency('100.5');

      // Assert
      expect(result).toBe('LKR 100.50');
    });

    it('should handle whole number strings', () => {
      // Arrange & Act
      const result = formatCurrency('5000');

      // Assert
      expect(result).toBe('LKR 5,000.00');
    });

    it('should handle small decimal values', () => {
      // Arrange & Act
      const result = formatCurrency('0.01');

      // Assert
      expect(result).toBe('LKR 0.01');
    });
  });

  describe('parseMinorUnits', () => {
    // TC-FE-UTIL-004
    it('should convert decimal string to bigint (cents)', () => {
      // Arrange & Act
      const result = parseMinorUnits('99.99');

      // Assert
      expect(result).toBe(9999n);
    });

    // TC-FE-UTIL-005
    it('should return null for invalid input', () => {
      // Arrange & Act & Assert
      expect(parseMinorUnits('abc')).toBeNull();
      expect(parseMinorUnits('-10.00')).toBeNull();
      expect(parseMinorUnits('10.999')).toBeNull(); // More than 2 decimal places
      expect(parseMinorUnits('')).toBeNull();
    });

    it('should handle whole numbers', () => {
      // Arrange & Act
      const result = parseMinorUnits('100');

      // Assert
      expect(result).toBe(10000n);
    });

    it('should handle single decimal place', () => {
      // Arrange & Act
      const result = parseMinorUnits('50.5');

      // Assert
      expect(result).toBe(5050n);
    });

    it('should handle zero', () => {
      // Arrange & Act
      const result = parseMinorUnits('0');

      // Assert
      expect(result).toBe(0n);
    });

    it('should handle large values', () => {
      // Arrange & Act
      const result = parseMinorUnits('1234567890.12');

      // Assert
      expect(result).toBe(123456789012n);
    });
  });

  describe('formatMinorUnits', () => {
    // TC-FE-UTIL-006
    it('should convert bigint (cents) to decimal string', () => {
      // Arrange & Act
      const result = formatMinorUnits(9999n);

      // Assert
      expect(result).toBe('99.99');
    });

    it('should handle zero', () => {
      // Arrange & Act
      const result = formatMinorUnits(0n);

      // Assert
      expect(result).toBe('0.00');
    });

    it('should handle single digit cents', () => {
      // Arrange & Act
      const result = formatMinorUnits(5n);

      // Assert
      expect(result).toBe('0.05');
    });

    it('should handle values less than a dollar', () => {
      // Arrange & Act
      const result = formatMinorUnits(50n);

      // Assert
      expect(result).toBe('0.50');
    });

    it('should handle large values', () => {
      // Arrange & Act
      const result = formatMinorUnits(123456789012n);

      // Assert
      expect(result).toBe('1234567890.12');
    });
  });
});

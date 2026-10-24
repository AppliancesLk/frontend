/**
 * @file date.test.ts
 * @description Tests for date formatting utilities
 *
 * Test Case IDs:
 * - TC-FE-UTIL-040: Should format valid ISO date string
 * - TC-FE-UTIL-041: Should return em-dash for invalid date
 * - TC-FE-UTIL-042: Should format dates in Sri Lanka timezone
 * - TC-FE-UTIL-043: Should use uppercase AM/PM
 */

import { describe, it, expect } from 'vitest';
import { formatDate } from './date';

describe('date utilities', () => {
  describe('formatDate', () => {
    // TC-FE-UTIL-040
    it('should format valid ISO date string', () => {
      // Arrange
      const isoDate = '2024-03-15T10:30:00.000Z';

      // Act
      const result = formatDate(isoDate);

      // Assert
      expect(result).toMatch(/Mar\s+15,\s+2024/); // Date portion
      expect(result).toMatch(/\d{1,2}:\d{2}\s*[AP]M/); // Time with AM/PM
    });

    // TC-FE-UTIL-041
    it('should return em-dash for invalid date', () => {
      // Arrange
      const invalidDates = ['invalid', '', 'not-a-date', 'abc123'];

      // Act & Assert
      for (const date of invalidDates) {
        const result = formatDate(date);
        expect(result).toBe('\u2014'); // Em-dash
      }
    });

    // TC-FE-UTIL-042
    it('should format dates consistently', () => {
      // Arrange
      const testDate = '2024-06-20T14:00:00.000Z';

      // Act
      const result = formatDate(testDate);

      // Assert
      expect(result).toContain('Jun');
      expect(result).toContain('20');
      expect(result).toContain('2024');
    });

    // TC-FE-UTIL-043
    it('should use uppercase AM/PM', () => {
      // Arrange
      const morningDate = '2024-03-15T03:30:00.000Z'; // Will be morning in Sri Lanka
      const afternoonDate = '2024-03-15T10:30:00.000Z'; // Will be afternoon in Sri Lanka

      // Act
      const morningResult = formatDate(morningDate);
      const afternoonResult = formatDate(afternoonDate);

      // Assert - should have uppercase AM or PM
      expect(morningResult + afternoonResult).toMatch(/[AP]M/);
      expect(morningResult + afternoonResult).not.toMatch(/[ap]m(?![A-Z])/);
    });

    it('should handle midnight', () => {
      // Arrange
      const midnightUtc = '2024-03-15T00:00:00.000Z';

      // Act
      const result = formatDate(midnightUtc);

      // Assert
      expect(result).toContain('2024');
      expect(result).toMatch(/[AP]M/);
    });

    it('should handle end of year dates', () => {
      // Arrange
      const endOfYear = '2024-12-31T23:59:59.000Z';

      // Act
      const result = formatDate(endOfYear);

      // Assert
      expect(result).toContain('2025'); // In Sri Lanka timezone (UTC+5:30), this becomes Jan 1
      expect(result).toContain('Jan');
    });

    it('should handle beginning of year dates', () => {
      // Arrange
      const beginningOfYear = '2024-01-01T00:00:00.000Z';

      // Act
      const result = formatDate(beginningOfYear);

      // Assert
      expect(result).toContain('2024');
      expect(result).toContain('Jan');
    });

    it('should format dates with timezone offset correctly', () => {
      // Arrange - date with explicit timezone
      const dateWithOffset = '2024-03-15T10:30:00+05:30';

      // Act
      const result = formatDate(dateWithOffset);

      // Assert
      expect(result).not.toBe('\u2014');
      expect(result).toContain('2024');
    });
  });
});

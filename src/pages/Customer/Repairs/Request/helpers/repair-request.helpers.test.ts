/**
 * @file repair-request.helpers.test.ts
 * @description Tests for repair request validation helpers
 *
 * Test Case IDs:
 * - TC-FE-REPAIR-001: validateRepairRequest should return error for empty device type
 * - TC-FE-REPAIR-002: validateRepairRequest should return error for empty brand
 * - TC-FE-REPAIR-003: validateRepairRequest should return error for empty model
 * - TC-FE-REPAIR-004: validateRepairRequest should return error for short problem description
 * - TC-FE-REPAIR-005: validateRepairRequest should return error for too long fields
 * - TC-FE-REPAIR-006: validateRepairRequest should return error for invalid date format
 * - TC-FE-REPAIR-007: validateRepairRequest should return empty object for valid input
 * - TC-FE-REPAIR-008: hasErrors should return true when errors exist
 * - TC-FE-REPAIR-009: hasErrors should return false for empty error object
 */

import { describe, it, expect } from 'vitest';
import { validateRepairRequest, hasErrors } from './repair-request.helpers';
import type { RepairRequestDraft } from '../types/repair-request.types';

describe('repair-request.helpers', () => {
  const validDraft: RepairRequestDraft = {
    deviceType: 'Refrigerator',
    brand: 'Samsung',
    model: 'RF28R7201SR',
    serialNumber: 'SN123456789',
    purchaseDate: '2023-01-15',
    problemDescription:
      'The refrigerator is not cooling properly. Temperature is higher than normal.',
  };

  describe('validateRepairRequest', () => {
    // TC-FE-REPAIR-001
    it('should return error for empty device type', () => {
      // Arrange
      const draft: RepairRequestDraft = { ...validDraft, deviceType: '' };

      // Act
      const errors = validateRepairRequest(draft);

      // Assert
      expect(errors.deviceType).toBeDefined();
    });

    // TC-FE-REPAIR-002
    it('should return error for empty brand', () => {
      // Arrange
      const draft: RepairRequestDraft = { ...validDraft, brand: '' };

      // Act
      const errors = validateRepairRequest(draft);

      // Assert
      expect(errors.brand).toBeDefined();
    });

    // TC-FE-REPAIR-003
    it('should return error for empty model', () => {
      // Arrange
      const draft: RepairRequestDraft = { ...validDraft, model: '' };

      // Act
      const errors = validateRepairRequest(draft);

      // Assert
      expect(errors.model).toBeDefined();
    });

    // TC-FE-REPAIR-004
    it('should return error for short problem description', () => {
      // Arrange
      const draft: RepairRequestDraft = {
        ...validDraft,
        problemDescription: 'Too short',
      };

      // Act
      const errors = validateRepairRequest(draft);

      // Assert
      expect(errors.problemDescription).toBeDefined();
      expect(errors.problemDescription).toContain('at least 10 characters');
    });

    it('should return error for empty problem description', () => {
      // Arrange
      const draft: RepairRequestDraft = { ...validDraft, problemDescription: '' };

      // Act
      const errors = validateRepairRequest(draft);

      // Assert
      expect(errors.problemDescription).toBeDefined();
    });

    // TC-FE-REPAIR-005
    it('should return error for too long fields', () => {
      // Arrange
      const longString = 'a'.repeat(150);
      const draft: RepairRequestDraft = {
        ...validDraft,
        deviceType: longString,
        brand: longString,
        model: longString,
      };

      // Act
      const errors = validateRepairRequest(draft);

      // Assert
      expect(errors.deviceType).toBeDefined();
      expect(errors.brand).toBeDefined();
      expect(errors.model).toBeDefined();
    });

    it('should return error for too long problem description', () => {
      // Arrange
      const draft: RepairRequestDraft = {
        ...validDraft,
        problemDescription: 'a'.repeat(2500),
      };

      // Act
      const errors = validateRepairRequest(draft);

      // Assert
      expect(errors.problemDescription).toBeDefined();
      expect(errors.problemDescription).toContain('too long');
    });

    // TC-FE-REPAIR-006
    it('should return error for invalid date format', () => {
      // Arrange
      const invalidDates = [
        '2023/01/15', // Wrong separator
        '15-01-2023', // DD-MM-YYYY instead of YYYY-MM-DD
        '2023-1-15', // Single digit month
        'invalid-date',
        '2023-13-01', // Invalid month
      ];

      // Act & Assert
      for (const purchaseDate of invalidDates) {
        const draft: RepairRequestDraft = { ...validDraft, purchaseDate };
        const errors = validateRepairRequest(draft);
        expect(errors.purchaseDate).toBeDefined();
      }
    });

    it('should accept valid date format', () => {
      // Arrange
      const validDates = ['2023-01-15', '2024-12-31', '2020-06-01'];

      // Act & Assert
      for (const purchaseDate of validDates) {
        const draft: RepairRequestDraft = { ...validDraft, purchaseDate };
        const errors = validateRepairRequest(draft);
        expect(errors.purchaseDate).toBeUndefined();
      }
    });

    // TC-FE-REPAIR-007
    it('should return empty object for valid input', () => {
      // Arrange & Act
      const errors = validateRepairRequest(validDraft);

      // Assert
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should accept empty optional fields', () => {
      // Arrange
      const draft: RepairRequestDraft = {
        ...validDraft,
        serialNumber: '',
        purchaseDate: '',
      };

      // Act
      const errors = validateRepairRequest(draft);

      // Assert
      expect(errors.serialNumber).toBeUndefined();
      expect(errors.purchaseDate).toBeUndefined();
    });

    it('should return error for too long serial number', () => {
      // Arrange
      const draft: RepairRequestDraft = {
        ...validDraft,
        serialNumber: 'a'.repeat(150),
      };

      // Act
      const errors = validateRepairRequest(draft);

      // Assert
      expect(errors.serialNumber).toBeDefined();
    });

    it('should trim whitespace when validating required fields', () => {
      // Arrange - fields with only whitespace
      const draft: RepairRequestDraft = {
        deviceType: '   ',
        brand: '   ',
        model: '   ',
        serialNumber: '',
        purchaseDate: '',
        problemDescription: '   ',
      };

      // Act
      const errors = validateRepairRequest(draft);

      // Assert
      expect(errors.deviceType).toBeDefined();
      expect(errors.brand).toBeDefined();
      expect(errors.model).toBeDefined();
      expect(errors.problemDescription).toBeDefined();
    });
  });

  describe('hasErrors', () => {
    // TC-FE-REPAIR-008
    it('should return true when errors exist', () => {
      // Arrange
      const errors = { deviceType: 'Device type is required' };

      // Act
      const result = hasErrors(errors);

      // Assert
      expect(result).toBe(true);
    });

    // TC-FE-REPAIR-009
    it('should return false for empty error object', () => {
      // Arrange
      const errors = {};

      // Act
      const result = hasErrors(errors);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true for multiple errors', () => {
      // Arrange
      const errors = {
        deviceType: 'Required',
        brand: 'Required',
        model: 'Required',
      };

      // Act
      const result = hasErrors(errors);

      // Assert
      expect(result).toBe(true);
    });
  });
});

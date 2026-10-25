/**
 * @file repairService.test.ts
 * @description Tests for repair service API calls
 *
 * Test Case IDs:
 * - TC-FE-REPAIR-SVC-001: createRepairTicket calls POST /repairs
 * - TC-FE-REPAIR-SVC-002: getCustomerRepairs calls GET /repairs
 * - TC-FE-REPAIR-SVC-003: getCustomerRepair calls GET /repairs/:id
 * - TC-FE-REPAIR-SVC-004: getAdminRepairs calls GET /repairs/admin
 * - TC-FE-REPAIR-SVC-005: approveRepair calls PATCH /repairs/admin/:id/approve
 * - TC-FE-REPAIR-SVC-006: rejectRepair calls PATCH /repairs/admin/:id/reject
 * - TC-FE-REPAIR-SVC-007: assignRepair calls PATCH /repairs/admin/:id/assign
 * - TC-FE-REPAIR-SVC-008: updateRepairStatus calls PATCH /repairs/repairer/:id/status
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as repairService from './repairService';
import apiClient from '../api/apiClient';
import type {
  RepairTicket,
  AdminRepairTicket,
  CreateRepairTicketRequest,
} from '../types/repair.types';

vi.mock('../api/apiClient');

const mockedApiClient = vi.mocked(apiClient);

describe('repairService', () => {
  const mockRepairTicket: RepairTicket = {
    id: 'repair-123',
    reference: 'REP-2024-001',
    customerId: 'customer-1',
    assignedRepairerId: null,
    device: {
      deviceType: 'Refrigerator',
      brand: 'Samsung',
      model: 'RS65R',
      serialNumber: 'SN123456',
    },
    problemDescription: 'Not cooling properly',
    status: 'PENDING',
    reviewedAt: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockAdminRepairTicket: AdminRepairTicket = {
    id: 'repair-123',
    reference: 'REP-2024-001',
    customer: { id: 'customer-1', username: 'testuser', email: 'test@example.com' },
    assignedRepairerId: null,
    assignedRepairer: null,
    device: mockRepairTicket.device,
    problemDescription: 'Not cooling properly',
    status: 'PENDING',
    reviewedAt: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createRepairTicket', () => {
    // TC-FE-REPAIR-SVC-001
    it('should call POST /repairs with ticket data', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockRepairTicket });

      const request: CreateRepairTicketRequest = {
        device: {
          deviceType: 'Refrigerator',
          brand: 'Samsung',
          model: 'RS65R',
          serialNumber: 'SN123456',
        },
        problemDescription: 'Not cooling properly',
      };

      const result = await repairService.createRepairTicket(request);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/repairs', request);
      expect(result).toEqual(mockRepairTicket);
    });

    it('should propagate API errors', async () => {
      mockedApiClient.post.mockRejectedValue(new Error('Validation failed'));

      await expect(
        repairService.createRepairTicket({
          device: { deviceType: '', brand: '', model: '' },
          problemDescription: '',
        }),
      ).rejects.toThrow('Validation failed');
    });
  });

  describe('getCustomerRepairs', () => {
    // TC-FE-REPAIR-SVC-002
    it('should call GET /repairs and return repair list', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [mockRepairTicket] });

      const result = await repairService.getCustomerRepairs();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/repairs', { signal: undefined });
      expect(result).toEqual([mockRepairTicket]);
    });

    it('should pass abort signal', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [] });
      const controller = new AbortController();

      await repairService.getCustomerRepairs(controller.signal);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/repairs', {
        signal: controller.signal,
      });
    });
  });

  describe('getCustomerRepair', () => {
    // TC-FE-REPAIR-SVC-003
    it('should call GET /repairs/:id and return repair', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockRepairTicket });

      const result = await repairService.getCustomerRepair('repair-123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/repairs/repair-123', {
        signal: undefined,
      });
      expect(result).toEqual(mockRepairTicket);
    });
  });

  describe('getAdminRepairs', () => {
    // TC-FE-REPAIR-SVC-004
    it('should call GET /repairs/admin and return admin repair list', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [mockAdminRepairTicket] });

      const result = await repairService.getAdminRepairs();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/repairs/admin', {
        signal: undefined,
      });
      expect(result).toEqual([mockAdminRepairTicket]);
    });
  });

  describe('getAdminRepair', () => {
    it('should call GET /repairs/admin/:id', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockAdminRepairTicket });

      const result = await repairService.getAdminRepair('repair-123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/repairs/admin/repair-123', {
        signal: undefined,
      });
      expect(result).toEqual(mockAdminRepairTicket);
    });
  });

  describe('approveRepair', () => {
    // TC-FE-REPAIR-SVC-005
    it('should call PATCH /repairs/admin/:id/approve', async () => {
      const approvedTicket = { ...mockAdminRepairTicket, status: 'APPROVED' as const };
      mockedApiClient.patch.mockResolvedValue({ data: approvedTicket });

      const result = await repairService.approveRepair('repair-123');

      expect(mockedApiClient.patch).toHaveBeenCalledWith(
        '/repairs/admin/repair-123/approve',
      );
      expect(result.status).toBe('APPROVED');
    });
  });

  describe('rejectRepair', () => {
    // TC-FE-REPAIR-SVC-006
    it('should call PATCH /repairs/admin/:id/reject', async () => {
      const rejectedTicket = { ...mockAdminRepairTicket, status: 'REJECTED' as const };
      mockedApiClient.patch.mockResolvedValue({ data: rejectedTicket });

      const result = await repairService.rejectRepair('repair-123');

      expect(mockedApiClient.patch).toHaveBeenCalledWith(
        '/repairs/admin/repair-123/reject',
        undefined,
      );
      expect(result.status).toBe('REJECTED');
    });

    it('should include rejection reason when provided', async () => {
      const rejectedTicket = { ...mockAdminRepairTicket, status: 'REJECTED' as const };
      mockedApiClient.patch.mockResolvedValue({ data: rejectedTicket });

      await repairService.rejectRepair('repair-123', {
        rejectionReason: 'Device not under warranty',
      });

      expect(mockedApiClient.patch).toHaveBeenCalledWith(
        '/repairs/admin/repair-123/reject',
        { rejectionReason: 'Device not under warranty' },
      );
    });
  });

  describe('assignRepair', () => {
    // TC-FE-REPAIR-SVC-007
    it('should call PATCH /repairs/admin/:id/assign with repairer ID', async () => {
      const assignedTicket = {
        ...mockAdminRepairTicket,
        status: 'ASSIGNED' as const,
        assignedRepairerId: 'repairer-1',
      };
      mockedApiClient.patch.mockResolvedValue({ data: assignedTicket });

      const result = await repairService.assignRepair('repair-123', 'repairer-1');

      expect(mockedApiClient.patch).toHaveBeenCalledWith(
        '/repairs/admin/repair-123/assign',
        { repairerId: 'repairer-1' },
      );
      expect(result.assignedRepairerId).toBe('repairer-1');
    });
  });

  describe('getRepairerRepairs', () => {
    it('should call GET /repairs/repairer', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [] });

      await repairService.getRepairerRepairs();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/repairs/repairer', {
        signal: undefined,
      });
    });
  });

  describe('getRepairerRepair', () => {
    it('should call GET /repairs/repairer/:id', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockRepairTicket });

      await repairService.getRepairerRepair('repair-123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/repairs/repairer/repair-123', {
        signal: undefined,
      });
    });
  });

  describe('updateRepairStatus', () => {
    // TC-FE-REPAIR-SVC-008
    it('should call PATCH /repairs/repairer/:id/status with new status', async () => {
      mockedApiClient.patch.mockResolvedValue({
        data: { ...mockRepairTicket, status: 'IN_PROGRESS' },
      });

      const result = await repairService.updateRepairStatus('repair-123', {
        status: 'IN_PROGRESS',
      });

      expect(mockedApiClient.patch).toHaveBeenCalledWith(
        '/repairs/repairer/repair-123/status',
        { status: 'IN_PROGRESS' },
      );
      expect(result.status).toBe('IN_PROGRESS');
    });
  });
});

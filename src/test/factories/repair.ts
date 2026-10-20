import type {
  RepairTicket,
  AdminRepairTicket,
  RepairerRepairTicket,
  RepairStatus,
  DeviceInformation,
} from '../../types/repair.types';

let repairCounter = 0;

/**
 * Create mock device information.
 */
export function createMockDevice(
  overrides: Partial<DeviceInformation> = {},
): DeviceInformation {
  return {
    deviceType: 'Refrigerator',
    brand: 'Samsung',
    model: 'RF28R7201SR',
    serialNumber: 'SN123456789',
    purchaseDate: '2023-01-15',
    ...overrides,
  };
}

/**
 * Create a mock repair ticket (customer view).
 */
export function createMockRepairTicket(
  overrides: Partial<RepairTicket> = {},
): RepairTicket {
  repairCounter++;
  const now = new Date().toISOString();
  return {
    id: `repair-${repairCounter}`,
    reference: `REP-${String(repairCounter).padStart(6, '0')}`,
    customerId: 'customer-1',
    assignedRepairerId: null,
    device: createMockDevice(),
    problemDescription: 'The refrigerator is not cooling properly.',
    status: 'PENDING' as RepairStatus,
    reviewedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock admin repair ticket.
 */
export function createMockAdminRepairTicket(
  overrides: Partial<AdminRepairTicket> = {},
): AdminRepairTicket {
  repairCounter++;
  const now = new Date().toISOString();
  return {
    id: `repair-${repairCounter}`,
    reference: `REP-${String(repairCounter).padStart(6, '0')}`,
    customer: {
      id: 'customer-1',
      username: 'testcustomer',
      email: 'customer@example.com',
    },
    assignedRepairerId: null,
    assignedRepairer: null,
    device: createMockDevice(),
    problemDescription: 'The refrigerator is not cooling properly.',
    status: 'PENDING' as RepairStatus,
    reviewedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock repairer repair ticket.
 */
export function createMockRepairerTicket(
  overrides: Partial<RepairerRepairTicket> = {},
): RepairerRepairTicket {
  repairCounter++;
  const now = new Date().toISOString();
  return {
    id: `repair-${repairCounter}`,
    reference: `REP-${String(repairCounter).padStart(6, '0')}`,
    customer: {
      id: 'customer-1',
      username: 'testcustomer',
      email: 'customer@example.com',
    },
    device: createMockDevice(),
    problemDescription: 'The refrigerator is not cooling properly.',
    status: 'ASSIGNED' as RepairStatus,
    reviewedAt: new Date().toISOString(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create multiple mock repair tickets.
 */
export function createMockRepairTickets(
  count: number,
  overrides: Partial<RepairTicket> = {},
): RepairTicket[] {
  return Array.from({ length: count }, () =>
    createMockRepairTicket(overrides),
  );
}

/**
 * Create a repair ticket with a specific status.
 */
export function createMockRepairWithStatus(status: RepairStatus): RepairTicket {
  return createMockRepairTicket({ status });
}

/**
 * Reset the repair counter (for test isolation).
 */
export function resetRepairFactory(): void {
  repairCounter = 0;
}

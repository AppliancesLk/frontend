import { translations } from './translations';
import type { RepairStatus } from '../types/repair.types';

/**
 * Returns the valid next statuses for a repairer based on current status
 */
export function getValidNextStatuses(
  currentStatus: RepairStatus,
): RepairStatus[] {
  const transitions: Record<RepairStatus, RepairStatus[]> = {
    PENDING: [],
    APPROVED: ['IN_PROGRESS'],
    REJECTED: [],
    ASSIGNED: ['IN_PROGRESS'],
    IN_PROGRESS: ['AWAITING_PARTS', 'READY_FOR_COLLECTION'],
    AWAITING_PARTS: ['IN_PROGRESS'],
    READY_FOR_COLLECTION: ['COMPLETED'],
    COMPLETED: [],
    CANCELLED: [],
  };

  return transitions[currentStatus] || [];
}

/**
 * Returns human-readable status labels
 */
export function getStatusLabel(status: RepairStatus): string {
  return translations.repairs.statuses[status] || status;
}

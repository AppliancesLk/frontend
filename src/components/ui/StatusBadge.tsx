import type { ReactNode } from 'react';
export type Severity =
  'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'special';
const statuses: Record<string, Severity> = {
  SUCCESS: 'success',
  PAID: 'success',
  DELIVERED: 'success',
  COMPLETED: 'success',
  APPROVED: 'special',
  IN_STOCK: 'success',
  ONLINE: 'success',
  OPEN: 'special',
  PENDING: 'warning',
  PENDING_PAYMENT: 'warning',
  PROCESSING: 'info',
  AWAITING_PARTS: 'warning',
  LOW_STOCK: 'warning',
  IN_PROGRESS: 'info',
  SHIPPED: 'info',
  ACTIVE: 'info',
  CONFIRMED: 'info',
  FAILED: 'danger',
  REJECTED: 'danger',
  CANCELLED: 'danger',
  OUT_OF_STOCK: 'danger',
  ERROR: 'danger',
  ASSIGNED: 'special',
  READY_FOR_COLLECTION: 'success',
  AWAITING_REVIEW: 'special',
};
export function StatusBadge({
  status,
  children,
  tone,
}: {
  status?: string;
  children: ReactNode;
  tone?: Severity;
}) {
  return (
    <span
      className={`ui-badge ui-tone-${tone ?? statuses[status ?? ''] ?? 'neutral'}`}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
      />
      {children}
    </span>
  );
}

import type { RepairStatus } from '../../../../types/repair.types';
import { translations } from '../../../../utils/translations';

const t = translations.repairs;

const statusColors: Record<
  RepairStatus,
  { bg: string; text: string }
> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  APPROVED: { bg: 'bg-green-100', text: 'text-green-800' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-800' },
  ASSIGNED: { bg: 'bg-blue-100', text: 'text-blue-800' },
  IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-800' },
  AWAITING_PARTS: { bg: 'bg-orange-100', text: 'text-orange-800' },
  READY_FOR_COLLECTION: { bg: 'bg-purple-100', text: 'text-purple-800' },
  COMPLETED: { bg: 'bg-slate-100', text: 'text-slate-800' },
  CANCELLED: { bg: 'bg-slate-100', text: 'text-slate-600' },
};

export function RepairStatusBadge({ status }: { status: RepairStatus }) {
  const colors = statusColors[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colors.bg} ${colors.text}`}
    >
      {t.statuses[status] || status}
    </span>
  );
}

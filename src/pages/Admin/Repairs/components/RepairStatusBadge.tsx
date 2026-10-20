import type { RepairStatus } from '../../../../types/repair.types';
import { translations } from '../../../../utils/translations';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
export function RepairStatusBadge({ status }: { status: RepairStatus }) {
  return (
    <StatusBadge status={status}>
      {translations.repairs.statuses[status] ?? status}
    </StatusBadge>
  );
}

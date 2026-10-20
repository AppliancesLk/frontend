import type { OrderStatus } from '../../../../types/order.types';
import { translations } from '../../../../utils/translations';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <StatusBadge status={status}>
      {translations.orders.statuses[status] ?? status}
    </StatusBadge>
  );
}

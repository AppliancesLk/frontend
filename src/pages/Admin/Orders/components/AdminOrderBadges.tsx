import type { OrderStatus } from '../../../../types/order.types';
import { translations } from '../../../../utils/translations';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
export function AdminOrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <StatusBadge status={status}>
      {translations.orders.statuses[status]}
    </StatusBadge>
  );
}
export function PaymentBadge({
  status,
}: {
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
}) {
  return (
    <StatusBadge status={status}>
      {translations.adminOrders.paymentStatuses[status]}
    </StatusBadge>
  );
}

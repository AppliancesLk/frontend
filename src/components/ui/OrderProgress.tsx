import type { OrderStatus, PaymentMethod } from '../../types/order.types';
import { translations } from '../../utils/translations';
import { uiText } from '../../utils/uiText';
import { Icon } from '../common/Icon';
const onlineSteps = [
  'PENDING_PAYMENT',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
] as const;
export function OrderProgress({
  status,
  paymentMethod = 'PAYHERE',
}: {
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
}) {
  if (status === 'CANCELLED') return null;
  const steps: readonly OrderStatus[] =
    paymentMethod === 'PAYHERE'
      ? onlineSteps
      : onlineSteps.filter((step) => step !== 'PENDING_PAYMENT');
  const current = steps.indexOf(status);
  return (
    <ol
      aria-label={uiText.orderProgress}
      className={`ui-panel grid grid-cols-2 gap-4 p-5 sm:p-6 ${steps.length === 5 ? 'sm:grid-cols-5' : 'sm:grid-cols-4'}`}
    >
      {steps.map((step, index) => (
        <li
          key={step}
          aria-current={step === status ? 'step' : undefined}
          className="flex items-center gap-3 sm:flex-col sm:items-start"
        >
          <span
            className={
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ' +
              (index < current
                ? 'bg-success-bg text-success'
                : index === current
                  ? 'bg-primary text-primary-on'
                  : 'bg-subtle text-fg-muted')
            }
          >
            {index < current ? (
              <Icon name="check" className="h-4 w-4" />
            ) : (
              index + 1
            )}
          </span>
          <span
            className={
              'text-xs font-medium leading-5 ' +
              (index === current ? 'text-fg-link' : 'text-fg-secondary')
            }
          >
            {translations.orders.statuses[step]}
          </span>
        </li>
      ))}
    </ol>
  );
}

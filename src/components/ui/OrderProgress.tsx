import type { OrderStatus } from '../../types/order.types';
import { translations } from '../../utils/translations';
import { uiText } from '../../utils/uiText';
import { Icon } from '../common/Icon';
const steps = [
  'PENDING_PAYMENT',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
] as const;
export function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED') return null;
  const current = steps.indexOf(status);
  return (
    <ol
      aria-label={uiText.orderProgress}
      className="ui-panel grid grid-cols-2 gap-4 p-5 sm:grid-cols-5 sm:p-6"
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
                ? 'bg-green-50 text-green-700'
                : index === current
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500')
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
              (index === current ? 'text-blue-700' : 'text-slate-600')
            }
          >
            {translations.orders.statuses[step]}
          </span>
        </li>
      ))}
    </ol>
  );
}

import type { Order } from '../../types/order.types';
import { formatDate } from '../../utils/date';
import { translations } from '../../utils/translations';
import { commerceText as t } from '../../utils/commerceText';
export function OrderTimeline({ history }: { history: Order['history'] }) {
  return (
    <section
      className="rounded-md border border-line bg-surface p-5 sm:p-6"
      aria-labelledby="order-history"
    >
      <h2 id="order-history" className="text-xl font-semibold">
        {t.history}
      </h2>
      {!history?.length ? (
        <p className="mt-4 text-sm text-fg-muted">{t.historyEmpty}</p>
      ) : (
        <ol className="mt-5 space-y-5 border-l border-line pl-5">
          {history.map((event) => (
            <li key={event.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-primary"
              />
              <p className="text-sm font-medium">
                {translations.orders.statuses[event.status]}
              </p>
              <time
                dateTime={event.createdAt}
                className="mt-1 block text-xs text-fg-muted"
              >
                {formatDate(event.createdAt)}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

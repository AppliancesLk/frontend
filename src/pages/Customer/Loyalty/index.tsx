import { generatePath, Link } from 'react-router-dom';
import { LoadingState } from '../../../components/ui/Feedback';
import { Button } from '../../../components/ui/Button';
import { ROUTES } from '../../../constants/routes';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { commerceText as t } from '../../../utils/commerceText';
import { useLoyaltyPage } from './hooks/useLoyaltyPage';
export default function LoyaltyPage() {
  const page = useLoyaltyPage();
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="ui-page-title">{t.loyalty}</h1>
      <p className="mt-3 text-sm leading-6 text-fg-secondary">
        {t.loyaltyDescription}
      </p>
      <Button
        variant="secondary"
        className="mt-5"
        onClick={page.refresh}
        busy={page.loading}
      >
        {t.refresh}
      </Button>
      {page.loading && <LoadingState label={t.loyalty} />}
      {page.error && (
        <p role="alert" className="ui-alert ui-tone-warning mt-6">
          {page.error}
        </p>
      )}
      {page.data && (
        <>
          <section className="mt-6 rounded-lg border border-line bg-primary-subtle p-6 sm:p-8">
            <h2 className="text-sm font-medium text-fg-secondary">
              {t.loyaltyBalance}
            </h2>
            <p className="mt-3 font-display text-4xl font-semibold text-fg-link">
              {formatCurrency(page.data.balance)}
            </p>
            {!page.data.entries.length && (
              <p className="mt-3 text-sm text-fg-secondary">{t.noCredit}</p>
            )}
            <Link
              to={ROUTES.products}
              className="ui-button ui-button-primary mt-5"
            >
              Continue shopping
            </Link>
          </section>
          <section className="mt-6 rounded-lg border border-line bg-surface p-5 sm:p-6">
            <h2 className="text-xl font-semibold">{t.recentActivity}</h2>
            {!page.data.entries.length ? (
              <p className="mt-4 text-sm text-fg-muted">{t.noActivity}</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {page.data.entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-wrap items-start justify-between gap-3 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {entry.kind === 'EARN'
                          ? t.earned
                          : entry.kind === 'REFUND'
                            ? t.refunded
                            : t.redeemed}
                      </p>
                      <Link
                        className="mt-1 block text-sm text-fg-link underline"
                        to={generatePath(ROUTES.orderDetail, {
                          id: entry.orderId,
                        })}
                      >
                        Order #{entry.orderId.slice(0, 8).toUpperCase()}
                      </Link>
                      <time
                        className="mt-1 block text-xs text-fg-muted"
                        dateTime={entry.createdAt}
                      >
                        {formatDate(entry.createdAt)}
                      </time>
                    </div>
                    <span
                      className={`font-semibold ${entry.kind === 'REDEEM' ? 'text-fg' : 'text-success'}`}
                    >
                      {entry.kind === 'REDEEM' ? '−' : '+'}
                      {formatCurrency(entry.amount.replace(/^-/, ''))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}

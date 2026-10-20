import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
import type { useCheckoutPage } from '../hooks/useCheckoutPage';

const t = translations.checkout;

export function PaymentAction({
  page,
}: {
  page: ReturnType<typeof useCheckoutPage>;
}) {
  const retryable =
    page.paymentStatus === 'FAILED' || page.paymentStatus === 'CANCELLED';
  return (
    <section
      aria-labelledby="payment-heading"
      className="rounded-md border border-line bg-surface p-5  sm:p-6"
    >
      <h2
        id="payment-heading"
        className="flex items-center gap-3 text-xl font-semibold text-fg"
      >
        <span className="form-step-number">2</span>
        {t.paymentTitle}
      </h2>
      <p className="mt-2 text-sm leading-6 text-fg-muted">
        {t.paymentDescription}
      </p>
      {page.paymentMessage && (
        <div
          role="status"
          className={`mt-5 rounded-sm border p-4 text-sm ${
            retryable
              ? 'border-warning/25 bg-warning-bg text-warning'
              : 'border-info/25 bg-info-bg text-info'
          }`}
        >
          {page.paymentMessage}
        </div>
      )}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void page.pay()}
          disabled={page.paying}
          className="auth-primary h-12 flex-1 disabled:cursor-not-allowed "
        >
          {page.paying
            ? t.processingPayment
            : retryable
              ? t.retryPayment
              : page.summary
                ? `Pay ${formatCurrency(page.summary.total)}`
                : t.payWithPayHere}
        </button>
        {page.paymentStatus === 'PENDING' && !page.paying && (
          <button
            type="button"
            onClick={() => void page.retryVerification()}
            className="auth-secondary h-12 flex-1"
          >
            {t.checkPaymentStatus}
          </button>
        )}
      </div>
      <p className="mt-3 text-xs leading-5 text-fg-muted">
        {t.backendVerificationNotice}
      </p>
    </section>
  );
}

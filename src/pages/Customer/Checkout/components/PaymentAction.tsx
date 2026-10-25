import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
import { commerceText as c } from '../../../../utils/commerceText';
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
      className="rounded-md border border-line bg-surface p-5 sm:p-6"
    >
      <h2
        id="payment-heading"
        className="flex items-center gap-3 text-xl font-semibold text-fg"
      >
        <span className="form-step-number">2</span>
        {c.method}
      </h2>
      <fieldset className="mt-5 space-y-3" disabled={page.locked}>
        <legend className="sr-only">{c.method}</legend>
        {(['CASH_ON_DELIVERY', 'PAYHERE'] as const).map((method) => (
          <label
            key={method}
            className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 ${page.paymentMethod === method ? 'border-primary bg-primary-subtle' : 'border-line'}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={page.paymentMethod === method}
              onChange={() => page.changePaymentMethod(method)}
              className="mt-1 h-5 w-5 accent-primary"
            />
            <span>
              <span className="block text-sm font-semibold">
                {method === 'CASH_ON_DELIVERY' ? c.cod : c.payHere}
              </span>
              <span className="mt-1 block text-sm text-fg-secondary">
                {method === 'CASH_ON_DELIVERY'
                  ? c.codDescription
                  : c.payHereDescription}
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      <div className="mt-6 border-t border-line pt-5">
        <h3 className="font-semibold">{c.loyalty}</h3>
        <p className="mt-2 text-xs leading-5 text-fg-muted">
          {c.loyaltyDescription}
        </p>
        {page.loyaltyError ? (
          <p role="status" className="mt-3 text-sm text-warning">
            {page.loyaltyError}
          </p>
        ) : (
          <>
            <p className="mt-3 text-sm">
              {c.loyaltyBalance}:{' '}
              <strong>{formatCurrency(page.loyalty?.balance ?? '0.00')}</strong>
            </p>
            <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={page.useCredit}
                onChange={(e) => page.toggleCredit(e.target.checked)}
                disabled={
                  page.locked ||
                  !page.loyalty ||
                  page.loyalty.balance === '0.00'
                }
                className="h-5 w-5 accent-primary"
              />
              {c.useCredit}
            </label>
            {page.useCredit && (
              <div className="mt-3">
                <label htmlFor="loyalty-amount" className="auth-label">
                  {c.creditAmount}
                </label>
                <input
                  id="loyalty-amount"
                  className="ui-field"
                  inputMode="decimal"
                  value={page.creditAmount}
                  onChange={(e) => page.changeCredit(e.target.value)}
                  disabled={page.locked}
                  maxLength={31}
                />
              </div>
            )}
          </>
        )}
      </div>
      {page.paymentMessage && (
        <p
          role="status"
          className={`ui-alert mt-5 ${retryable ? 'ui-tone-warning' : 'ui-tone-info'}`}
        >
          {page.paymentMessage}
        </p>
      )}
      <p className="mt-5 flex flex-wrap justify-between gap-2 border-t border-line pt-4 text-lg font-semibold">
        <span>{c.amountDue}</span>
        <span>{formatCurrency(page.amountDue)}</span>
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void page.pay()}
          disabled={page.paying}
          className="auth-primary min-h-12 flex-1"
        >
          {page.paying
            ? c.placingOrder
            : page.amountDue === '0.00'
              ? c.fullyCovered
              : page.paymentMethod === 'CASH_ON_DELIVERY'
                ? c.placeOrder
                : retryable
                  ? t.retryPayment
                  : `Pay ${formatCurrency(page.amountDue)}`}
        </button>
        {page.paymentStatus === 'PENDING' &&
          !page.paying &&
          page.paymentMethod === 'PAYHERE' && (
            <button
              type="button"
              onClick={() => void page.retryVerification()}
              className="auth-secondary min-h-12"
            >
              {t.checkPaymentStatus}
            </button>
          )}
      </div>
      {page.paymentMethod === 'PAYHERE' && (
        <p className="mt-3 text-xs leading-5 text-fg-muted">
          {t.backendVerificationNotice}
        </p>
      )}
    </section>
  );
}

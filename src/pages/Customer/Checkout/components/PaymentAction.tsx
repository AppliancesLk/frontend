import { translations } from "../../../../utils/translations";
import type { useCheckoutPage } from "../hooks/useCheckoutPage";

const t = translations.checkout;

export function PaymentAction({
  page,
}: {
  page: ReturnType<typeof useCheckoutPage>;
}) {
  const retryable =
    page.paymentStatus === "FAILED" || page.paymentStatus === "CANCELLED";
  return (
    <section
      aria-labelledby="payment-heading"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 id="payment-heading" className="text-xl font-semibold text-slate-900">
        {t.paymentTitle}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {t.paymentDescription}
      </p>
      {page.paymentMessage && (
        <div
          role="status"
          className={`mt-5 rounded-lg border p-4 text-sm ${
            retryable
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-sky-200 bg-sky-50 text-sky-900"
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
          className="auth-primary h-12 flex-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {page.paying
            ? t.processingPayment
            : retryable
              ? t.retryPayment
              : t.payWithPayHere}
        </button>
        {page.paymentStatus === "PENDING" && !page.paying && (
          <button
            type="button"
            onClick={() => void page.retryVerification()}
            className="auth-secondary h-12 flex-1"
          >
            {t.checkPaymentStatus}
          </button>
        )}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        {t.backendVerificationNotice}
      </p>
    </section>
  );
}

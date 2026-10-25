import { LoadingState } from '../../../components/ui/Feedback';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import { translations } from '../../../utils/translations';
import { EmptyCart } from '../../../components/feedback/EmptyCart';
import { useCheckoutPage } from './hooks/useCheckoutPage';
import { DeliveryForm } from './components/DeliveryForm';
import { OrderSummary } from './components/OrderSummary';
import { PreparedCheckout } from './components/PreparedCheckout';
import { PaymentAction } from './components/PaymentAction';
const t = translations.checkout;
export default function CheckoutPage() {
  const { user } = useAuth();
  return user ? <CheckoutContent key={user.id} email={user.email} /> : null;
}
function CheckoutContent({ email }: { email: string }) {
  const page = useCheckoutPage(email);
  const errorFocus = useRef<HTMLDivElement>(null);
  const successFocus = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (page.error) errorFocus.current?.focus();
  }, [page.error]);
  useEffect(() => {
    if (page.summary) successFocus.current?.focus();
  }, [page.summary]);
  const blocked = page.cart?.items.some((item) => !item.isAvailable);
  useEffect(() => {
    const previous = document.title;
    document.title = `${t.title} | ${translations.common.storeName}`;
    return () => {
      document.title = previous;
    };
  }, []);
  return (
    <main className="bg-page px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <nav
          aria-label={translations.productDetails.breadcrumb}
          className="text-sm"
        >
          <ol className="flex flex-wrap items-center gap-2 text-fg-muted">
            <li>
              <Link
                to={ROUTES.cart}
                className="font-medium text-fg-link hover:text-fg-link"
              >
                {translations.cart.title}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{t.title}</li>
          </ol>
        </nav>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="ui-page-title text-fg">{t.title}</h1>
            <p className="mt-2 text-sm text-fg-muted">{t.description}</p>
          </div>
          <Link to={ROUTES.cart} className="auth-secondary">
            {t.backToCart}
          </Link>
        </div>
        {page.error && (
          <div
            ref={errorFocus}
            tabIndex={-1}
            role="alert"
            className="rounded-md border border-danger/25 bg-danger-bg p-4 text-sm text-danger outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            <p>{page.error}</p>
            <button
              type="button"
              disabled={page.saving || page.loading}
              onClick={() => void page.refresh()}
              className="mt-2 min-min-h-11 rounded-sm px-2 font-semibold underline underline-offset-4 "
            >
              {t.refreshCart}
            </button>
          </div>
        )}
        {page.summary && (
          <div
            ref={successFocus}
            tabIndex={-1}
            role="status"
            className="rounded-md border border-success/25 bg-success-bg p-5 text-success outline-none focus-visible:ring-2 focus-visible:ring-success"
          >
            <h2 className="text-lg font-semibold">{t.ready}</h2>
            <p className="mt-2 text-sm leading-6">{t.readyDescription}</p>
            <p className="mt-2 text-xs leading-5">{t.preparationNotice}</p>
          </div>
        )}
        {(page.changes.pricesChanged || page.changes.itemsChanged) && (
          <p
            role="status"
            className="rounded-md border border-warning/25 bg-warning-bg p-4 text-sm text-warning"
          >
            {page.changes.pricesChanged ? t.pricesChanged : t.itemsChanged}
          </p>
        )}
        {page.loading ? (
          <LoadingState label={t.loading} />
        ) : (
          page.cart &&
          (page.cart.items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {blocked && !page.summary && (
                <div
                  role="alert"
                  className="rounded-md border border-warning/25 bg-warning-bg p-4 text-sm text-warning"
                >
                  <p>{t.cartBlocked}</p>
                  <Link
                    to={ROUTES.cart}
                    className="mt-2 inline-block font-semibold underline underline-offset-4"
                  >
                    {t.fixCart}
                  </Link>
                </div>
              )}
              <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-8">
                <div className="min-w-0 space-y-6">
                  <DeliveryForm page={page} />
                  {page.summary && <PreparedCheckout summary={page.summary} />}
                  {page.summary && <PaymentAction page={page} />}
                </div>
                <OrderSummary
                  cart={page.cart}
                  summary={page.summary}
                  preview={page.latestSummary}
                  credit={page.creditPreview}
                  amountDue={page.amountDue}
                />
              </div>
            </>
          ))
        )}
      </div>
    </main>
  );
}

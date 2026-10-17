import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";
import { translations } from "../../../utils/translations";
import { EmptyCart } from "../../../components/feedback/EmptyCart";
import { useCheckoutPage } from "./hooks/useCheckoutPage";
import { DeliveryForm } from "./components/DeliveryForm";
import { OrderSummary } from "./components/OrderSummary";
import { PreparedCheckout } from "./components/PreparedCheckout";
import { PaymentAction } from "./components/PaymentAction";
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
    <main className="bg-slate-50 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav
          aria-label={translations.productDetails.breadcrumb}
          className="text-sm"
        >
          <ol className="flex flex-wrap items-center gap-2 text-slate-500">
            <li>
              <Link
                to={ROUTES.cart}
                className="font-medium text-blue-600 hover:text-blue-700"
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
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              {t.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{t.description}</p>
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
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <p>{page.error}</p>
            <button
              type="button"
              disabled={page.saving || page.loading}
              onClick={() => void page.refresh()}
              className="mt-2 min-h-10 rounded-lg px-2 font-semibold underline underline-offset-4 disabled:opacity-50"
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
            className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-900 outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            <h2 className="text-lg font-semibold">{t.ready}</h2>
            <p className="mt-2 text-sm leading-6">{t.readyDescription}</p>
            <p className="mt-2 text-xs leading-5">{t.preparationNotice}</p>
          </div>
        )}
        {(page.changes.pricesChanged || page.changes.itemsChanged) && (
          <p
            role="status"
            className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            {page.changes.pricesChanged ? t.pricesChanged : t.itemsChanged}
          </p>
        )}
        {page.loading ? (
          <section
            role="status"
            className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm"
          >
            {t.loading}
            <div
              aria-hidden="true"
              className="mt-6 h-48 rounded-lg bg-slate-100 motion-safe:animate-pulse"
            />
          </section>
        ) : (
          page.cart &&
          (page.cart.items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {blocked && !page.summary && (
                <div
                  role="alert"
                  className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
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
                />
              </div>
            </>
          ))
        )}
      </div>
    </main>
  );
}

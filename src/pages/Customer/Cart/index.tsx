import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import { translations } from '../../../utils/translations';
import { useCartPage } from './hooks/useCartPage';
import { CartItemRow } from './components/CartItemRow';
import { CartSummary } from './components/CartSummary';
import { EmptyCart } from './components/EmptyCart';
const t = translations.cart;

export default function CartPage() {
  const { user } = useAuth();
  // Remount local data if the authenticated account changes.
  return user ? <CartContent key={user.id} /> : null;
}
function CartContent() {
  const page = useCartPage();
  const [confirmClear, setConfirmClear] = useState(false);
  const busy = page.pending !== null;
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
          <ol className="flex items-center gap-2 text-slate-500">
            <li>
              <Link
                to={ROUTES.products}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {translations.productDetails.products}
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
          <Link to={ROUTES.products} className="auth-secondary">
            {translations.common.continueShopping}
          </Link>
        </div>
        {page.error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <p>{page.error}</p>
            <button
              type="button"
              onClick={() => void page.refresh()}
              disabled={busy || page.loading}
              className="rounded-lg px-3 py-2 font-semibold underline underline-offset-4 disabled:opacity-50"
            >
              {translations.common.retry}
            </button>
          </div>
        )}
        <p
          role="status"
          aria-live="polite"
          className={
            page.notice
              ? 'rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800'
              : 'sr-only'
          }
        >
          {page.notice}
        </p>
        {page.loading ? (
          <section
            role="status"
            className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <p className="text-sm text-slate-500">{t.loading}</p>
            <div
              aria-hidden="true"
              className="mt-6 space-y-4 motion-safe:animate-pulse"
            >
              {[1, 2, 3].map((key) => (
                <div key={key} className="h-24 rounded-lg bg-slate-100" />
              ))}
            </div>
          </section>
        ) : (
          page.cart &&
          (page.cart.items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
              <section
                aria-labelledby="cart-items"
                aria-busy={busy}
                className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6">
                  <h2 id="cart-items" className="font-semibold text-slate-900">
                    {t.items}{' '}
                    <span className="ml-1 font-normal text-slate-500">
                      ({page.cart.itemCount})
                    </span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    disabled={busy}
                    className="min-h-10 rounded-lg px-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {page.pending?.kind === 'clear' ? t.clearing : t.clear}
                  </button>
                </div>
                {confirmClear && (
                  <div
                    role="alert"
                    className="border-b border-amber-200 bg-amber-50 p-4 sm:px-6"
                  >
                    <p className="text-sm text-amber-900">{t.confirmClear}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setConfirmClear(false);
                          void page.clear();
                        }}
                        className="h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {t.clear}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setConfirmClear(false)}
                        className="auth-secondary"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                )}
                <ul className="divide-y divide-slate-200">
                  {page.cart.items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      disabled={busy}
                      updating={
                        page.pending?.kind === 'quantity' &&
                        page.pending.itemId === item.id
                      }
                      removing={
                        page.pending?.kind === 'remove' &&
                        page.pending.itemId === item.id
                      }
                      onQuantity={(direction) =>
                        void page.changeQuantity(item, direction)
                      }
                      onRemove={() => void page.remove(item)}
                    />
                  ))}
                </ul>
              </section>
              <CartSummary cart={page.cart} busy={busy} />
            </div>
          ))
        )}
      </div>
    </main>
  );
}

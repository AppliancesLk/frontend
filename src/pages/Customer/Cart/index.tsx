import { LoadingState } from '../../../components/ui/Feedback';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import { translations } from '../../../utils/translations';
import { useCartPage } from './hooks/useCartPage';
import { CartItemRow } from './components/CartItemRow';
import { CartSummary } from './components/CartSummary';
import { EmptyCart } from '../../../components/feedback/EmptyCart';
import { Icon } from '../../../components/common/Icon';
import { CartRecommendations } from './components/CartRecommendations';
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
    <main className="bg-page px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <nav
          aria-label={translations.productDetails.breadcrumb}
          className="text-sm"
        >
          <ol className="flex items-center gap-2 text-fg-muted">
            <li>
              <Link
                to={ROUTES.home}
                className="font-medium text-fg-link hover:text-fg-link"
              >
                {t.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{t.title}</li>
          </ol>
        </nav>
        {(!page.cart || page.cart.items.length > 0) && (
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="ui-page-title text-fg">{t.title}</h1>
              <p className="mt-2 text-sm text-fg-muted">{t.description}</p>
            </div>
            {page.cart && (
              <p className="self-end text-sm text-fg-muted">
                {page.cart.itemCount}{' '}
                {page.cart.itemCount === 1 ? t.oneInCart : t.inCart}
              </p>
            )}
          </div>
        )}
        {page.error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-danger/25 bg-danger-bg p-4 text-sm text-danger"
          >
            <p>{page.error}</p>
            <button
              type="button"
              onClick={() => void page.refresh()}
              disabled={busy || page.loading}
              className="rounded-sm px-3 py-2 font-semibold underline underline-offset-4 "
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
              ? 'rounded-sm bg-success-bg px-4 py-3 text-sm text-success'
              : 'sr-only'
          }
        >
          {page.notice}
        </p>
        {page.loading ? (
          <LoadingState label={t.loading} />
        ) : (
          page.cart &&
          (page.cart.items.length === 0 ? (
            <EmptyCart headingAs="h1" />
          ) : (
            <div className="space-y-8">
              <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-8">
                <div className="min-w-0 space-y-4">
                  <section
                    aria-labelledby="cart-items"
                    aria-busy={busy}
                    className="min-w-0 overflow-hidden rounded-md border border-line bg-surface "
                  >
                    <h2 id="cart-items" className="sr-only">
                      {t.items}
                    </h2>
                    {confirmClear && (
                      <div
                        role="alert"
                        className="border-b border-warning/25 bg-warning-bg p-4 sm:px-6"
                      >
                        <p className="text-sm text-warning">{t.confirmClear}</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              setConfirmClear(false);
                              void page.clear();
                            }}
                            className="ui-button ui-button-danger min-h-11 rounded-sm bg-danger px-4 text-sm font-medium text-primary-on hover:bg-danger "
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
                    <ul className="divide-y divide-line">
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
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link to={ROUTES.products} className="auth-secondary gap-2">
                      <Icon name="arrow" className="h-4 w-4 rotate-180" />
                      {translations.common.continueShopping}
                    </Link>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmClear(true)}
                      className="flex min-h-11 items-center gap-2 rounded-sm px-3 text-sm font-medium text-danger hover:bg-danger-bg "
                    >
                      <Icon name="trash" />
                      {page.pending?.kind === 'clear' ? t.clearing : t.clear}
                    </button>
                  </div>
                  <CartRecommendations
                    cart={page.cart}
                    busy={busy}
                    onAdd={(id) => void page.add(id)}
                  />
                </div>
                <CartSummary cart={page.cart} busy={busy} />
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

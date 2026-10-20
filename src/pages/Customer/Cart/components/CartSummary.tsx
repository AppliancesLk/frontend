import { Icon } from '../../../../components/common/Icon';
import { CartBenefits } from './CartBenefits';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import type { Cart } from '../../../../types/cart.types';
import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
const t = translations.cart;
export function CartSummary({ cart, busy }: { cart: Cart; busy: boolean }) {
  return (
    <aside
      aria-label={t.summary}
      aria-busy={busy}
      className="cart-summary rounded-lg border border-line bg-surface p-6 lg:sticky lg:top-24"
    >
      <h2
        id="cart-summary"
        className="flex items-center gap-3 text-xl font-semibold text-fg"
      >
        <Icon name="bag" className="h-7 w-7 text-fg-link" />
        {t.orderSummary}
      </h2>
      <p className="mt-2 text-sm text-fg-muted">
        {cart.itemCount} {cart.itemCount === 1 ? t.product : t.products}
      </p>
      <dl className="mt-6 border-y border-line py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <dt className="font-medium text-fg-secondary">{t.subtotal}</dt>
          <dd className="break-all text-lg font-semibold tracking-tight text-fg">
            {formatCurrency(cart.subtotal)}
          </dd>
        </div>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
          <dt className="text-fg-muted">{t.delivery}</dt>
          <dd className="text-fg-secondary">{t.deliveryHint}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-semibold text-fg">{t.total}</span>
        <span className="price text-2xl font-bold text-fg">
          {formatCurrency(cart.subtotal)}
        </span>
      </div>
      {cart.items.some((item) => !item.isAvailable) && (
        <p className="mt-4 text-sm text-danger">
          Remove unavailable items to continue.
        </p>
      )}
      <div className="cart-checkout-bar">
        <div className="cart-mobile-total">
          <span className="text-xs text-fg-muted">Total</span>
          <span className="price text-sm font-semibold">
            {formatCurrency(cart.subtotal)}
          </span>
        </div>
        {busy || cart.items.some((item) => !item.isAvailable) ? (
          <button
            type="button"
            disabled
            className="auth-primary mt-5 w-full cart-checkout-action"
          >
            {translations.checkout.proceed}
            <Icon name="arrow" />
          </button>
        ) : (
          <Link
            to={ROUTES.checkout}
            className="auth-primary mt-5 w-full cart-checkout-action"
          >
            {translations.checkout.proceed}
            <Icon name="arrow" />
          </Link>
        )}
      </div>
      <div className="mt-6">
        <CartBenefits compact />
      </div>
      <p className="mt-3 text-xs leading-5 text-fg-muted">{t.stockNotice}</p>
    </aside>
  );
}

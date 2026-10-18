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
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6"
    >
      <h2
        id="cart-summary"
        className="flex items-center gap-3 text-xl font-semibold text-slate-900"
      >
        <Icon name="bag" className="h-7 w-7 text-blue-600" />
        {t.orderSummary}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        {cart.itemCount} {cart.itemCount === 1 ? t.product : t.products}
      </p>
      <dl className="mt-6 border-y border-slate-200 py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <dt className="font-medium text-slate-700">{t.subtotal}</dt>
          <dd className="break-all text-lg font-semibold tracking-tight text-slate-900">
            {formatCurrency(cart.subtotal)}
          </dd>
        </div>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
          <dt className="text-slate-500">{t.delivery}</dt>
          <dd className="text-slate-600">{t.deliveryHint}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-semibold text-slate-900">{t.total}</span>
        <span className="text-2xl font-bold text-blue-600">
          {formatCurrency(cart.subtotal)}
        </span>
      </div>
      {busy ? (
        <button type="button" disabled className="auth-primary mt-5 w-full">
          {translations.checkout.proceed}
          <Icon name="arrow" />
        </button>
      ) : (
        <Link to={ROUTES.checkout} className="auth-primary mt-5 w-full">
          {translations.checkout.proceed}
          <Icon name="arrow" />
        </Link>
      )}
      <p className="mt-4 text-sm leading-6 text-slate-500">{t.priceNotice}</p>
      <div className="mt-6">
        <CartBenefits compact />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{t.stockNotice}</p>
    </aside>
  );
}

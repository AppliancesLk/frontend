import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
const t = translations.cart;
export function EmptyCart() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div
        aria-hidden="true"
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-8 w-8"
        >
          <path d="M3 3h2l2.5 12h10.7L21 6H6" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
      </div>
      <h2 className="mt-6 text-xl font-semibold text-slate-900">{t.empty}</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
        {t.emptyDescription}
      </p>
      <Link to={ROUTES.products} className="auth-primary mt-6">
        {translations.common.continueShopping}
      </Link>
    </section>
  );
}

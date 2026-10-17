import { Link } from 'react-router-dom';
import type { Product } from '../../../../types/product.types';
import { ROUTES } from '../../../../constants/routes';
import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
const t = translations.productDetails;
export function ProductSummary({ product }: { product: Product }) {
  const available = product.stockQty > 0;
  return (
    <section
      aria-labelledby="product-name"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:self-start"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          {product.category.name}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        >
          {available ? t.inStock : t.outOfStock}
        </span>
      </div>
      <h1
        id="product-name"
        className="mt-5 break-words text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"
      >
        {product.name}
      </h1>
      <p className="mt-3 break-all text-sm text-slate-500">
        {t.sku}: {product.SKU}
      </p>
      <p
        className="mt-7 break-words text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
        aria-label={`${t.price}: ${formatCurrency(product.price)}`}
      >
        {formatCurrency(product.price)}
      </p>
      <dl className="my-7 divide-y divide-slate-100 border-y border-slate-200 text-sm">
        <div className="flex flex-wrap justify-between gap-3 py-4">
          <dt className="text-slate-500">{t.category}</dt>
          <dd className="font-medium text-slate-900">
            {product.category.name}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-3 py-4">
          <dt className="text-slate-500">{t.availableUnits}</dt>
          <dd className="font-medium text-slate-900">
            {product.stockQty.toLocaleString()}
          </dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        <a href="#specifications" className="auth-primary">
          {t.viewSpecifications}
        </a>
        <Link to={ROUTES.products} className="auth-secondary">
          {translations.common.continueShopping}
        </Link>
      </div>
    </section>
  );
}

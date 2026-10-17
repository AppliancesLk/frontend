import { generatePath, Link } from 'react-router-dom';
import type { Product } from '../../../../types/product.types';
import { ROUTES } from '../../../../constants/routes';
import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
import { useRelatedProducts } from '../hooks/useRelatedProducts';
import { ProductImage } from './ProductImage';
const t = translations.productDetails;
export function RelatedProducts({ product }: { product: Product }) {
  const related = useRelatedProducts(product);
  return (
    <section aria-labelledby="related-title">
      <div className="mb-5">
        <h2 id="related-title" className="text-xl font-semibold text-slate-900">
          {t.related}
        </h2>
        <p className="mt-2 text-sm text-slate-500">{t.relatedDescription}</p>
      </div>
      {related.loading ? (
        <p
          role="status"
          className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500"
        >
          {t.relatedLoading}
        </p>
      ) : related.error ? (
        <div
          role="alert"
          className="rounded-xl border border-slate-200 bg-white p-6"
        >
          <p className="mb-3 text-sm text-slate-600">{t.relatedError}</p>
          <button className="auth-secondary" onClick={related.retry}>
            {translations.common.retry}
          </button>
        </div>
      ) : !related.products.length ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          {t.relatedEmpty}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {related.products.map((item) => (
            <Link
              key={item.productID}
              to={generatePath(ROUTES.productDetail, { id: item.productID })}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <ProductImage
                src={item.images[0]}
                alt={item.name}
                className="aspect-square w-full bg-white p-5"
              />
              <div className="border-t border-slate-100 p-5">
                <p className="text-xs text-slate-500">{item.category.name}</p>
                <h3 className="mt-2 break-words font-semibold text-slate-900 group-hover:text-blue-700">
                  {item.name}
                </h3>
                <p className="mt-3 font-semibold text-slate-900">
                  {formatCurrency(item.price)}
                </p>
                <p
                  className={`mt-3 text-xs font-medium ${item.stockQty > 0 ? 'text-green-700' : 'text-red-700'}`}
                >
                  {item.stockQty > 0 ? t.inStock : t.outOfStock}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-blue-600">
                  {t.viewProduct} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

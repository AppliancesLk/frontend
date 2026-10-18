import { generatePath, Link } from 'react-router-dom';
import type { Product } from '../../../../types/product.types';
import { ROUTES } from '../../../../constants/routes';
import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
import { useRelatedProducts } from '../hooks/useRelatedProducts';
import { ProductImage } from '../../../../components/common/ProductImage';
import { AddToCart } from '../../../../components/common/AddToCart';
import { Rating } from '../../../../components/common/Rating';
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
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {related.products.map((item) => (
            <article
              key={item.productID}
              className="flex min-w-0 gap-3 rounded-xl border border-slate-200 bg-white p-3"
            >
              <Link
                key={item.productID}
                to={generatePath(ROUTES.productDetail, { id: item.productID })}
                className="block w-24 shrink-0 self-start"
              >
                <ProductImage
                  src={item.images[0]}
                  alt={item.name}
                  className="aspect-square w-full rounded-lg bg-slate-50 p-2"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500">{item.category.name}</p>
                <h3 className="mt-1 line-clamp-2 break-words text-sm font-semibold text-slate-900 hover:text-blue-700">
                  <Link
                    to={generatePath(ROUTES.productDetail, {
                      id: item.productID,
                    })}
                  >
                    {item.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm font-semibold text-blue-700">
                  {formatCurrency(item.price)}
                </p>
                <p
                  className={`mt-3 text-xs font-medium ${item.stockQty > 0 ? 'text-green-700' : 'text-red-700'}`}
                >
                  {item.stockQty > 0 ? t.inStock : t.outOfStock}
                </p>
                {(item.ratingCount ?? 0) > 0 && (
                  <Rating
                    average={item.ratingAverage ?? 0}
                    count={item.ratingCount ?? 0}
                  />
                )}
                <div className="mt-2">
                  <AddToCart
                    compact
                    productId={item.productID}
                    productName={item.name}
                    available={item.stockQty > 0 && item.isActive}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

import { useCartRecommendations } from '../hooks/useCartRecommendations';
import { generatePath, Link } from 'react-router-dom';
import type { Cart } from '../../../../types/cart.types';
import { ProductImage } from '../../../../components/common/ProductImage';
import { Icon } from '../../../../components/common/Icon';
import { Rating } from '../../../../components/common/Rating';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
import { formatCurrency } from '../../../../utils/currency';
const t = translations.cart;
export function CartRecommendations({
  cart,
  busy,
  onAdd,
}: {
  cart: Cart;
  busy: boolean;
  onAdd: (productId: string) => void;
}) {
  const { products, error, retry } = useCartRecommendations();
  const suggestions = products
    ?.filter(
      (product) =>
        product.isActive &&
        product.stockQty > 0 &&
        !cart.items.some((item) => item.productId === product.productID),
    )
    .slice(0, 4);
  return (
    <section aria-labelledby="cart-suggestions">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            id="cart-suggestions"
            className="text-xl font-semibold text-slate-900"
          >
            {t.recommendations}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t.recommendationsDescription}
          </p>
        </div>
        <Link
          to={ROUTES.products}
          className="flex items-center gap-2 text-sm font-medium text-blue-600"
        >
          {t.viewAll}
          <Icon name="arrow" />
        </Link>
      </div>
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600"
        >
          {t.recommendationsError}{' '}
          <button
            className="font-medium text-blue-600 underline"
            onClick={retry}
          >
            {translations.common.retry}
          </button>
        </div>
      ) : !products ? (
        <p role="status" className="text-sm text-slate-500">
          {t.recommendationsLoading}
        </p>
      ) : !suggestions?.length ? (
        <p className="text-sm text-slate-500">{t.recommendationsEmpty}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {suggestions.map((product) => (
            <article
              key={product.productID}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
            >
              <Link
                to={generatePath(ROUTES.productDetail, {
                  id: product.productID,
                })}
                className="w-20 shrink-0"
              >
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  className="aspect-square w-full"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium text-slate-900">
                  <Link
                    to={generatePath(ROUTES.productDetail, {
                      id: product.productID,
                    })}
                    className="hover:text-blue-600"
                  >
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm font-semibold text-blue-600">
                  {formatCurrency(product.price)}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  {(product.ratingCount ?? 0) > 0 && (
                    <Rating
                      average={product.ratingAverage ?? 0}
                      count={product.ratingCount ?? 0}
                    />
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onAdd(product.productID)}
                    aria-label={`${t.add}: ${product.name}`}
                    className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Icon name="cart" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

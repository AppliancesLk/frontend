import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Link, generatePath } from 'react-router-dom';
import type { Product } from '../../../types/product.types';
import { ProductImage } from '../../../components/common/ProductImage';
import { AddToCart } from '../../../components/common/AddToCart';
import { ROUTES } from '../../../constants/routes';
import { formatCurrency } from '../../../utils/currency';
import { translations } from '../../../utils/translations';
import { Rating } from '../../../components/common/Rating';
const t = translations.catalog;
export function CatalogProductCard({ product }: { product: Product }) {
  const available = product.isActive && product.stockQty > 0;
  return (
    <article className="group flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-4">
      <Link
        to={generatePath(ROUTES.productDetail, { id: product.productID })}
        className="relative mb-3 block rounded-lg bg-slate-50 p-3"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          className="aspect-square w-full"
        />
        {product.badge && (
          <span
            className={`absolute left-0 top-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${product.badge === 'DEAL' ? 'bg-blue-100 text-slate-900' : product.badge === 'NEW' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
          >
            {t.badges[product.badge]}
          </span>
        )}
      </Link>
      {product.brand && (
        <p className="mb-1 truncate text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {product.brand}
        </p>
      )}
      <h2 className="line-clamp-2 min-min-h-11 break-words text-sm font-semibold leading-5 text-slate-900">
        <Link
          to={generatePath(ROUTES.productDetail, { id: product.productID })}
          className="hover:text-blue-700"
        >
          {product.name}
        </Link>
      </h2>
      <p className="mt-1 truncate text-xs text-slate-500">
        {product.subtitle || product.category.name}
      </p>
      <div className="mt-auto pt-3">
        {(product.ratingCount ?? 0) > 0 && (
          <div className="mb-2">
            <Rating
              average={product.ratingAverage ?? 0}
              count={product.ratingCount ?? 0}
            />
          </div>
        )}
        <p className="break-words text-base font-bold tracking-tight text-blue-700">
          {formatCurrency(product.price)}
        </p>
        {product.compareAtPrice != null &&
          Number(product.compareAtPrice) > Number(product.price) && (
            <p className="mt-1 text-xs text-slate-400">
              <s>{formatCurrency(product.compareAtPrice)}</s>
            </p>
          )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <StatusBadge status={available ? 'IN_STOCK' : 'OUT_OF_STOCK'}>
            {available
              ? translations.productDetails.inStock
              : translations.productDetails.outOfStock}
          </StatusBadge>
          <AddToCart
            compact
            productId={product.productID}
            productName={product.name}
            available={available}
          />
        </div>
      </div>
    </article>
  );
}

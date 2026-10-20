import { formatCategoryName } from '../../../utils/category';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Link, generatePath } from 'react-router-dom';
import type { Product } from '../../../types/product.types';
import { ProductImage } from '../../../components/common/ProductImage';
import { AddToCart } from '../../../components/common/AddToCart';
import { ROUTES } from '../../../constants/routes';
import { Price } from '../../../components/common/Price';
import { formatCurrency } from '../../../utils/currency';
import { translations } from '../../../utils/translations';
import { Rating } from '../../../components/common/Rating';
const t = translations.catalog;
export function CatalogProductCard({ product }: { product: Product }) {
  const available = product.isActive && product.stockQty > 0;
  return (
    <article className="product-card group flex min-w-0 flex-col rounded-md border border-line-subtle bg-surface p-3 transition-colors hover:border-line">
      <Link
        to={generatePath(ROUTES.productDetail, { id: product.productID })}
        className="product-card-well relative mb-3 block overflow-hidden rounded-md bg-well p-3"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          className={`aspect-square w-full transition-transform duration-200 group-hover:scale-[1.03] ${available ? '' : 'grayscale-[.4]'}`}
        />
        {product.badge && (
          <span className="absolute left-0 top-0 rounded px-2 py-1 text-xs font-medium bg-accent text-accent-on">
            {t.badges[product.badge]}
          </span>
        )}
      </Link>
      {product.brand && (
        <p className="mb-1 truncate text-xs text-fg-muted">{product.brand}</p>
      )}
      <h2 className="line-clamp-2 min-h-12 break-words text-base font-medium leading-6 text-fg">
        <Link
          to={generatePath(ROUTES.productDetail, { id: product.productID })}
          className="hover:text-fg-link"
        >
          {product.name}
        </Link>
      </h2>
      <p className="mt-1 truncate text-xs text-fg-muted">
        {product.subtitle || formatCategoryName(product.category.name)}
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
        <p className="text-base font-semibold tabular-nums text-fg sm:text-lg">
          <Price value={product.price} />
        </p>
        {product.compareAtPrice != null &&
          Number(product.compareAtPrice) > Number(product.price) && (
            <p className="mt-1 text-xs text-fg-muted">
              <s>{formatCurrency(product.compareAtPrice)}</s>
            </p>
          )}
        <div className="mt-3 flex flex-col items-start gap-1">
          <StatusBadge
            status={
              available
                ? product.stockQty <= 5
                  ? 'LOW_STOCK'
                  : 'IN_STOCK'
                : 'OUT_OF_STOCK'
            }
          >
            {available
              ? product.stockQty <= 5
                ? `Only ${product.stockQty} left`
                : translations.productDetails.inStock
              : translations.productDetails.outOfStock}
          </StatusBadge>
          {available && (
            <AddToCart
              compact
              card
              productId={product.productID}
              productName={product.name}
              available={available}
            />
          )}
        </div>
      </div>
    </article>
  );
}

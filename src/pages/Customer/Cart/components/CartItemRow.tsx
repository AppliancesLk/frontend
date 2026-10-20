import { Icon } from '../../../../components/common/Icon';
import { Link } from 'react-router-dom';
import type { CartItem } from '../../../../types/cart.types';
import { ProductImage } from '../../../../components/common/ProductImage';
import { ROUTES } from '../../../../constants/routes';
import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
import { nextQuantity } from '../helpers/cart.helpers';
const t = translations.cart;
export function CartItemRow({
  item,
  disabled,
  updating,
  removing,
  onQuantity,
  onRemove,
}: {
  item: CartItem;
  disabled: boolean;
  updating: boolean;
  removing: boolean;
  onQuantity: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const detailUrl = ROUTES.productDetail.replace(
    ':id',
    encodeURIComponent(item.productId),
  );
  return (
    <li className="cart-line" aria-busy={updating || removing}>
      <Link to={detailUrl} className="cart-line-image">
        <ProductImage
          src={item.images[0]}
          alt={item.name}
          className="h-full w-full"
        />
      </Link>
      <div className="cart-line-content">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-sans text-sm font-semibold text-fg">
              <Link to={detailUrl} className="hover:text-fg-link">
                {item.name}
              </Link>
            </h2>
            <p className="mt-1 text-xs text-fg-muted">SKU: {item.SKU}</p>
          </div>
          <p className="price shrink-0 text-sm font-semibold text-fg sm:text-base">
            {updating ? (
              <span role="status">{t.updating}</span>
            ) : (
              formatCurrency(item.lineTotal)
            )}
          </p>
        </div>
        <p
          className={`mt-2 flex items-center gap-1.5 text-xs ${item.isAvailable ? 'text-success' : 'text-danger'}`}
        >
          <Icon
            name={item.isAvailable ? 'check' : 'info'}
            className="h-3.5 w-3.5"
          />
          {item.isAvailable
            ? translations.productDetails.inStock
            : translations.productDetails.outOfStock}
        </p>
        {item.quantity > 1 && (
          <p className="mt-2 text-xs text-fg-muted">
            {formatCurrency(item.unitPrice)} each
          </p>
        )}
        {!item.isAvailable && (
          <p className="mt-3 rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">
            {item.quantity > item.stockQty && item.stockQty > 0
              ? `${t.stockChanged} ${item.stockQty.toLocaleString()}. ${t.reduceQuantity}`
              : t.unavailable}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div
            role="group"
            aria-label={`${t.quantity}: ${item.name}`}
            className="inline-flex h-11 items-center overflow-hidden rounded-sm border border-line bg-surface"
          >
            <button
              type="button"
              aria-label={`${t.decrease} ${item.name}`}
              disabled={disabled || nextQuantity(item, -1) === null}
              onClick={() => onQuantity(-1)}
              className="h-full w-10 text-lg text-fg-secondary hover:bg-subtle disabled:text-fg-disabled"
            >
              −
            </button>
            <span
              aria-label={`${t.quantity}: ${item.quantity}`}
              className="min-w-10 px-2 text-center text-sm font-semibold tabular-nums"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label={`${t.increase} ${item.name}`}
              disabled={disabled || nextQuantity(item, 1) === null}
              onClick={() => onQuantity(1)}
              className="h-full w-10 text-lg text-fg-secondary hover:bg-subtle disabled:text-fg-disabled"
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={onRemove}
            aria-label={`${t.remove} ${item.name}`}
            className="flex min-h-11 items-center gap-2 rounded-sm px-2 text-sm text-danger hover:bg-danger-bg"
          >
            <Icon name="trash" className="h-4 w-4" />
            {removing ? t.removing : 'Remove'}
          </button>
        </div>
      </div>
    </li>
  );
}

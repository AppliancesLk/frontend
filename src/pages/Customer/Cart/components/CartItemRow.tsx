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
    <li
      className="grid items-center gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_8rem_9rem_8rem_2.5rem] lg:gap-3 lg:px-5 lg:py-5"
      aria-busy={updating || removing}
    >
      <div className="flex min-w-0 items-center gap-4">
        <Link
          to={detailUrl}
          className="h-24 w-24 shrink-0 overflow-hidden rounded-lg"
        >
          <ProductImage
            src={item.images[0]}
            alt={item.name}
            className="h-full w-full"
          />
        </Link>
        <div className="min-w-0">
          <h2 className="break-words text-sm font-semibold text-slate-900">
            <Link to={detailUrl} className="hover:text-blue-700">
              {item.name}
            </Link>
          </h2>
          <p className="mt-1 break-all text-xs text-slate-500">
            {translations.productDetails.sku}: {item.SKU}
          </p>
          <span
            className={`mt-3 inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.isAvailable ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-800'}`}
          >
            {item.isAvailable
              ? translations.productDetails.inStock
              : translations.productDetails.outOfStock}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-800">
        <span className="mr-2 text-slate-500 lg:hidden">{t.unitPrice}:</span>
        <span>{formatCurrency(item.unitPrice)}</span>
      </p>
      <div>
        {!item.isAvailable && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {item.quantity > item.stockQty && item.stockQty > 0
              ? `${t.stockChanged} ${item.stockQty.toLocaleString()}. ${t.reduceQuantity}`
              : t.unavailable}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span id={`quantity-${item.id}`} className="sr-only">
              {t.quantity}
            </span>
            <div
              role="group"
              aria-labelledby={`quantity-${item.id}`}
              className="inline-flex h-11 items-center rounded-lg border border-slate-300 bg-white"
            >
              <button
                type="button"
                aria-label={`${t.decrease} ${item.name}`}
                disabled={disabled || nextQuantity(item, -1) === null}
                onClick={() => onQuantity(-1)}
                className="h-full w-11 rounded-l-lg text-lg text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                &#8722;
              </button>
              <span
                aria-label={`${t.quantity}: ${item.quantity}`}
                className="min-w-10 px-2 text-center text-sm font-semibold tabular-nums text-slate-900"
              >
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label={`${t.increase} ${item.name}`}
                disabled={disabled || nextQuantity(item, 1) === null}
                onClick={() => onQuantity(1)}
                className="h-full w-11 rounded-r-lg text-lg text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                +
              </button>
            </div>
            {updating && (
              <span role="status" className="text-xs text-blue-700">
                {t.updating}
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="text-base font-semibold text-slate-900">
        <span className="mr-2 text-xs font-normal text-slate-500 lg:hidden">
          {t.lineTotal}:
        </span>
        <span>{formatCurrency(item.lineTotal)}</span>
      </p>
      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        aria-label={`${t.remove} ${item.name}`}
        className="flex min-h-11 items-center justify-center justify-self-end rounded-lg px-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-50"
      >
        {removing ? (
          <span className="text-xs">{t.removing}</span>
        ) : (
          <Icon name="trash" />
        )}
      </button>
    </li>
  );
}

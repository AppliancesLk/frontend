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
    <li className="p-4 sm:p-6" aria-busy={updating || removing}>
      <div className="flex items-start gap-4 sm:gap-6">
        <Link
          to={detailUrl}
          className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 sm:h-28 sm:w-28"
        >
          <ProductImage
            src={item.images[0]}
            alt={item.name}
            className="h-full w-full"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h2 className="break-words text-base font-semibold text-slate-900">
                <Link to={detailUrl} className="hover:text-blue-700">
                  {item.name}
                </Link>
              </h2>
              <p className="mt-1 break-all text-xs text-slate-500">
                {translations.productDetails.sku}: {item.SKU}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {t.unitPrice}:{' '}
                <span className="font-medium text-slate-900">
                  {formatCurrency(item.unitPrice)}
                </span>
              </p>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-xs text-slate-500">{t.lineTotal}</p>
              <p className="mt-1 break-all text-lg font-semibold text-slate-900">
                {formatCurrency(item.lineTotal)}
              </p>
            </div>
          </div>
          {!item.isAvailable && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {item.quantity > item.stockQty && item.stockQty > 0
                ? `${t.stockChanged} ${item.stockQty.toLocaleString()}. ${t.reduceQuantity}`
                : t.unavailable}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span
                id={`quantity-${item.id}`}
                className="text-xs font-medium text-slate-500"
              >
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
            <button
              type="button"
              disabled={disabled}
              onClick={onRemove}
              aria-label={`${t.remove} ${item.name}`}
              className="min-h-11 rounded-lg px-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
            >
              {removing ? t.removing : t.remove}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

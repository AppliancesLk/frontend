import type { Product } from '../../../../types/product.types';
import { Rating } from '../../../../components/common/Rating';
import { Icon } from '../../../../components/common/Icon';
import { translations } from '../../../../utils/translations';
import {
  formatSpecificationValue,
  getSpecificationEntries,
  formatSpecificationLabel,
} from '../helpers/product-details.helpers';
const t = translations.experience;
export function ProductInformation({
  product,
  showReviews,
}: {
  product: Product;
  showReviews: () => void;
}) {
  return (
    <section className="min-w-0 py-2">
      <p className="mb-3 text-sm font-medium text-slate-500">
        {product.brand || product.category.name}
      </p>
      <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900 xl:text-4xl">
        {product.name}
      </h1>
      {product.subtitle && (
        <p className="mt-2 text-xl font-semibold text-slate-800">
          {product.subtitle}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Rating
          average={product.ratingAverage ?? 0}
          count={product.ratingCount ?? 0}
        />
        <button
          onClick={showReviews}
          className="rounded-lg px-2 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          {t.writeReview}
        </button>
      </div>
      <p className="mt-5 line-clamp-3 whitespace-pre-line text-sm leading-7 text-slate-600">
        {product.description || t.noDescription}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {getSpecificationEntries(product.specifications)
          .slice(0, 4)
          .map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-xl bg-blue-50 p-3">
              <span className="mb-3 block text-blue-600">
                <Icon name="check" />
              </span>
              <p className="line-clamp-3 break-words text-sm font-semibold text-slate-900">
                {formatSpecificationValue(value)}
              </p>
              <p className="mt-1 break-words text-xs text-slate-500">
                {formatSpecificationLabel(label)}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}

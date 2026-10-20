import { formatCategoryName } from '../../../../utils/category';
import type { Product } from '../../../../types/product.types';
import { Rating } from '../../../../components/common/Rating';
import { RatingPlate } from '../../../../components/common/RatingPlate';
import { CopyReference } from '../../../../components/common/CopyReference';
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
      <p className="mb-3 text-sm font-medium text-fg-link">
        {product.brand || formatCategoryName(product.category.name)}
      </p>
      <h1 className="ui-page-title break-words    text-fg">{product.name}</h1>
      {product.subtitle && (
        <p className="mt-3 inline-flex rounded-sm border border-line bg-surface px-3 py-2 text-sm text-fg-secondary">
          {product.subtitle}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {(product.ratingCount ?? 0) > 0 && (
          <Rating
            average={product.ratingAverage ?? 0}
            count={product.ratingCount ?? 0}
          />
        )}
        <button
          onClick={showReviews}
          className="rounded-sm px-2 py-2 text-sm font-medium text-fg-link hover:bg-primary-subtle"
        >
          {(product.ratingCount ?? 0) > 0 ? 'Read reviews' : 'No reviews yet'}
        </button>
      </div>
      <p className="mt-5 line-clamp-3 whitespace-pre-line text-sm leading-7 text-fg-secondary">
        {product.description || t.noDescription}
      </p>
      <p className="mt-4 flex flex-wrap items-center gap-1 text-xs text-fg-muted">
        SKU <span className="tnum">{product.SKU}</span>
        <CopyReference value={product.SKU} />
      </p>
      {getSpecificationEntries(product.specifications).length > 0 && (
        <div className="mt-6">
          <RatingPlate
            title={product.brand || 'Product specifications'}
            reference={product.SKU}
            rows={getSpecificationEntries(product.specifications)
              .slice(0, 5)
              .map(([label, value]) => ({
                label: formatSpecificationLabel(label),
                value: formatSpecificationValue(value),
              }))}
          />
        </div>
      )}
    </section>
  );
}

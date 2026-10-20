import { LoadingState } from '../../../../components/ui/Feedback';
import type { Product } from '../../../../types/product.types';
import { translations } from '../../../../utils/translations';
import { useRelatedProducts } from '../hooks/useRelatedProducts';
import { CatalogProductCard } from '../../../Products/components/CatalogProductCard';
const t = translations.productDetails;
export function RelatedProducts({ product }: { product: Product }) {
  const related = useRelatedProducts(product);
  return (
    <section aria-labelledby="related-title">
      <div className="mb-5">
        <h2 id="related-title" className="text-xl font-semibold text-fg">
          {t.related}
        </h2>
        <p className="mt-2 text-sm text-fg-muted">{t.relatedDescription}</p>
      </div>
      {related.loading ? (
        <LoadingState label={t.relatedLoading} compact={true} />
      ) : related.error ? (
        <div
          role="alert"
          className="rounded-md border border-line bg-surface p-6"
        >
          <p className="mb-3 text-sm text-fg-secondary">{t.relatedError}</p>
          <button className="auth-secondary" onClick={related.retry}>
            {translations.common.retry}
          </button>
        </div>
      ) : !related.products.length ? (
        <p className="rounded-md border border-line bg-surface p-6 text-sm text-fg-muted">
          {t.relatedEmpty}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-6 xl:grid-cols-4">
          {related.products.map((item) => (
            <CatalogProductCard key={item.productID} product={item} />
          ))}
        </div>
      )}
    </section>
  );
}

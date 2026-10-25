import type { Product } from '../../../../types/product.types';
import type { ReviewSummary } from '../../../../types/review.types';
import { translations } from '../../../../utils/translations';
import { ProductSpecifications } from './ProductSpecifications';
import {
  formatSpecificationValue,
  getSpecificationEntries,
  formatSpecificationLabel,
} from '../helpers/product-details.helpers';
import { ProductReviews } from '../../../../components/reviews/ProductReviews';
const t = translations.experience;
const tabs = ['overview', 'specifications', 'boxContents', 'reviews'] as const;
export type ProductTab = (typeof tabs)[number];
export function ProductContent({
  product,
  active,
  setActive,
  onSummary,
}: {
  product: Product;
  active: ProductTab;
  setActive: (tab: ProductTab) => void;
  onSummary: (summary: ReviewSummary) => void;
}) {
  return (
    <section
      id="product-content"
      className="scroll-mt-36 rounded-md border border-line bg-surface p-4 sm:p-6"
    >
      <div
        role="tablist"
        aria-label={translations.productDetails.details}
        className="mb-6 flex gap-2 overflow-x-auto border-b border-line"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            role="tab"
            aria-selected={active === tab}
            aria-controls={`panel-${tab}`}
            tabIndex={active === tab ? 0 : -1}
            onClick={() => setActive(tab)}
            onKeyDown={(event) => {
              if (
                ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
              ) {
                event.preventDefault();
                const next =
                  event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? tabs.length - 1
                      : (index +
                          (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) %
                        tabs.length;
                setActive(tabs[next]);
                document.getElementById(`tab-${tabs[next]}`)?.focus();
              }
            }}
            className={`shrink-0 border-b-2 px-3 py-3 text-sm font-medium ${active === tab ? 'border-primary text-fg-link' : 'border-transparent text-fg-muted hover:text-fg'}`}
          >
            {t[tab]}
            {tab === 'reviews' ? ` (${product.ratingCount ?? 0})` : ''}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab}
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          hidden={active !== tab}
          tabIndex={0}
        >
          {tab === 'overview' && (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1.1fr]">
              <div>
                <h2 className="mb-3 font-semibold text-fg">{t.description}</h2>
                <p className="whitespace-pre-line text-sm leading-7 text-fg-secondary">
                  {product.description || t.noDescription}
                </p>
              </div>
              <div>
                <h2 className="mb-3 font-semibold text-fg">{t.features}</h2>
                {product.features?.length ? (
                  <ul className="space-y-2 text-sm leading-6 text-fg-secondary">
                    {product.features.map((feature, index) => (
                      <li className="flex gap-2" key={index}>
                        <span
                          aria-hidden="true"
                          className="font-bold text-fg-link"
                        >
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-fg-muted">{t.noFeatures}</p>
                )}
              </div>
              <div className="rounded-md bg-primary-subtle p-4">
                <div className="mb-3 flex flex-wrap justify-between gap-2">
                  <h2 className="text-sm font-semibold text-fg">
                    {t.keySpecifications}
                  </h2>
                  <button
                    onClick={() => setActive('specifications')}
                    className="text-xs font-medium text-fg-link"
                  >
                    {t.fullSpecifications} →
                  </button>
                </div>
                <dl className="divide-y divide-line-subtle">
                  {getSpecificationEntries(product.specifications)
                    .slice(0, 8)
                    .map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-2 gap-3 py-2 text-xs"
                      >
                        <dt className="break-words text-fg-muted">
                          {formatSpecificationLabel(label)}
                        </dt>
                        <dd className="break-words text-fg-secondary">
                          {formatSpecificationValue(value)}
                        </dd>
                      </div>
                    ))}
                </dl>
              </div>
            </div>
          )}
          {tab === 'specifications' && (
            <ProductSpecifications specifications={product.specifications} />
          )}
          {tab === 'boxContents' && (
            <>
              <h2 className="mb-4 text-lg font-semibold text-fg">
                {t.boxContents}
              </h2>
              {product.boxContents?.length ? (
                <ul className="list-inside list-disc space-y-3 text-sm text-fg-secondary">
                  {product.boxContents.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-fg-muted">{t.noBox}</p>
              )}
            </>
          )}
          {tab === 'reviews' && (
            <ProductReviews
              productId={product.productID}
              onSummary={onSummary}
            />
          )}
        </div>
      ))}
    </section>
  );
}

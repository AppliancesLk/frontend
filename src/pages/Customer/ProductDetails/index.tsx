import { formatCategoryName } from '../../../utils/category';
import { useEffect, useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { translations } from '../../../utils/translations';
import { useProductDetails } from './hooks/useProductDetails';
import { ProductGallery } from './components/ProductGallery';
import { ProductInformation } from './components/ProductInformation';
import { PurchasePanel } from './components/PurchasePanel';
import { ProductContent } from './components/ProductContent';
import type { ProductTab } from './components/ProductContent';
import type { ReviewSummary } from '../../../types/review.types';
import { RelatedProducts } from './components/RelatedProducts';
import { ProductDetailsState } from './components/ProductDetailsState';
import { ProductAiAssistant } from './components/ProductAiAssistant/ProductAiAssistant';
export default function ProductDetailsPage() {
  const { id } = useParams();
  const page = useProductDetails(id);
  const [contentTab, setContentTab] = useState<{
    id: string;
    tab: ProductTab;
  } | null>(null);
  const activeTab =
    contentTab?.id === id ? (contentTab?.tab ?? 'overview') : 'overview';
  const changeTab = (tab: ProductTab) => {
    if (id) setContentTab({ id, tab });
  };
  const [reviewSummary, setReviewSummary] = useState<{
    id: string;
    summary: ReviewSummary;
  } | null>(null);
  const updateSummary = useCallback(
    (summary: ReviewSummary) => {
      if (id) setReviewSummary({ id, summary });
    },
    [id],
  );
  const product = page.product
    ? {
        ...page.product,
        ...(reviewSummary && reviewSummary.id === id
          ? {
              ratingAverage: reviewSummary.summary.average,
              ratingCount: reviewSummary.summary.count,
            }
          : {}),
      }
    : null;
  useEffect(() => {
    const previous = document.title;
    document.title = `${page.product?.name ?? translations.productDetails.details} | ${translations.common.storeName}`;
    return () => {
      document.title = previous;
    };
  }, [page.product?.name]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);
  return (
    <main className="product-detail-page bg-page px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <nav
          aria-label={translations.productDetails.breadcrumb}
          className="text-sm"
        >
          <ol className="flex flex-wrap items-center gap-2 text-fg-muted">
            <li>
              <Link
                to={ROUTES.home}
                className="font-medium text-fg-link hover:text-fg-link"
              >
                {translations.storefront.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {product && (
              <>
                <li>
                  <Link
                    to={`${ROUTES.products}?category=${product.category.categoryID}`}
                    className="hover:text-fg-link"
                  >
                    {formatCategoryName(product.category.name)}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
              </>
            )}
            <li aria-current="page" className="min-w-0 break-words">
              {page.product?.name ?? translations.productDetails.details}
            </li>
          </ol>
        </nav>
        {page.status === 'ready' && product ? (
          <>
            <div className="product-detail-grid grid items-start gap-6 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_.9fr]">
              <ProductGallery
                key={`gallery-${product.productID}`}
                images={product.images}
                name={product.name}
              />
              <ProductInformation
                product={product}
                showReviews={() => {
                  changeTab('reviews');
                  requestAnimationFrame(() => {
                    document.getElementById('tab-reviews')?.focus();
                    document
                      .getElementById('product-content')
                      ?.scrollIntoView({ block: 'start' });
                  });
                }}
              />
              <PurchasePanel
                key={`purchase-${product.productID}`}
                product={product}
              />
            </div>
            <ProductContent
              key={product.productID}
              product={product}
              active={activeTab}
              setActive={changeTab}
              onSummary={updateSummary}
            />
            <RelatedProducts product={product} />
            <ProductAiAssistant
              productId={product.productID}
              productName={product.name}
            />
          </>
        ) : (
          <ProductDetailsState
            status={page.status === 'ready' ? 'error' : page.status}
            retry={page.retry}
          />
        )}
      </div>
    </main>
  );
}

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
    <main className="bg-slate-50 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav
          aria-label={translations.productDetails.breadcrumb}
          className="text-sm"
        >
          <ol className="flex flex-wrap items-center gap-2 text-slate-500">
            <li>
              <Link
                to={ROUTES.home}
                className="font-medium text-blue-600 hover:text-blue-700"
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
                    className="hover:text-blue-700"
                  >
                    {product.category.name}
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
            <div className="grid items-start gap-6 lg:grid-cols-2 xl:grid-cols-[1.25fr_1fr_.85fr]">
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

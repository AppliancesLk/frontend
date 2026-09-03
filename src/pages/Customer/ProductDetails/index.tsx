import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { translations } from '../../../utils/translations';
import { useProductDetails } from './hooks/useProductDetails';
import { ProductGallery } from './components/ProductGallery';
import { ProductSummary } from './components/ProductSummary';
import { ProductSpecifications } from './components/ProductSpecifications';
import { RelatedProducts } from './components/RelatedProducts';
import { ProductDetailsState } from './components/ProductDetailsState';
export default function ProductDetailsPage() {
  const { id } = useParams();
  const page = useProductDetails(id);
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
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
        <nav
          aria-label={translations.productDetails.breadcrumb}
          className="text-sm"
        >
          <ol className="flex flex-wrap items-center gap-2 text-slate-500">
            <li>
              <Link
                to={ROUTES.products}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {translations.productDetails.products}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="min-w-0 break-words">
              {page.product?.name ?? translations.productDetails.details}
            </li>
          </ol>
        </nav>
        {page.status === 'ready' ? (
          <>
            <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
              <ProductGallery
                key={page.product.productID}
                images={page.product.images}
                name={page.product.name}
              />
              <ProductSummary product={page.product} />
            </div>
            <ProductSpecifications
              specifications={page.product.specifications}
            />
            <RelatedProducts product={page.product} />
          </>
        ) : (
          <ProductDetailsState status={page.status} retry={page.retry} />
        )}
      </div>
    </main>
  );
}

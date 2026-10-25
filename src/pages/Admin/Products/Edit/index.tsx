import { LoadingState } from '../../../../components/ui/Feedback';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
import { useProductEdit } from './hooks/useProductEdit';
import { ProductEditForm } from './components/ProductEditForm';
import { UnsavedChangesDialog } from './components/UnsavedChangesDialog';
import { ProductReviews } from '../../../../components/reviews/ProductReviews';
const t = translations.productEdit;
export default function ProductEditPage() {
  const { id } = useParams();
  const page = useProductEdit(id);
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <Link
          to={ROUTES.adminProducts}
          className="mb-4 inline-block text-sm font-medium text-fg-link hover:text-fg-link"
        >
          {translations.productDetails.backToProducts}
        </Link>
        <h1 className="ui-page-title text-fg">{t.title}</h1>
        <p className="mt-2 text-sm text-fg-muted">
          {page.editor?.product.name ?? t.description}
        </p>
      </header>
      {page.status === 'ready' && id && (
        <div className="rounded-md border border-line bg-surface p-5">
          <ProductReviews productId={id} />
        </div>
      )}
      {page.status === 'loading' && (
        <LoadingState label={t.loading} compact={false} />
      )}
      {page.status === 'not-found' && (
        <div className="rounded-md border border-line bg-surface p-8">
          <h2 className="text-xl font-semibold text-fg">{t.notFound}</h2>
          <p className="mt-3 text-sm text-fg-muted">{t.notFoundDescription}</p>
          <Link to={ROUTES.adminProducts} className="auth-secondary mt-5">
            {translations.productDetails.backToProducts}
          </Link>
        </div>
      )}
      {page.status === 'forbidden' && (
        <div
          role="alert"
          className="rounded-md border border-line bg-surface p-8"
        >
          <h2 className="text-xl font-semibold text-fg">
            {translations.auth.accessRestricted}
          </h2>
          <p className="mt-3 text-sm text-fg-muted">
            {translations.auth.accessDenied}
          </p>
          <Link to={ROUTES.products} className="auth-secondary mt-5">
            {translations.common.continueShopping}
          </Link>
        </div>
      )}
      {page.status === 'error' && (
        <div
          role="alert"
          className="rounded-md border border-danger/25 bg-danger-bg p-6"
        >
          <p className="text-sm text-danger">{t.loadError}</p>
          <button onClick={page.retry} className="auth-secondary mt-4">
            {translations.common.retry}
          </button>
        </div>
      )}
      {page.editor && <ProductEditForm page={page} />}
      <UnsavedChangesDialog page={page} />
    </section>
  );
}

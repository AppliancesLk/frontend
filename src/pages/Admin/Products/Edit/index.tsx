import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
import { useProductEdit } from './hooks/useProductEdit';
import { ProductEditForm } from './components/ProductEditForm';
import { UnsavedChangesDialog } from './components/UnsavedChangesDialog';
const t = translations.productEdit;
export default function ProductEditPage() {
  const { id } = useParams();
  const page = useProductEdit(id);
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header>
        <Link
          to={ROUTES.adminProducts}
          className="mb-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {translations.productDetails.backToProducts}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {page.editor?.product.name ?? t.description}
        </p>
      </header>
      {page.status === 'loading' && (
        <p
          role="status"
          className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500"
        >
          {t.loading}
        </p>
      )}
      {page.status === 'not-found' && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-slate-900">{t.notFound}</h2>
          <p className="mt-3 text-sm text-slate-500">{t.notFoundDescription}</p>
          <Link to={ROUTES.adminProducts} className="auth-secondary mt-5">
            {translations.productDetails.backToProducts}
          </Link>
        </div>
      )}
      {page.status === 'forbidden' && (
        <div
          role="alert"
          className="rounded-xl border border-slate-200 bg-white p-8"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            {translations.auth.accessRestricted}
          </h2>
          <p className="mt-3 text-sm text-slate-500">
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
          className="rounded-xl border border-red-200 bg-red-50 p-6"
        >
          <p className="text-sm text-red-700">{t.loadError}</p>
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

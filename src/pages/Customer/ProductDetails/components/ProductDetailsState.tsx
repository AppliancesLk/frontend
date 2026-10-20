import { LoadingState } from '../../../../components/ui/Feedback';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
const t = translations.productDetails;
export function ProductDetailsState({
  status,
  retry,
}: {
  status: 'loading' | 'error' | 'not-found';
  retry: () => void;
}) {
  if (status === 'loading') return <LoadingState />;
  const missing = status === 'not-found';
  return (
    <section
      role={missing ? undefined : 'alert'}
      className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"
    >
      <h1 className="ui-page-title text-slate-900">
        {missing ? t.notFound : t.loadError}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        {missing ? t.notFoundDescription : t.loadErrorDescription}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {!missing && (
          <button onClick={retry} className="auth-primary">
            {translations.common.retry}
          </button>
        )}
        <Link to={ROUTES.products} className="auth-secondary">
          {t.backToProducts}
        </Link>
      </div>
    </section>
  );
}

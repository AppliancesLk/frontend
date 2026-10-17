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
  if (status === 'loading')
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">{t.loading}</span>
        <div
          aria-hidden="true"
          className="grid animate-pulse gap-6 lg:grid-cols-2 motion-reduce:animate-none"
        >
          <div className="aspect-square rounded-xl border border-slate-200 bg-white" />
          <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-8">
            <div className="h-4 w-24 rounded bg-slate-100" />
            <div className="h-9 w-3/4 rounded bg-slate-100" />
            <div className="h-6 w-1/3 rounded bg-slate-100" />
            <div className="mt-8 h-12 w-1/2 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  const missing = status === 'not-found';
  return (
    <section
      role={missing ? undefined : 'alert'}
      className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"
    >
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
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

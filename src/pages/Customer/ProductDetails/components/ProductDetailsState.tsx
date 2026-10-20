import { Skeleton } from '../../../../components/ui/Feedback';
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
      <div
        role="status"
        aria-label="Loading product"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_.9fr]"
      >
        <span className="sr-only">Loading product…</span>
        <Skeleton className="aspect-square w-full" />
        <div>
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="mt-4 h-8 w-full" />
          <Skeleton className="mt-3 h-8 w-3/4" />
          <Skeleton className="mt-8 h-64 w-full" />
        </div>
        <div className="space-y-4 rounded-lg border border-line bg-surface p-6">
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-8 h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  const missing = status === 'not-found';
  return (
    <section
      role={missing ? undefined : 'alert'}
      className="mx-auto max-w-xl rounded-md border border-line bg-surface px-6 py-12 text-center "
    >
      <h1 className="ui-page-title text-fg">
        {missing ? t.notFound : t.loadError}
      </h1>
      <p className="mt-3 text-sm leading-6 text-fg-muted">
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

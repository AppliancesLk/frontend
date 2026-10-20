import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
const t = translations.orders;
export function OrdersShell({
  details = false,
  children,
  refresh,
  loading,
}: {
  details?: boolean;
  children: ReactNode;
  refresh: () => void;
  loading: boolean;
}) {
  const title = details ? t.detailsTitle : t.title;
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | ${translations.common.storeName}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
  return (
    <main className="px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-8">
        {details && (
          <Link
            to={ROUTES.orders}
            className="text-sm font-medium text-fg-link hover:text-fg-link"
          >
            &larr; {t.back}
          </Link>
        )}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="ui-page-title text-fg">{title}</h1>
            <p className="mt-2 text-sm text-fg-muted">
              {details ? t.snapshot : t.description}
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="auth-secondary "
          >
            {details ? t.refreshDetails : t.refresh}
          </button>
        </div>
        {children}
      </div>
    </main>
  );
}

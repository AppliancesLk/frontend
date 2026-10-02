import { useEffect } from 'react';
import { translations } from '../../../utils/translations';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { useAdminRepairsPage } from './hooks/useAdminRepairsPage';
import { RepairsTable } from './components/RepairsTable';

const t = translations.adminRepairs;

export default function AdminRepairsPage() {
  const page = useAdminRepairsPage();

  useEffect(() => {
    const previous = document.title;
    document.title = `${t.title} | ${translations.common.storeName}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {t.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{t.description}</p>
        </div>
        <button
          type="button"
          onClick={() => void page.refresh()}
          disabled={page.loading}
          className="auth-secondary"
        >
          {t.refresh}
        </button>
      </div>

      <CatalogFeedback
        loading={page.loading}
        error={page.error}
        retry={page.refresh}
      />

      {!page.loading && !page.error && (
        <>
          {page.repairs.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-900">{t.empty}</p>
              <p className="mt-2 text-sm text-slate-500">
                {t.emptyDescription}
              </p>
            </div>
          ) : (
            <RepairsTable repairs={page.repairs} />
          )}
        </>
      )}
    </main>
  );
}

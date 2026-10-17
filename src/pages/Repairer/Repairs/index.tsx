import { useEffect } from 'react';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { useRepairerRepairsPage } from './hooks/useRepairerRepairsPage';
import { RepairerRepairsTable } from './components/RepairerRepairsTable';

export default function RepairerRepairsPage() {
  const page = useRepairerRepairsPage();

  useEffect(() => {
    const previous = document.title;
    document.title = 'My Assigned Repairs | Appliances LK';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            My Assigned Repairs
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View and manage repair tickets assigned to you
          </p>
        </div>
        <button
          type="button"
          onClick={() => void page.refresh()}
          disabled={page.loading}
          className="auth-secondary"
        >
          Refresh
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
              <p className="text-sm font-medium text-slate-900">
                No repairs assigned
              </p>
              <p className="mt-2 text-sm text-slate-500">
                You don't have any repair tickets assigned to you yet.
              </p>
            </div>
          ) : (
            <RepairerRepairsTable repairs={page.repairs} />
          )}
        </>
      )}
    </main>
  );
}

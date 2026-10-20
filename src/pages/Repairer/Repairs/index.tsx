import { EmptyState } from '../../../components/ui/Feedback';
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
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="ui-page-title text-slate-900">My Assigned Repairs</h1>
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
            <EmptyState
              title={'No repairs assigned'}
              description={
                "You don't have any repair tickets assigned to you yet."
              }
              icon="repair"
            />
          ) : (
            <RepairerRepairsTable repairs={page.repairs} />
          )}
        </>
      )}
    </main>
  );
}

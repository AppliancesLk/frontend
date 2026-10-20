import { EmptyState } from '../../../components/ui/Feedback';
import { InventoryList } from './components/InventoryList';
import { useInventoryPage } from './hooks/useInventoryPage';
import { translations } from '../../../utils/translations';
import { LoadingState, ErrorState } from '../../../components/ui/Feedback';
function InventoryPage() {
  const page = useInventoryPage();
  const { products, loading, loadError, saving, handleRefresh } = page;
  return (
    <section>
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="ui-page-title text-slate-900">
              {translations.admin.inventory}
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              {translations.admin.inventoryDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || Object.values(saving).some(Boolean)}
            className="ui-button ui-button-secondary rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {translations.admin.refresh}
          </button>
        </header>

        {loading && (
          <LoadingState label={translations.admin.inventoryLoading} />
        )}

        {!loading && loadError && (
          <ErrorState message={loadError} retry={handleRefresh} />
        )}

        {!loading && !loadError && products.length === 0 && (
          <EmptyState title={translations.admin.inventoryEmpty} icon="bag" />
        )}

        {!loading && !loadError && products.length > 0 && (
          <>
            <p className="mb-3 text-sm text-slate-500">
              {products.length}{' '}
              {products.length === 1
                ? translations.admin.productSingular
                : translations.admin.productPlural}
            </p>

            <InventoryList page={page} />
          </>
        )}
      </div>
    </section>
  );
}

export default InventoryPage;

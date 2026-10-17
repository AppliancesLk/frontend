import { InventoryList } from './components/InventoryList';
import { useInventoryPage } from './hooks/useInventoryPage';
import { translations } from '../../../utils/translations';
function InventoryPage() {
  const page = useInventoryPage();
  const { products, loading, loadError, saving, handleRefresh } = page;
  return (
    <section>
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
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
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {translations.admin.refresh}
          </button>
        </header>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">
              {translations.admin.inventoryLoading}
            </p>
          </div>
        )}

        {!loading && loadError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-700">{loadError}</p>
          </div>
        )}

        {!loading && !loadError && products.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">
              {translations.admin.inventoryEmpty}
            </p>
          </div>
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

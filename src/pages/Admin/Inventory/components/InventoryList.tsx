import type { useInventoryPage } from '../hooks/useInventoryPage';
import { translations } from '../../../../utils/translations';
export function InventoryList({
  page,
}: {
  page: ReturnType<typeof useInventoryPage>;
}) {
  const { products, drafts, saving, messages, handleDraftChange, handleSave } =
    page;
  return (
    <ul className="space-y-3">
      {products.map((product) => {
        const { productID } = product;
        const isSaving = saving[productID] === true;
        const message = messages[productID];
        const draft = drafts[productID] ?? String(product.stockQty);
        const isUnchanged = draft.trim() === String(product.stockQty);

        return (
          <li
            key={productID}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <form
              onSubmit={(event) => void handleSave(event, product)}
              className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-slate-900">
                    {product.name}
                  </h2>

                  {!product.isActive && (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {translations.admin.inactive}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {translations.admin.sku}: {product.SKU} |{' '}
                  {product.category.name}
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  {translations.admin.currentStock}{' '}
                  <span className="font-semibold">{product.stockQty}</span>
                  {product.stockQty === 0 && (
                    <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                      {translations.admin.outOfStock}
                    </span>
                  )}
                </p>
              </div>

              <div className="shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft}
                    onChange={(event) =>
                      handleDraftChange(productID, event.target.value)
                    }
                    disabled={isSaving}
                    aria-label={`${translations.admin.newStockLabel} ${product.name}`}
                    aria-invalid={message?.type === 'error'}
                    className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none disabled:bg-slate-100"
                  />

                  <button
                    type="submit"
                    disabled={isSaving || isUnchanged}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving
                      ? translations.admin.saving
                      : translations.admin.save}
                  </button>
                </div>

                {message && (
                  <p
                    role={message.type === 'error' ? 'alert' : 'status'}
                    className={`mt-2 text-sm ${
                      message.type === 'error'
                        ? 'text-red-600'
                        : 'text-green-700'
                    }`}
                  >
                    {message.text}
                  </p>
                )}
              </div>
            </form>
          </li>
        );
      })}
    </ul>
  );
}

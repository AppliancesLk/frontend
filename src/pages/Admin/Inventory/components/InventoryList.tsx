import { Spinner } from '../../../../components/ui/Feedback';
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
            className="rounded-md border border-line bg-surface p-5 "
          >
            <form
              onSubmit={(event) => void handleSave(event, product)}
              className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-fg">{product.name}</h2>

                  {!product.isActive && (
                    <span className="rounded-full bg-subtle px-2 py-1 text-xs font-medium text-fg-secondary">
                      {translations.admin.inactive}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-fg-muted">
                  {translations.admin.sku}: {product.SKU} |{' '}
                  {product.category.name}
                </p>

                <p className="mt-2 text-sm text-fg-secondary">
                  {translations.admin.currentStock}{' '}
                  <span className="font-semibold">{product.stockQty}</span>
                  {product.stockQty === 0 && (
                    <span className="ml-2 rounded-full bg-danger-bg px-2 py-1 text-xs font-medium text-danger">
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
                    className="ui-field w-28 rounded-sm border border-line px-3 py-2 text-sm text-fg focus:border-primary focus:outline-none disabled:bg-subtle"
                  />

                  <button
                    type="submit"
                    disabled={isSaving || isUnchanged}
                    className="ui-button ui-button-primary rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-on transition hover:bg-primary-hover disabled:cursor-not-allowed "
                  >
                    {isSaving && <Spinner className="mr-2" />}
                    {isSaving
                      ? translations.admin.saving
                      : translations.admin.save}
                  </button>
                </div>

                {message && (
                  <p
                    role={message.type === 'error' ? 'alert' : 'status'}
                    className={`mt-2 text-sm ${
                      message.type === 'error' ? 'text-danger' : 'text-success'
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

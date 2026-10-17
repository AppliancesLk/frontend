import { useCallback, useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';

import {
  getProducts,
  updateProductStock,
} from '../../../services/productService';
import type { Product } from '../../../types/product.types';
import { getStockUpdateErrorMessage } from '../../../utils/stockErrors';
import { validateStockQuantity } from '../../../utils/stockValidation';

interface RowMessage {
  type: 'success' | 'error';
  text: string;
}

function withoutKey<T>(
  record: Record<string, T>,
  key: string,
): Record<string, T> {
  const copy = { ...record };

  delete copy[key];

  return copy;
}

function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, RowMessage>>({});

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();

      setProducts(data);
      setLoadError(null);
    } catch {
      setLoadError('Unable to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleRefresh = () => {
    setLoading(true);
    setDrafts({});
    setMessages({});
    void loadProducts();
  };

  const handleDraftChange = (productID: string, value: string) => {
    setDrafts((current) => ({ ...current, [productID]: value }));
    setMessages((current) => withoutKey(current, productID));
  };

  const handleSave = async (event: SubmitEvent, product: Product) => {
    event.preventDefault();

    const { productID } = product;

    if (saving[productID]) {
      return;
    }

    const result = validateStockQuantity(
      drafts[productID] ?? String(product.stockQty),
    );

    if (!result.valid) {
      const validationMessage = result.message;

      setMessages((current) => ({
        ...current,
        [productID]: { type: 'error', text: validationMessage },
      }));

      return;
    }

    setSaving((current) => ({ ...current, [productID]: true }));
    setMessages((current) => withoutKey(current, productID));

    try {
      const updated = await updateProductStock(productID, result.value);

      setProducts((current) =>
        current.map((item) =>
          item.productID === productID
            ? { ...item, stockQty: updated.stockQty }
            : item,
        ),
      );
      setDrafts((current) => withoutKey(current, productID));
      setMessages((current) => ({
        ...current,
        [productID]: { type: 'success', text: 'Stock updated.' },
      }));
    } catch (error) {
      setMessages((current) => ({
        ...current,
        [productID]: {
          type: 'error',
          text: getStockUpdateErrorMessage(error),
        },
      }));
    } finally {
      setSaving((current) => ({ ...current, [productID]: false }));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Inventory
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              View and update the available stock for each product.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh
          </button>
        </header>

        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">Loading inventory...</p>
          </div>
        )}

        {!loading && loadError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-700">{loadError}</p>
          </div>
        )}

        {!loading && !loadError && products.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">No products found.</p>
          </div>
        )}

        {!loading && !loadError && products.length > 0 && (
          <>
            <p className="mb-3 text-sm text-slate-500">
              {products.length}{' '}
              {products.length === 1 ? 'product' : 'products'}
            </p>

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
                    className="rounded-xl bg-white p-5 shadow-sm"
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
                              Inactive
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          SKU: {product.SKU} · {product.category.name}
                        </p>

                        <p className="mt-2 text-sm text-slate-700">
                          Current stock:{' '}
                          <span className="font-semibold">
                            {product.stockQty}
                          </span>
                          {product.stockQty === 0 && (
                            <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                              Out of Stock
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
                              handleDraftChange(
                                productID,
                                event.target.value,
                              )
                            }
                            disabled={isSaving}
                            aria-label={`New stock quantity for ${product.name}`}
                            aria-invalid={message?.type === 'error'}
                            className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none disabled:bg-slate-100"
                          />

                          <button
                            type="submit"
                            disabled={isSaving || isUnchanged}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                        </div>

                        {message && (
                          <p
                            role={
                              message.type === 'error' ? 'alert' : 'status'
                            }
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
          </>
        )}
      </div>
    </main>
  );
}

export default InventoryPage;

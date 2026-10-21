import { useEffect, useState } from 'react';
import { getProductCatalog } from '../../../../services/productService';
import type { CatalogResult } from '../../../../types/catalog.types';
import type {
  PromotionContent,
  PromotionProduct,
} from '../../../../types/promotion.types';
import { ProductImage } from '../../../../components/common/ProductImage';
import { formatCurrency } from '../../../../utils/currency';
import { promotionText as t } from '../../../../utils/promotionText';
import { getApiError } from '../../../../utils/apiErrors';
import { Button } from '../../../../components/ui/Button';
import { LoadingState } from '../../../../components/ui/Feedback';
export function ProductPicker({
  draft,
  onChange,
  selectedProducts,
  onProducts,
}: {
  draft: PromotionContent;
  onChange: (value: PromotionContent) => void;
  selectedProducts: PromotionProduct[];
  onProducts: (value: PromotionProduct[]) => void;
}) {
  const [search, setSearch] = useState(''),
    [page, setPage] = useState(1),
    [result, setResult] = useState<CatalogResult | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const next = await getProductCatalog(
          { q: search, page, limit: 8, sort: 'name' },
          controller.signal,
        );
        if (!controller.signal.aborted) setResult(next);
      } catch (err) {
        if (!controller.signal.aborted)
          setError(
            getApiError(err, 'Unable to load products. Please try again.'),
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [search, page, revision]);
  function toggle(product: PromotionProduct) {
    const has = draft.productIds.includes(product.productID);
    onChange({
      ...draft,
      productIds: has
        ? draft.productIds.filter((id) => id !== product.productID)
        : [...draft.productIds, product.productID],
    });
    if (
      !has &&
      !selectedProducts.some((item) => item.productID === product.productID)
    )
      onProducts([...selectedProducts, product]);
  }
  return (
    <section className="ui-panel p-5 sm:p-6">
      <h2 className="text-lg font-semibold">{t.products}</h2>
      <p className="mt-2 text-xs leading-5 text-fg-muted">{t.productHint}</p>
      <p className="mt-3 text-xs font-semibold">
        {draft.productIds.length} / 12 {t.selectedCount}
      </p>
      {draft.productIds.length > 0 && (
        <ul className="mt-3 space-y-2">
          {draft.productIds.map((id) => {
            const product = selectedProducts.find(
              (item) => item.productID === id,
            );
            return (
              <li
                key={id}
                className="flex items-center justify-between gap-3 rounded-md bg-subtle p-3 text-xs"
              >
                <span className="min-w-0 break-words">
                  {product?.name ?? 'Unavailable product'}
                  {product && !product.isActive ? ' (inactive)' : ''}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${product?.name ?? 'product'}`}
                  className="shrink-0 p-1 underline"
                  onClick={() =>
                    onChange({
                      ...draft,
                      productIds: draft.productIds.filter(
                        (value) => value !== id,
                      ),
                    })
                  }
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <label className="auth-label mt-4" htmlFor="promotion-product-search">
        {t.productSearch}
      </label>
      <input
        id="promotion-product-search"
        className="ui-field"
        type="search"
        maxLength={100}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}{' '}
          <button
            type="button"
            className="underline"
            onClick={() => setRevision((n) => n + 1)}
          >
            Retry
          </button>
        </p>
      )}
      {loading ? (
        <LoadingState compact />
      ) : (
        <div className="mt-3 max-h-80 overflow-y-auto rounded-md border border-line">
          {result?.items.length ? (
            result.items.map((product) => (
              <label
                key={product.productID}
                className="flex cursor-pointer items-center gap-3 border-b border-line p-3 last:border-0 hover:bg-subtle"
              >
                <input
                  type="checkbox"
                  aria-label={`Select product ${product.name}`}
                  checked={draft.productIds.includes(product.productID)}
                  disabled={
                    draft.productIds.length >= 12 &&
                    !draft.productIds.includes(product.productID)
                  }
                  onChange={() => toggle(product)}
                  className="h-4 w-4 shrink-0 accent-primary"
                />
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-subtle">
                  <ProductImage
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="min-w-0 text-xs">
                  <span className="block font-medium">{product.name}</span>
                  <span className="mt-1 block text-fg-muted">
                    {formatCurrency(product.price)}
                  </span>
                </span>
              </label>
            ))
          ) : (
            <p className="p-4 text-sm text-fg-muted">No matching products.</p>
          )}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <p>{result?.total ?? 0} products</p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={page <= 1 || loading}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            disabled={loading || !result || page >= result.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}

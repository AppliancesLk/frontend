import type { useProductsPage } from '../hooks/useProductsPage';
import { translations } from '../../../../utils/translations';
import { formatCurrency } from '../../../../utils/currency';
const t = translations.admin;
export function ProductTable({
  page,
}: {
  page: ReturnType<typeof useProductsPage>;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
        <h2 className="text-xl font-semibold text-slate-900">
          {t.catalog} ({page.products.length})
        </h2>
        <input
          aria-label={t.search}
          placeholder={t.search}
          className="auth-input max-w-xs"
          value={page.search}
          onChange={(event) => page.setSearch(event.target.value)}
        />
      </div>
      {page.filtered.length === 0 ? (
        <p className="p-6 text-sm text-slate-500">
          {page.products.length === 0
            ? t.noProducts
            : translations.common.noMatches}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {[
                  t.productName,
                  t.sku,
                  t.category,
                  t.price,
                  t.stock,
                  t.actions,
                ].map((label) => (
                  <th key={label} scope="col" className="px-5 py-3 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.filtered.map((product) => (
                <tr
                  key={product.productID}
                  className="border-t border-slate-200"
                >
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {product.name}
                    <span
                      className={`ml-2 rounded-full px-2 py-1 text-xs ${product.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {product.isActive ? t.active : t.inactive}
                    </span>
                  </td>
                  <td className="px-5 py-4">{product.SKU}</td>
                  <td className="px-5 py-4">{product.category.name}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-5 py-4">{product.stockQty}</td>
                  <td className="px-5 py-4">
                    <button
                      className="auth-secondary"
                      disabled={page.updating !== null}
                      onClick={() => void page.toggle(product)}
                    >
                      {page.updating === product.productID
                        ? t.saving
                        : product.isActive
                          ? t.deactivate
                          : t.activate}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { generatePath, Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
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
    <section className="overflow-hidden rounded-md border border-line bg-surface ">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
        <h2 className="text-xl font-semibold text-fg">
          {t.catalog} ({page.products.length})
        </h2>
        <input
          aria-label={t.search}
          placeholder={t.search}
          className="ui-field auth-input max-w-xs"
          value={page.search}
          onChange={(event) => page.setSearch(event.target.value)}
        />
      </div>
      {page.filtered.length === 0 ? (
        <p className="p-6 text-sm text-fg-muted">
          {page.products.length === 0
            ? t.noProducts
            : translations.common.noMatches}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="ui-table ui-card-table w-full text-left text-sm">
            <thead className="bg-page text-fg-secondary">
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
                <tr key={product.productID} className="border-t border-line">
                  <td
                    data-label={t.productName}
                    className="px-5 py-4 font-medium text-fg"
                  >
                    <div className="ui-cell-value">
                      {product.name}
                      <StatusBadge
                        status={product.isActive ? 'ACTIVE' : 'INACTIVE'}
                      >
                        {product.isActive ? t.active : t.inactive}
                      </StatusBadge>
                    </div>
                  </td>
                  <td data-label={t.sku} className="px-5 py-4">
                    <div className="ui-cell-value">{product.SKU}</div>
                  </td>
                  <td data-label={t.category} className="px-5 py-4">
                    <div className="ui-cell-value">{product.category.name}</div>
                  </td>
                  <td
                    data-label={t.price}
                    className="xl:whitespace-nowrap px-5 py-4"
                  >
                    <div className="ui-cell-value">
                      {formatCurrency(product.price)}
                    </div>
                  </td>
                  <td data-label={t.stock} className="px-5 py-4">
                    <div className="ui-cell-value">{product.stockQty}</div>
                  </td>
                  <td data-label={t.actions} className="px-5 py-4">
                    <div className="ui-cell-value">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={generatePath(ROUTES.adminProductEdit, {
                            id: product.productID,
                          })}
                          className="auth-secondary"
                          aria-label={`${translations.productEdit.title}: ${product.name}`}
                        >
                          {translations.productEdit.editLabel}
                        </Link>
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
                      </div>
                    </div>
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

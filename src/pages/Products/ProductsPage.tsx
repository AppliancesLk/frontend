import { formatCategoryName } from '../../utils/category';
import { EmptyState } from '../../components/ui/Feedback';
import { ProductGridSkeleton } from '../../components/feedback/ProductGridSkeleton';
import { Dialog } from '../../components/ui/Dialog';
import { uiText } from '../../utils/uiText';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
import { Icon } from '../../components/common/Icon';
import { CATALOG_SORTS } from '../../types/catalog.types';
import { formatCurrency } from '../../utils/currency';
import { useProductsCatalog } from './hooks/useProductsCatalog';
import { CatalogProductCard } from './components/CatalogProductCard';
import { CatalogFilters } from './components/CatalogFilters';
import { CatalogPagination } from './components/CatalogPagination';
const t = translations.catalog;
export default function ProductsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const page = useProductsCatalog();
  const { data, query } = page;
  const selectedCategory = data?.facets.categories.find(
    (category) => category.categoryID === query?.categoryId,
  );
  const chips = [
    ...(query?.q
      ? [{ label: `“${query.q}”`, clear: () => page.update({ q: undefined }) }]
      : []),
    ...(query?.categoryId
      ? [
          {
            label: selectedCategory?.name ?? t.categories,
            clear: () => page.update({ category: undefined }),
          },
        ]
      : []),
    ...(query?.brands?.split(',').map((brand) => ({
      label: brand,
      clear: () =>
        page.update({
          brands:
            query.brands
              ?.split(',')
              .filter((value) => value !== brand)
              .join(',') || undefined,
        }),
    })) ?? []),
    ...(query?.minPrice !== undefined
      ? [
          {
            label: `${t.minPrice}: ${formatCurrency(query.minPrice)}`,
            clear: () => page.update({ minPrice: undefined }),
          },
        ]
      : []),
    ...(query?.maxPrice !== undefined
      ? [
          {
            label: `${t.maxPrice}: ${formatCurrency(query.maxPrice)}`,
            clear: () => page.update({ maxPrice: undefined }),
          },
        ]
      : []),
  ];
  return (
    <main className="shell-wide py-6 md:py-8">
      <nav
        aria-label={t.breadcrumb}
        className="mb-4 flex items-center gap-2 text-xs text-fg-muted"
      >
        <Link to={ROUTES.home} className="hover:text-fg-link">
          {t.home}
        </Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{t.title}</span>
      </nav>
      <h1 className="sr-only">
        {selectedCategory ? formatCategoryName(selectedCategory.name) : t.title}
      </h1>
      {page.loading && !data && <ProductGridSkeleton />}
      {page.error && (
        <div
          role="alert"
          className="rounded-md border border-danger/25 bg-danger-bg p-6"
        >
          <p className="text-sm text-danger">{page.error}</p>
          <div className="mt-4 flex gap-3">
            {query && (
              <button
                onClick={page.retry}
                className="ui-button ui-button-primary rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-on"
              >
                {t.retry}
              </button>
            )}
            <button
              onClick={page.clear}
              className="ui-button ui-button-secondary rounded-sm border border-line bg-surface px-4 py-2 text-sm text-fg-secondary"
            >
              {t.clear}
            </button>
          </div>
        </div>
      )}
      {data && query && (
        <div
          aria-busy={page.loading}
          className="grid items-start gap-5 lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:gap-6"
        >
          <aside aria-label={t.filters} className="min-w-0">
            <button
              type="button"
              aria-expanded={filtersOpen}
              aria-controls="catalog-filters"
              onClick={() => setFiltersOpen((value) => !value)}
              className="ui-button ui-button-secondary mb-3 flex min-h-11 w-full items-center gap-2 rounded-sm border border-line bg-surface px-4 text-sm font-semibold text-fg-secondary lg:hidden"
            >
              <Icon name="filter" />
              {t.filters}
              <span className="ml-auto text-xs font-normal">
                {chips.length || ''} {filtersOpen ? '−' : '+'}
              </span>
            </button>
            <div id="catalog-filters" className="hidden lg:block">
              <CatalogFilters
                key={'desktop-' + query.minPrice + ':' + query.maxPrice}
                facets={data.facets}
                query={query}
                update={page.update}
                clear={page.clear}
              />
            </div>
            <Dialog
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              title={uiText.filters}
              drawer
            >
              <CatalogFilters
                key={'mobile-' + query.minPrice + ':' + query.maxPrice}
                facets={data.facets}
                query={query}
                update={page.update}
                clear={page.clear}
              />
              <button
                type="button"
                className="ui-button ui-button-primary mt-5 w-full"
                onClick={() => setFiltersOpen(false)}
              >
                {uiText.applyFilters}
              </button>
            </Dialog>
          </aside>
          <section aria-label={t.title} className="min-w-0">
            {chips.length > 0 && (
              <div
                aria-label={t.active}
                className="mb-4 flex flex-wrap items-center gap-2"
              >
                {chips.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={chip.clear}
                    aria-label={`${t.remove}: ${chip.label}`}
                    className="max-w-full rounded-sm border border-primary bg-primary-subtle px-3 py-2 text-xs text-fg-link"
                  >
                    <span className="break-words">{chip.label}</span>
                    <span aria-hidden="true" className="ml-2">
                      ×
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <p role="status" className="text-sm text-fg-muted">
                {t.showing} {data.total ? (data.page - 1) * data.limit + 1 : 0}–
                {Math.min(data.page * data.limit, data.total)} {t.of}{' '}
                {data.total.toLocaleString()}{' '}
                {data.total === 1 ? t.product : t.products}
              </p>
              <label className="flex items-center gap-3 whitespace-nowrap text-sm font-medium text-fg-secondary">
                {t.sort}
                <select
                  aria-label={t.sort}
                  value={query.sort}
                  onChange={(event) =>
                    page.update({ sort: event.target.value })
                  }
                  className="ui-field min-h-11 w-auto rounded-sm border border-line bg-surface px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {CATALOG_SORTS.map((sort) => (
                    <option key={sort} value={sort}>
                      {t.sorts[sort]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {!data.items.length ? (
              <EmptyState
                title={t.empty}
                description={t.emptyDescription}
                action={
                  <button
                    onClick={page.clear}
                    className="ui-button ui-button-primary mt-5 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-on"
                  >
                    {t.clear}
                  </button>
                }
                icon="bag"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {data.items.map((product) => (
                  <CatalogProductCard
                    key={product.productID}
                    product={product}
                  />
                ))}
              </div>
            )}
            <CatalogPagination
              page={data.page}
              totalPages={data.totalPages}
              onChange={(number) => {
                page.update({ page: String(number) });
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            />
          </section>
        </div>
      )}
    </main>
  );
}

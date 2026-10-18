import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
import { Icon } from '../../components/common/Icon';
import { ProductImage } from '../../components/common/ProductImage';
import { CATALOG_SORTS } from '../../types/catalog.types';
import { formatCurrency } from '../../utils/currency';
import { useProductsCatalog } from './hooks/useProductsCatalog';
import { CatalogProductCard } from './components/CatalogProductCard';
import { CatalogFilters } from './components/CatalogFilters';
import { CategoryIcon } from './components/CategoryIcon';
import { CatalogPagination } from './components/CatalogPagination';
const t = translations.catalog;
export default function ProductsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const page = useProductsCatalog();
  const { data, query } = page;
  const selectedCategory = data?.facets.categories.find(
    (category) => category.categoryID === query?.categoryId,
  );
  const tiles =
    data?.facets.categories
      .filter(
        (category) =>
          category.parentId === (selectedCategory?.parentId ?? null),
      )
      .slice(0, 6) ?? [];
  const illustrations =
    data?.items.filter((product) => product.images[0]).slice(0, 3) ?? [];
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
    <main className="mx-auto max-w-[96rem] px-4 py-6 sm:px-6 lg:px-8">
      <nav
        aria-label={t.breadcrumb}
        className="mb-4 flex items-center gap-2 text-xs text-slate-500"
      >
        <Link to={ROUTES.home} className="hover:text-blue-700">
          {t.home}
        </Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{t.title}</span>
      </nav>
      <header className="relative mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 px-5 py-7 sm:px-8 lg:flex lg:min-h-40 lg:items-center lg:justify-between">
        <div className="relative z-10 max-w-xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-blue-600">
            {t.eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
            {t.description}
          </p>
        </div>
        {illustrations.length > 0 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-8 top-0 hidden h-full items-center gap-4 opacity-80 xl:flex"
          >
            {illustrations.map((product, index) => (
              <div
                key={product.productID}
                className={`w-28 rounded-2xl bg-white/70 p-3 xl:w-36 ${index === 1 ? '-rotate-6' : 'rotate-6'}`}
              >
                <ProductImage
                  src={product.images[0]}
                  alt=""
                  className="aspect-square w-full"
                />
              </div>
            ))}
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-24 h-64 w-64 rounded-full border-[40px] border-yellow-200/60"
        />
      </header>
      {page.loading && !data && (
        <div
          role="status"
          className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500"
        >
          {t.loading}
          <div
            aria-hidden="true"
            className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="aspect-[3/4] rounded-xl bg-slate-100 motion-safe:animate-pulse"
              />
            ))}
          </div>
        </div>
      )}
      {page.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6"
        >
          <p className="text-sm text-red-700">{page.error}</p>
          <div className="mt-4 flex gap-3">
            {query && (
              <button
                onClick={page.retry}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                {t.retry}
              </button>
            )}
            <button
              onClick={page.clear}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
            >
              {t.clear}
            </button>
          </div>
        </div>
      )}
      {data && query && (
        <div
          aria-busy={page.loading}
          className="grid items-start gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] xl:gap-6"
        >
          <aside aria-label={t.filters} className="min-w-0">
            <button
              type="button"
              aria-expanded={filtersOpen}
              aria-controls="catalog-filters"
              onClick={() => setFiltersOpen((value) => !value)}
              className="mb-3 flex min-h-11 w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 lg:hidden"
            >
              <Icon name="filter" />
              {t.filters}
              <span className="ml-auto text-xs font-normal">
                {chips.length || ''} {filtersOpen ? '−' : '+'}
              </span>
            </button>
            <div
              id="catalog-filters"
              className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}
            >
              <CatalogFilters
                key={`${query.minPrice}:${query.maxPrice}`}
                facets={data.facets}
                query={query}
                update={page.update}
                clear={page.clear}
              />
            </div>
          </aside>
          <section aria-label={t.title} className="min-w-0">
            {tiles.length > 0 && (
              <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6">
                {tiles.map((category) => (
                  <button
                    key={category.categoryID}
                    aria-pressed={query.categoryId === category.categoryID}
                    onClick={() =>
                      page.update({ category: category.categoryID })
                    }
                    className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-colors ${query.categoryId === category.categoryID ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-400'}`}
                  >
                    <span className="rounded-lg border border-blue-100 bg-white p-2 text-blue-600">
                      {category.imageUrl?<ProductImage src={category.imageUrl} alt="" className="h-8 w-8" />:<CategoryIcon name={category.name} className="h-6 w-6" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-slate-900">
                        {category.name}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {category.count.toLocaleString()} {t.products}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
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
                    className="max-w-full rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700"
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
              <p role="status" className="text-sm text-slate-500">
                {t.showing} {data.total ? (data.page - 1) * data.limit + 1 : 0}–
                {Math.min(data.page * data.limit, data.total)} {t.of}{' '}
                {data.total.toLocaleString()}{' '}
                {data.total === 1 ? t.product : t.products}
              </p>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                {t.sort}
                <select
                  aria-label={t.sort}
                  value={query.sort}
                  onChange={(event) =>
                    page.update({ sort: event.target.value })
                  }
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-blue-700">
                  <Icon name="search" />
                </span>
                <h2 className="text-xl font-semibold text-slate-900">
                  {t.empty}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {t.emptyDescription}
                </p>
                <button
                  onClick={page.clear}
                  className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                >
                  {t.clear}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
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

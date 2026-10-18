import { paginationPages } from '../helpers/catalog.helpers';
import { translations } from '../../../utils/translations';
const t = translations.catalog;
export function CatalogPagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label={t.pagination}
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label={t.previous}
        className="h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
      >
        ←
      </button>
      {paginationPages(page, totalPages).map((value, index) =>
        value === 'ellipsis' ? (
          <span key={`gap-${index}`} className="px-1 text-slate-500">
            …
          </span>
        ) : (
          <button
            key={value}
            aria-label={`${t.page} ${value}`}
            aria-current={value === page ? 'page' : undefined}
            onClick={() => onChange(value)}
            className={`h-10 min-w-10 rounded-lg border px-2 text-sm font-medium ${value === page ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-400'}`}
          >
            {value}
          </button>
        ),
      )}
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label={t.next}
        className="h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
      >
        →
      </button>
    </nav>
  );
}

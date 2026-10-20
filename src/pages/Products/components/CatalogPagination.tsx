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
        className="min-h-11 w-11 rounded-sm border border-line bg-surface text-fg-secondary disabled:text-fg-disabled"
      >
        ←
      </button>
      {paginationPages(page, totalPages).map((value, index) =>
        value === 'ellipsis' ? (
          <span key={`gap-${index}`} className="px-1 text-fg-muted">
            …
          </span>
        ) : (
          <button
            key={value}
            aria-label={`${t.page} ${value}`}
            aria-current={value === page ? 'page' : undefined}
            onClick={() => onChange(value)}
            className={`h-10 min-w-10 rounded-sm border px-2 text-sm font-medium ${value === page ? 'border-primary bg-primary text-primary-on' : 'border-line bg-surface text-fg-secondary hover:border-primary'}`}
          >
            {value}
          </button>
        ),
      )}
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label={t.next}
        className="min-h-11 w-11 rounded-sm border border-line bg-surface text-fg-secondary disabled:text-fg-disabled"
      >
        →
      </button>
    </nav>
  );
}

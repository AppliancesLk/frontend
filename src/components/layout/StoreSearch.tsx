import { useEffect, useId, useRef, useState } from 'react';
import { generatePath, Link, useNavigate } from 'react-router-dom';
import { getProductCatalog } from '../../services/productService';
import type { Product } from '../../types/product.types';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/currency';
import { Icon } from '../common/Icon';
import { ProductImage } from '../common/ProductImage';

export function StoreSearch({
  onSearch,
  autoFocus = false,
}: {
  onSearch?: () => void;
  autoFocus?: boolean;
}) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem('al-searches') ?? '[]',
      );
      return Array.isArray(saved)
        ? saved
            .filter((item): item is string => typeof item === 'string')
            .slice(0, 5)
        : [];
    } catch {
      return [];
    }
  });
  const [selected, setSelected] = useState(-1);
  const host = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setPending(true);
      setError(false);
      void getProductCatalog(
        { q: query.trim(), sort: 'name', limit: 5, page: 1 },
        controller.signal,
      )
        .then((data) => {
          if (!controller.signal.aborted) setResults(data.items);
        })
        .catch(() => {
          if (!controller.signal.aborted) setError(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) setPending(false);
        });
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!host.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  function search(value = query) {
    const clean = value.trim();
    if (clean) {
      const next = [clean, ...recent.filter((item) => item !== clean)].slice(
        0,
        5,
      );
      setRecent(next);
      try {
        localStorage.setItem('al-searches', JSON.stringify(next));
      } catch {
        /* Search works without storage. */
      }
    }
    setOpen(false);
    onSearch?.();
    navigate(
      ROUTES.products + (clean ? '?q=' + encodeURIComponent(clean) : ''),
    );
  }
  return (
    <div
      className="store-search"
      ref={host}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          search();
        }}
        className="search-field"
      >
        <Icon name="search" />
        <label htmlFor={`${id}-input`} className="sr-only">
          Search products
        </label>
        <input
          id={`${id}-input`}
          autoFocus={autoFocus}
          autoComplete="off"
          value={query}
          placeholder="Search phones, appliances, accessories…"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setResults([]);
            setPending(event.target.value.trim().length >= 2);
            setSelected(-1);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false);
              return;
            }
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setSelected((value) =>
                Math.max(
                  -1,
                  Math.min(
                    results.length - 1,
                    value + (event.key === 'ArrowDown' ? 1 : -1),
                  ),
                ),
              );
            }
            if (
              event.key === 'Enter' &&
              open &&
              selected >= 0 &&
              results[selected]
            ) {
              event.preventDefault();
              setOpen(false);
              onSearch?.();
              navigate(
                generatePath(ROUTES.productDetail, {
                  id: results[selected].productID,
                }),
              );
            }
          }}
          aria-expanded={open}
          aria-controls={`${id}-suggestions`}
          aria-activedescendant={
            selected >= 0 ? `${id}-suggestion-${selected}` : undefined
          }
          role="combobox"
          aria-autocomplete="list"
        />
        <button
          type="submit"
          aria-label="Search products"
          className="search-submit"
        >
          <span className="hidden lg:inline">Search</span>
          <Icon name="arrow" className="h-4 w-4 lg:hidden" />
        </button>
      </form>
      {open && (
        <div
          id={`${id}-suggestions`}
          className="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
        >
          {query.trim().length < 2 ? (
            <>
              <p className="px-3 pb-2 text-xs text-fg-muted">
                {recent.length
                  ? 'Recent searches'
                  : 'Find your next everyday essential'}
              </p>
              {recent.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => {
                    setQuery(item);
                    search(item);
                  }}
                  className="search-option"
                >
                  <Icon name="search" />
                  {item}
                </button>
              ))}
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="search-option"
                onClick={() => search('')}
              >
                Browse all products
                <Icon name="arrow" />
              </button>
            </>
          ) : pending ? (
            <p className="p-3 text-sm text-fg-muted" role="status">
              Finding products…
            </p>
          ) : error ? (
            <p className="p-3 text-sm text-fg-muted">
              Suggestions unavailable. Press Enter to search.
            </p>
          ) : (
            <>
              {results.map((product, index) => (
                <Link
                  key={product.productID}
                  id={`${id}-suggestion-${index}`}
                  role="option"
                  aria-selected={selected === index}
                  className={`search-option ${selected === index ? 'bg-primary-subtle' : ''}`}
                  to={generatePath(ROUTES.productDetail, {
                    id: product.productID,
                  })}
                  onClick={() => {
                    setOpen(false);
                    onSearch?.();
                  }}
                >
                  <ProductImage
                    src={product.images[0]}
                    alt=""
                    className="h-10 w-10 rounded bg-well"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {product.name}
                    </span>
                    <span className="text-xs text-fg-muted">
                      {formatCurrency(product.price)}
                    </span>
                  </span>
                </Link>
              ))}
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="search-option text-fg-link"
                onClick={() => search()}
              >
                See all results for “{query}”<Icon name="arrow" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

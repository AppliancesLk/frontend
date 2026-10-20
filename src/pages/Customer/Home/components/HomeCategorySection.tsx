import { formatCategoryName } from '../../../../utils/category';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { Icon } from '../../../../components/common/Icon';
import { ProductImage } from '../../../../components/common/ProductImage';
import type { Category } from '../../../../types/category.types';
import { translations } from '../../../../utils/translations';

const t = translations.storefront;

export function HomeCategorySection({
  categories,
}: {
  categories: Category[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const topLevelCategories = categories.filter((category) => !category.parent);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const updateOverflow = () => {
      setHasOverflow(element.scrollWidth > element.clientWidth + 1);
    };
    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [topLevelCategories.length]);

  if (!topLevelCategories.length) return null;

  function scrollCategories(direction: -1 | 1) {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth * 0.75,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  }

  return (
    <section aria-labelledby="home-categories-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="home-categories-heading"
            className="text-2xl font-semibold tracking-tight text-fg"
          >
            {t.categories}
          </h2>
          <p className="mt-2 text-sm text-fg-muted">{t.categoryDescription}</p>
        </div>
        {hasOverflow && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={t.previousCategory}
              onClick={() => scrollCategories(-1)}
              className="flex min-h-11 w-11 items-center justify-center rounded-sm border border-line bg-surface text-fg-secondary hover:bg-page"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              aria-label={t.nextCategory}
              onClick={() => scrollCategories(1)}
              className="flex min-h-11 w-11 items-center justify-center rounded-sm border border-line bg-surface text-fg-secondary hover:bg-page"
            >
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div
        ref={scrollRef}
        tabIndex={0}
        aria-label={t.categories}
        className="mt-6 flex gap-4 overflow-x-auto overscroll-x-contain py-2"
      >
        {topLevelCategories.map((category) => (
          <Link
            key={category.categoryID}
            to={`${ROUTES.products}?category=${encodeURIComponent(category.categoryID)}`}
            className="group w-40 shrink-0 rounded-md border border-line-subtle bg-surface p-5 transition-colors hover:border-primary sm:w-44"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-primary-subtle text-fg-link group-hover:bg-primary-subtle">
              {category.imageUrl ? (
                <ProductImage
                  src={category.imageUrl}
                  alt=""
                  className="min-h-11 w-11"
                />
              ) : (
                <Icon name="grid" />
              )}
            </span>
            <span className="text-sm font-semibold text-fg">
              {formatCategoryName(category.name)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

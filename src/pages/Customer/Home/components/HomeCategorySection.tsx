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
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
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

  useEffect(() => {
    const element = scrollRef.current;
    if (
      !element ||
      !hasOverflow ||
      paused ||
      interacting ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    let frame = 0;
    let previousTime = 0;
    let direction = 1;
    const scroll = (time: number) => {
      const maximum = element.scrollWidth - element.clientWidth;
      if (maximum > 0 && previousTime) {
        element.scrollLeft +=
          direction * Math.min(time - previousTime, 50) * 0.024;
        if (element.scrollLeft >= maximum) {
          element.scrollLeft = maximum;
          direction = -1;
        } else if (element.scrollLeft <= 0) {
          element.scrollLeft = 0;
          direction = 1;
        }
      }
      previousTime = time;
      frame = window.requestAnimationFrame(scroll);
    };
    frame = window.requestAnimationFrame(scroll);
    return () => window.cancelAnimationFrame(frame);
  }, [hasOverflow, interacting, paused]);

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
    <section
      aria-labelledby="home-categories-heading"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setInteracting(false);
      }}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="home-categories-heading"
            className="text-2xl font-semibold tracking-tight text-slate-900"
          >
            {t.categories}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{t.categoryDescription}</p>
        </div>
        {hasOverflow && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={t.previousCategory}
              onClick={() => scrollCategories(-1)}
              className="flex min-h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              aria-label={t.nextCategory}
              onClick={() => scrollCategories(1)}
              className="flex min-h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              <Icon name="arrow" className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={
                paused ? t.resumeCategoryScroll : t.pauseCategoryScroll
              }
              onClick={() => setPaused((value) => !value)}
              className="rounded-lg px-2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              {paused ? t.resumeCategoryScroll : t.pauseCategoryScroll}
            </button>
          </div>
        )}
      </div>
      <div
        ref={scrollRef}
        tabIndex={0}
        aria-label={t.categories}
        className="mt-6 flex gap-4 overflow-x-auto overscroll-x-contain py-2"
        onTouchStart={() => setInteracting(true)}
        onTouchEnd={() => setInteracting(false)}
      >
        {topLevelCategories.map((category) => (
          <Link
            key={category.categoryID}
            to={`${ROUTES.products}?category=${encodeURIComponent(category.categoryID)}`}
            className="group w-44 shrink-0 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-400 hover:bg-blue-50"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-700">
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
            <span className="text-sm font-semibold text-slate-800">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

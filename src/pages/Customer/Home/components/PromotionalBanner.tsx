import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { BannerSection } from '../../../../types/banner.types';
import { bannerImageUrl } from '../../../../services/bannerService';
import { ProductImage } from '../../../../components/common/ProductImage';
import { translations } from '../../../../utils/translations';
const t = translations.storefront;
export function PromotionalBanner({ section }: { section?: BannerSection }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const touchStart = useRef<number | null>(null);
  const count = section?.slides.length ?? 0;
  const current = count ? index % count : 0;
  useEffect(() => {
    if (
      count < 2 ||
      paused ||
      interacting ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % count);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [count, paused, interacting]);
  if (!section?.visible || !count) return null;
  const slide = section.slides[current];
  return (
    <section
      aria-label={t.positions[section.position]}
      aria-roledescription={count > 1 ? 'carousel' : undefined}
      className="overflow-hidden rounded-lg border border-line bg-surface"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setInteracting(false);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const end = event.changedTouches[0].clientX;
        if (start !== null && Math.abs(end - start) > 50)
          setIndex((value) => (value + (end < start ? 1 : count - 1)) % count);
        touchStart.current = null;
      }}
    >
      <div
        key={current}
        className="campaign-slide motion-safe:animate-fade-in"
        role="group"
        aria-roledescription="slide"
        aria-label={`${current + 1} of ${count}`}
        aria-live={paused || interacting ? 'polite' : 'off'}
      >
        <ProductImage
          key={slide.imageUrl}
          src={bannerImageUrl(slide.imageUrl)}
          alt={slide.alt}
          eager={section.position === 'top'}
          className={`campaign-art w-full ${section.position === 'top' ? 'aspect-[8/3]' : 'aspect-[16/5]'}`}
        />
        {(slide.title || slide.description || slide.buttonText) && (
          <div className="flex flex-col gap-4 border-t border-line-subtle p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              {slide.title && (
                <h2 className="text-2xl font-bold tracking-tight text-fg md:text-3xl">
                  {slide.title}
                </h2>
              )}
              {slide.description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-fg-secondary">
                  {slide.description}
                </p>
              )}
            </div>
            {slide.buttonText &&
              slide.href &&
              (slide.href.startsWith('/') ? (
                <Link
                  className="shrink-0 self-start rounded-sm bg-primary px-5 py-3 font-semibold text-primary-on hover:bg-primary-hover"
                  to={slide.href}
                >
                  {slide.buttonText} →
                </Link>
              ) : (
                <a
                  className="shrink-0 self-start rounded-sm bg-primary px-5 py-3 font-semibold text-primary-on hover:bg-primary-hover"
                  href={slide.href}
                >
                  {slide.buttonText} →
                </a>
              ))}
          </div>
        )}
      </div>
      {count > 1 && (
        <div className="flex items-center justify-center gap-3 border-t border-line-subtle p-3">
          <button
            aria-label={t.previous}
            className="min-h-11 w-11 rounded-sm hover:bg-subtle"
            onClick={() => setIndex((current + count - 1) % count)}
          >
            ←
          </button>
          {section.slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              aria-current={current === i ? 'true' : undefined}
              onClick={() => setIndex(i)}
              className="flex min-h-11 w-7 items-center justify-center"
            >
              <span
                className={`h-2 rounded-full ${current === i ? 'w-6 bg-primary' : 'w-2 bg-sunken'}`}
              />
            </button>
          ))}
          <button
            aria-label={t.next}
            className="min-h-11 w-11 rounded-sm hover:bg-subtle"
            onClick={() => setIndex((current + 1) % count)}
          >
            →
          </button>
          <button
            className="rounded-sm px-3 py-2 text-xs text-fg-secondary"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? t.play : t.pause}
          </button>
        </div>
      )}
    </section>
  );
}

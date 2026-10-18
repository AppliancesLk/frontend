import { useState } from 'react';
import { translations } from '../../utils/translations';
import { imageUrl } from '../../utils/imageUrl';
export function ProductImage({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (!src || failedSource === src)
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 bg-slate-50 text-slate-400 ${className}`}
        role="img"
        aria-label={`${alt}: ${translations.productDetails.noImage}`}
      >
        <svg
          aria-hidden="true"
          className="h-10 w-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 48 48"
        >
          <rect x="7" y="7" width="34" height="34" rx="5" />
          <circle cx="17" cy="18" r="3" />
          <path d="m8 34 11-11 8 8 6-6 8 9" />
        </svg>
        <span className="px-2 text-center text-xs">
          {translations.productDetails.noImage}
        </span>
      </div>
    );
  return (
    <img
      src={imageUrl(src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailedSource(src)}
      className={`object-contain ${className}`}
    />
  );
}

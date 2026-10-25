import { useId } from 'react';
import { translations } from '../../utils/translations';
export function Rating({
  average,
  count,
}: {
  average: string | number;
  count: number;
}) {
  const id = useId();
  const rating = Math.min(5, Math.max(0, Number(average)));
  return (
    <span
      className="inline-flex flex-wrap items-center gap-1.5 text-xs"
      aria-label={
        count
          ? `${rating.toFixed(1)} out of 5, ${count} reviews`
          : translations.experience.noRatings
      }
    >
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <svg key={index} viewBox="0 0 20 20" className="h-3.5 w-3.5">
            <defs>
              <linearGradient id={`${id}-${index}`}>
                <stop
                  offset={`${Math.min(1, Math.max(0, rating - index)) * 100}%`}
                  stopColor="var(--star)"
                />
                <stop
                  offset={`${Math.min(1, Math.max(0, rating - index)) * 100}%`}
                  stopColor="var(--border-default)"
                />
              </linearGradient>
            </defs>
            <path
              d="m10 1 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L1.2 7.4l6.1-.9Z"
              fill={`url(#${id}-${index})`}
            />
          </svg>
        ))}
      </span>
      {count > 0 ? (
        <>
          <span className="font-semibold text-fg">{rating.toFixed(1)}</span>
          <span className="text-fg-muted">({count.toLocaleString()})</span>
        </>
      ) : (
        <span className="text-fg-muted">
          {translations.experience.noRatings}
        </span>
      )}
    </span>
  );
}

export function BrandLogo({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={`brand-logo ${inverse ? 'brand-logo-inverse' : ''}`}>
      <svg
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        className="h-9 w-9 shrink-0"
      >
        <rect
          x="2"
          y="2"
          width="32"
          height="32"
          rx="9"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M13 9v6m10-6v6M10 15h16v3a8 8 0 0 1-16 0v-3Zm8 11v4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="28" cy="8" r="2" className="brand-spark" />
      </svg>
      {!compact && (
        <span className="brand-wordmark">
          Appliances<span className="brand-domain">.lk</span>
        </span>
      )}
    </span>
  );
}

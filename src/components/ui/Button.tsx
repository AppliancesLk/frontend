import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Feedback';
export function Button({
  variant = 'primary',
  busy = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      {...props}
      aria-busy={busy || undefined}
      disabled={disabled || busy}
      className={`ui-button ui-button-${variant} ${className}`}
    >
      {busy && <Spinner />}
      {children}
    </button>
  );
}

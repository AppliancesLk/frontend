import type { ReactNode } from 'react';
import { Icon, type IconName } from '../common/Icon';
import { uiText } from '../../utils/uiText';
import type { Severity } from './StatusBadge';
export function Spinner({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`ui-spinner ${className}`} />;
}
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`ui-skeleton ${className}`} />;
}
export function LoadingState({
  label = uiText.loading,
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`ui-loading ${compact ? 'ui-loading-compact' : ''}`}
    >
      <Spinner />
      <span>{label}</span>
      {!compact && (
        <div aria-hidden="true" className="mt-3 grid w-full max-w-lg gap-3">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      )}
    </div>
  );
}
export function Alert({
  children,
  severity = 'danger',
  className = '',
}: {
  children: ReactNode;
  severity?: Severity;
  className?: string;
}) {
  return (
    <div
      role={severity === 'danger' ? 'alert' : 'status'}
      className={`ui-alert ui-tone-${severity} ${className}`}
    >
      <Icon
        name={severity === 'success' ? 'check' : 'info'}
        className="mt-0.5 h-5 w-5 shrink-0"
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
export function ErrorState({
  message,
  retry,
  title = uiText.error,
}: {
  message: string;
  retry?: () => void;
  title?: string;
}) {
  return (
    <section role="alert" className="ui-state">
      <span className="ui-state-icon bg-red-50 text-red-600">
        <Icon name="info" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
      {retry && (
        <button
          type="button"
          className="ui-button ui-button-secondary mt-5"
          onClick={retry}
        >
          {uiText.retry}
        </button>
      )}
    </section>
  );
}
export function EmptyState({
  title = uiText.empty,
  description,
  action,
  icon = 'bag',
  headingAs = 'h2',
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: IconName;
  headingAs?: 'h1' | 'h2';
}) {
  const Heading = headingAs;
  return (
    <section className="ui-state">
      <span className="ui-state-icon bg-blue-50 text-blue-700">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <Heading className="mt-4 text-lg font-semibold text-slate-900">
        {title}
      </Heading>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}

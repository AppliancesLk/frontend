import { useAuth } from '../../hooks/useAuth';
import { translations } from '../../utils/translations';
export function AccountDetails() {
  const { user } = useAuth();
  return (
    <dl className="my-8 divide-y divide-line-subtle rounded-md border border-line px-5">
      <div className="py-4">
        <dt className="text-xs tracking-wide text-fg-muted">
          {translations.auth.email}
        </dt>
        <dd className="mt-1 break-all font-medium text-fg">{user?.email}</dd>
      </div>
      <div className="py-4">
        <dt className="text-xs tracking-wide text-fg-muted">
          {translations.auth.accountRole}
        </dt>
        <dd className="mt-2">
          <span className="rounded-full bg-subtle px-3 py-1 text-xs font-semibold text-fg-secondary">
            {user?.role}
          </span>
        </dd>
      </div>
    </dl>
  );
}

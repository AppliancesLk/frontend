import { useAuth } from '../../hooks/useAuth';
import { translations } from '../../utils/translations';
export function AccountDetails() {
  const { user } = useAuth();
  return (
    <dl className="my-8 divide-y divide-slate-100 rounded-xl border border-slate-200 px-5">
      <div className="py-4">
        <dt className="text-xs uppercase tracking-wide text-slate-500">
          {translations.auth.email}
        </dt>
        <dd className="mt-1 break-all font-medium text-slate-900">
          {user?.email}
        </dd>
      </div>
      <div className="py-4">
        <dt className="text-xs uppercase tracking-wide text-slate-500">
          {translations.auth.accountRole}
        </dt>
        <dd className="mt-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {user?.role}
          </span>
        </dd>
      </div>
    </dl>
  );
}

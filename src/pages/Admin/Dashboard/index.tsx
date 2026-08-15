import { useAuth } from '../../../hooks/useAuth';
import { AccountDetails } from '../../../components/common/AccountDetails';
import { translations } from '../../../utils/translations';
export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <section className="max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
        {translations.auth.adminWorkspace}
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        {translations.auth.hello}, {user?.username}
      </h1>
      <p className="mt-3 text-slate-500">
        {translations.auth.workspaceDescription}
      </p>
      <AccountDetails />
    </section>
  );
}

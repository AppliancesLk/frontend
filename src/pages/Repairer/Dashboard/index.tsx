import { useAuth } from '../../../hooks/useAuth';
import { AccountDetails } from '../../../components/common/AccountDetails';
import { translations } from '../../../utils/translations';
export default function RepairerDashboardPage() {
  const { user } = useAuth();
  return (
    <main className="bg-slate-50 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          {translations.auth.repairerWorkspace}
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          {translations.auth.hello}, {user?.username}
        </h1>
        <p className="mt-3 text-slate-500">
          {translations.auth.workspaceDescription}
        </p>
        <AccountDetails />
      </section>
    </main>
  );
}

import { uiText } from '../../../utils/uiText';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { AccountDetails } from '../../../components/common/AccountDetails';
import { translations } from '../../../utils/translations';
import { ROUTES } from '../../../constants/routes';

export default function RepairerDashboardPage() {
  const { user } = useAuth();
  return (
    <main className="bg-slate-50 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
            {translations.auth.repairerWorkspace}
          </p>
          <h1 className="ui-page-title mt-3    text-slate-900">
            {translations.auth.hello}, {user?.username}
          </h1>
          <p className="mt-3 text-slate-500">
            {uiText.repairerDescription}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to={ROUTES.repairerRepairs}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700">
                {uiText.assignedRepairs}
              </h2>
              <svg
                className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {uiText.assignedDescription}
            </p>
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            {uiText.account}
          </h2>
          <AccountDetails />
        </div>
      </section>
    </main>
  );
}

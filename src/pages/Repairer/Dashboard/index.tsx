import { uiText } from '../../../utils/uiText';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { AccountDetails } from '../../../components/common/AccountDetails';
import { translations } from '../../../utils/translations';
import { ROUTES } from '../../../constants/routes';

export default function RepairerDashboardPage() {
  const { user } = useAuth();
  return (
    <main className="bg-page px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-md border border-line bg-surface p-6 ">
          <h1 className="ui-page-title mt-3    text-fg">
            {translations.auth.hello}, {user?.username}
          </h1>
          <p className="mt-3 text-fg-muted">{uiText.repairerDescription}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to={ROUTES.repairerRepairs}
            className="group rounded-md border border-line bg-surface p-6  transition-all hover:border-primary "
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-fg group-hover:text-fg-link">
                {uiText.assignedRepairs}
              </h2>
              <svg
                className="h-5 w-5 text-fg-muted transition-transform group-hover:translate-x-1 group-hover:text-fg-link"
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
            <p className="mt-2 text-sm text-fg-muted">
              {uiText.assignedDescription}
            </p>
          </Link>
        </div>

        <div className="rounded-md border border-line bg-surface p-6 ">
          <h2 className="text-lg font-semibold text-fg">{uiText.account}</h2>
          <AccountDetails />
        </div>
      </section>
    </main>
  );
}

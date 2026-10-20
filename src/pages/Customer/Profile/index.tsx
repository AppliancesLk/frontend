import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { AccountDetails } from '../../../components/common/AccountDetails';
import { ROUTES } from '../../../constants/routes';
import { USER_ROLES } from '../../../constants/roles';
import { translations } from '../../../utils/translations';
export default function ProfilePage() {
  const { user, hasRole } = useAuth();
  return (
    <main className="bg-slate-50 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          {translations.auth.yourAccount}
        </p>
        <h1 className="ui-page-title mt-3    text-slate-900">
          {translations.auth.hello}, {user?.username}
        </h1>
        <p className="mt-3 text-slate-500">
          {translations.auth.signedInDescription}
        </p>
        <AccountDetails />
        <div className="flex flex-wrap gap-3">
          <Link to={ROUTES.products} className="auth-primary">
            {translations.common.continueShopping}
          </Link>
          {hasRole(USER_ROLES.ADMIN) && (
            <Link className="auth-secondary" to={ROUTES.admin}>
              {translations.auth.adminWorkspace}
            </Link>
          )}
          {hasRole(USER_ROLES.REPAIRER) && (
            <Link className="auth-secondary" to={ROUTES.repairer}>
              {translations.auth.repairerWorkspace}
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

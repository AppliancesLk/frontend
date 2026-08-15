import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { translations } from '../../../utils/translations';
export default function ForbiddenPage() {
  return (
    <main className="px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
        {translations.auth.accessRestricted}
      </h1>
      <p className="my-4 text-slate-500">{translations.auth.accessDenied}</p>
      <Link className="auth-primary" to={ROUTES.account}>
        {translations.auth.backToAccount}
      </Link>
    </main>
  );
}

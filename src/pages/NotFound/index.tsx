import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
export default function NotFoundPage() {
  return (
    <main className="p-16 text-center">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        {translations.common.notFound}
      </h1>
      <Link className="auth-primary" to={ROUTES.products}>
        {translations.common.backToShop}
      </Link>
    </main>
  );
}

import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
import { uiText } from '../../utils/uiText';
import { EmptyState } from '../../components/ui/Feedback';
export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <p className="mb-6 text-center text-xs font-semibold tracking-normal text-fg-link">
        404
      </p>
      <EmptyState
        headingAs="h1"
        icon="search"
        title={translations.common.notFound}
        description={uiText.notFoundDescription}
        action={
          <Link className="auth-primary" to={ROUTES.products}>
            {translations.common.backToShop}
          </Link>
        }
      />
    </main>
  );
}

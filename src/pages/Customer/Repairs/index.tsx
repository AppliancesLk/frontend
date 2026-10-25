import { EmptyState } from '../../../components/ui/Feedback';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import { translations } from '../../../utils/translations';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { useCustomerRepairsPage } from './hooks/useCustomerRepairsPage';
import { CustomerRepairsTable } from './components/CustomerRepairsTable';

const t = translations.repairs;

export default function RepairsPage() {
  const { user } = useAuth();
  return user ? <RepairsContent key={user.id} /> : null;
}

function RepairsContent() {
  const page = useCustomerRepairsPage();

  useEffect(() => {
    const previous = document.title;
    document.title = `${t.title} | ${translations.common.storeName}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="bg-page px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav
          aria-label={translations.productDetails.breadcrumb}
          className="text-sm"
        >
          <ol className="flex items-center gap-2 text-fg-muted">
            <li>
              <Link
                to={ROUTES.products}
                className="font-medium text-fg-link hover:text-fg-link"
              >
                {translations.productDetails.products}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{t.title}</li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="ui-page-title text-fg">{t.title}</h1>
            <p className="mt-2 text-sm text-fg-muted">{t.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void page.refresh()}
              disabled={page.loading}
              className="auth-secondary"
            >
              Refresh
            </button>
            <Link to={ROUTES.repairRequest} className="auth-primary">
              {t.requestTitle}
            </Link>
          </div>
        </div>

        <CatalogFeedback
          loading={page.loading}
          error={page.error}
          retry={page.refresh}
        />

        {!page.loading && !page.error && (
          <>
            {page.repairs.length === 0 ? (
              <EmptyState
                title={'No repair tickets found'}
                description={"You haven't submitted any repair requests yet."}
                action={
                  <Link
                    to={ROUTES.repairRequest}
                    className="mt-4 inline-block text-sm font-medium text-fg-link hover:text-fg-link"
                  >
                    {t.requestTitle}
                  </Link>
                }
                icon="repair"
              />
            ) : (
              <CustomerRepairsTable repairs={page.repairs} />
            )}
          </>
        )}
      </div>
    </main>
  );
}

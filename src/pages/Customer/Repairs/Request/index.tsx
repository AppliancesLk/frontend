import { RatingPlate } from '../../../../components/common/RatingPlate';
import { Icon } from '../../../../components/common/Icon';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
import { useRepairRequest } from './hooks/useRepairRequest';
import { RepairRequestForm } from './components/RepairRequestForm';
import { RepairSuccess } from './components/RepairSuccess';

const t = translations.repairs;

export default function RepairRequestPage() {
  const { user } = useAuth();
  return user ? <RepairRequestContent key={user.id} /> : null;
}

function RepairRequestContent() {
  const page = useRepairRequest();

  useEffect(() => {
    const previous = document.title;
    document.title = `${t.requestTitle} | ${translations.common.storeName}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="bg-page px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-8">
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
            <li>
              <Link
                to={ROUTES.repairs}
                className="font-medium text-fg-link hover:text-fg-link"
              >
                {t.title}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{t.requestTitle}</li>
          </ol>
        </nav>

        <div>
          <h1 className="ui-page-title text-fg">{t.requestTitle}</h1>
          <p className="mt-2 text-sm text-fg-muted">{t.requestDescription}</p>
        </div>

        {page.createdTicket ? (
          <RepairSuccess ticket={page.createdTicket} />
        ) : (
          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,760px)_minmax(0,320px)]">
            <RepairRequestForm page={page} />
            <aside className="space-y-6 xl:sticky xl:top-24">
              <div className="rounded-md border border-line bg-surface p-5">
                <h2 className="text-lg font-semibold">
                  Find your device details
                </h2>
                <p className="mt-3 text-sm leading-6 text-fg-secondary">
                  Look for a small rating plate on the back, base or inside the
                  door of your appliance. On a phone, look in Settings → About
                  phone.
                </p>
                <div className="mt-5">
                  <RatingPlate
                    title="Your device"
                    rows={[
                      { label: 'Model', value: 'Look for “Model” or “Mod.”' },
                      {
                        label: 'Serial number',
                        value: 'Look for “S/N” or “Serial”',
                      },
                    ]}
                    footer="An example of the information to look for."
                  />
                </div>
              </div>
              <div className="rounded-md border border-line bg-surface p-5">
                <h2 className="text-lg font-semibold">What happens next</h2>
                <ul className="mt-5 space-y-5 text-sm text-fg-secondary">
                  <li className="flex gap-3">
                    <Icon
                      name="orders"
                      className="h-5 w-5 shrink-0 text-fg-link"
                    />
                    Our team reviews your request.
                  </li>
                  <li className="flex gap-3">
                    <Icon
                      name="repair"
                      className="h-5 w-5 shrink-0 text-fg-link"
                    />
                    We update you as the repair progresses.
                  </li>
                  <li className="flex gap-3">
                    <Icon
                      name="check"
                      className="h-5 w-5 shrink-0 text-fg-link"
                    />
                    Track everything in Your repairs.
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

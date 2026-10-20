import { formatDate } from '../../../../utils/date';
import { LoadingState } from '../../../../components/ui/Feedback';
import { useEffect } from 'react';
import { translations } from '../../../../utils/translations';
import { useAdminRepairDetails } from './hooks/useAdminRepairDetails';
import { ActionDialog } from './components/ActionDialog';
import { RepairStatusBadge } from '../components/RepairStatusBadge';

const t = translations.adminRepairs;

export default function AdminRepairDetailsPage() {
  const page = useAdminRepairDetails();

  useEffect(() => {
    const previous = document.title;
    document.title = `${t.detailsTitle} | ${translations.common.storeName}`;
    return () => {
      document.title = previous;
    };
  }, []);

  if (page.loading) {
    return (
      <section className="space-y-6">
        <LoadingState />
      </section>
    );
  }

  if (page.error) {
    return (
      <section className="space-y-6">
        <div
          role="alert"
          className="rounded-md border border-danger/25 bg-danger-bg p-8 text-center "
        >
          <p className="font-medium text-danger">{t.notFound}</p>
          <p className="mt-2 text-sm text-danger">{page.error}</p>
          <button
            type="button"
            onClick={() => void page.refresh()}
            className="mt-4 auth-secondary"
          >
            {translations.common.retry}
          </button>
        </div>
      </section>
    );
  }

  if (!page.repair) {
    return null;
  }

  const isPending = page.repair.status === 'PENDING';

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={page.goBack}
              className="mb-2 text-sm font-medium text-fg-link hover:text-fg-link"
            >
              ← {t.back}
            </button>
            <h1 className="ui-page-title text-fg">{t.detailsTitle}</h1>
            <p className="mt-1 tabular-nums text-sm text-fg-muted">
              {page.repair.reference}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void page.refresh()}
            disabled={page.processing}
            className="auth-secondary"
          >
            {t.refresh}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-line bg-surface p-6 ">
            <h2 className="text-lg font-semibold text-fg">{t.customer}</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-sm font-medium text-fg-muted">Username</dt>
                <dd className="mt-1 text-sm text-fg">
                  {page.repair.customer.username}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-fg-muted">Email</dt>
                <dd className="mt-1 text-sm text-fg">
                  {page.repair.customer.email}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-md border border-line bg-surface p-6 ">
            <h2 className="text-lg font-semibold text-fg">{t.status}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <dt className="text-sm font-medium text-fg-muted">
                  Current status
                </dt>
                <dd className="mt-2">
                  <RepairStatusBadge status={page.repair.status} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-fg-muted">
                  {t.submittedDate}
                </dt>
                <dd className="mt-1 text-sm text-fg">
                  {formatDate(page.repair.createdAt)}
                </dd>
              </div>
              {page.repair.reviewedAt && (
                <div>
                  <dt className="text-sm font-medium text-fg-muted">
                    {t.reviewedDate}
                  </dt>
                  <dd className="mt-1 text-sm text-fg">
                    {formatDate(page.repair.reviewedAt)}
                  </dd>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-md border border-line bg-surface p-6 ">
          <h2 className="text-lg font-semibold text-fg">{t.deviceInfo}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-fg-muted">
                {t.deviceType}
              </dt>
              <dd className="mt-1 text-sm text-fg">
                {page.repair.device.deviceType}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-fg-muted">{t.brand}</dt>
              <dd className="mt-1 text-sm text-fg">
                {page.repair.device.brand}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-fg-muted">{t.model}</dt>
              <dd className="mt-1 text-sm text-fg">
                {page.repair.device.model}
              </dd>
            </div>
            {page.repair.device.serialNumber && (
              <div>
                <dt className="text-sm font-medium text-fg-muted">
                  {t.serialNumber}
                </dt>
                <dd className="mt-1 text-sm text-fg">
                  {page.repair.device.serialNumber}
                </dd>
              </div>
            )}
            {page.repair.device.purchaseDate && (
              <div>
                <dt className="text-sm font-medium text-fg-muted">
                  {t.purchaseDate}
                </dt>
                <dd className="mt-1 text-sm text-fg">
                  {page.repair.device.purchaseDate}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-md border border-line bg-surface p-6 ">
          <h2 className="text-lg font-semibold text-fg">{t.problem}</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-fg-secondary">
            {page.repair.problemDescription}
          </p>
        </div>

        {isPending && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => page.setAction('approve')}
              disabled={page.processing}
              className="auth-primary bg-success hover:bg-success flex-1"
            >
              {t.approve}
            </button>
            <button
              type="button"
              onClick={() => page.setAction('reject')}
              disabled={page.processing}
              className="auth-primary bg-danger hover:bg-danger flex-1"
            >
              {t.reject}
            </button>
          </div>
        )}
      </section>

      <ActionDialog page={page} />
    </>
  );
}

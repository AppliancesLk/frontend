import { useEffect } from 'react';
import { translations } from '../../../../utils/translations';
import { useAdminRepairDetails } from './hooks/useAdminRepairDetails';
import { ActionDialog } from './components/ActionDialog';
import { RepairStatusBadge } from '../components/RepairStatusBadge';

const t = translations.adminRepairs;

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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
      <main className="space-y-6">
        <div role="status" className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">{t.loading}</p>
          <div aria-hidden="true" className="mt-6 space-y-4 motion-safe:animate-pulse">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-20 rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (page.error) {
    return (
      <main className="space-y-6">
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="font-medium text-red-900">{t.notFound}</p>
          <p className="mt-2 text-sm text-red-700">{page.error}</p>
          <button
            type="button"
            onClick={() => void page.refresh()}
            className="mt-4 auth-secondary"
          >
            {translations.common.retry}
          </button>
        </div>
      </main>
    );
  }

  if (!page.repair) {
    return null;
  }

  const isPending = page.repair.status === 'PENDING';

  return (
    <>
      <main className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={page.goBack}
              className="mb-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← {t.back}
            </button>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {t.detailsTitle}
            </h1>
            <p className="mt-1 font-mono text-sm text-slate-500">
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
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{t.customer}</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-sm font-medium text-slate-500">Username</dt>
                <dd className="mt-1 text-sm text-slate-900">{page.repair.customer.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Email</dt>
                <dd className="mt-1 text-sm text-slate-900">{page.repair.customer.email}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{t.status}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <dt className="text-sm font-medium text-slate-500">Current status</dt>
                <dd className="mt-2">
                  <RepairStatusBadge status={page.repair.status} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">{t.submittedDate}</dt>
                <dd className="mt-1 text-sm text-slate-900">{formatDate(page.repair.createdAt)}</dd>
              </div>
              {page.repair.reviewedAt && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">{t.reviewedDate}</dt>
                  <dd className="mt-1 text-sm text-slate-900">{formatDate(page.repair.reviewedAt)}</dd>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{t.deviceInfo}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">{t.deviceType}</dt>
              <dd className="mt-1 text-sm text-slate-900">{page.repair.device.deviceType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">{t.brand}</dt>
              <dd className="mt-1 text-sm text-slate-900">{page.repair.device.brand}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">{t.model}</dt>
              <dd className="mt-1 text-sm text-slate-900">{page.repair.device.model}</dd>
            </div>
            {page.repair.device.serialNumber && (
              <div>
                <dt className="text-sm font-medium text-slate-500">{t.serialNumber}</dt>
                <dd className="mt-1 text-sm text-slate-900">{page.repair.device.serialNumber}</dd>
              </div>
            )}
            {page.repair.device.purchaseDate && (
              <div>
                <dt className="text-sm font-medium text-slate-500">{t.purchaseDate}</dt>
                <dd className="mt-1 text-sm text-slate-900">{page.repair.device.purchaseDate}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{t.problem}</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">{page.repair.problemDescription}</p>
        </div>

        {isPending && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => page.setAction('approve')}
              disabled={page.processing}
              className="auth-primary bg-green-600 hover:bg-green-700 flex-1"
            >
              {t.approve}
            </button>
            <button
              type="button"
              onClick={() => page.setAction('reject')}
              disabled={page.processing}
              className="auth-primary bg-red-600 hover:bg-red-700 flex-1"
            >
              {t.reject}
            </button>
          </div>
        )}
      </main>

      <ActionDialog page={page} />
    </>
  );
}

import { RatingPlate } from '../../../../components/common/RatingPlate';
import { CopyReference } from '../../../../components/common/CopyReference';
import { formatDate } from '../../../../utils/date';
import { LoadingState } from '../../../../components/ui/Feedback';
import { useEffect } from 'react';
import { useCustomerRepairDetails } from './hooks/useCustomerRepairDetails';
import { RepairStatusBadge } from '../../../Admin/Repairs/components/RepairStatusBadge';
import { getStatusLabel } from '../../../../utils/statusTransitions';

export default function CustomerRepairDetailsPage() {
  const page = useCustomerRepairDetails();

  useEffect(() => {
    const previous = document.title;
    document.title = 'Repair details | Appliances LK';
    return () => {
      document.title = previous;
    };
  }, []);

  if (page.loading) {
    return (
      <main className="bg-page px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <LoadingState />
        </div>
      </main>
    );
  }

  if (page.error) {
    return (
      <main className="bg-page px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div
            role="alert"
            className="rounded-md border border-danger/25 bg-danger-bg p-8 text-center "
          >
            <p className="font-medium text-danger">Repair not found</p>
            <p className="mt-2 text-sm text-danger">{page.error}</p>
            <button
              type="button"
              onClick={() => void page.refresh()}
              className="mt-4 auth-secondary"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!page.repair) {
    return null;
  }

  return (
    <main className="bg-page px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={page.goBack}
              className="mb-2 text-sm font-medium text-fg-link hover:text-fg-link"
            >
              ← Back to your repairs
            </button>
            <h1 className="ui-page-title text-fg">Repair details</h1>
            <p className="mt-1 tabular-nums text-sm text-fg-muted">
              {page.repair.reference}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void page.refresh()}
            className="auth-secondary"
          >
            Refresh
          </button>
        </div>

        <RatingPlate
          title={page.repair.reference}
          rows={[
            {
              label: 'Reference',
              value: (
                <span className="flex items-center gap-2">
                  {page.repair.reference}
                  <CopyReference value={page.repair.reference} />
                </span>
              ),
            },
            {
              label: 'Device',
              value: `${page.repair.device.brand} ${page.repair.device.model}`,
            },
            {
              label: 'Serial number',
              value: page.repair.device.serialNumber || 'Not provided',
            },
            { label: 'Submitted', value: formatDate(page.repair.createdAt) },
          ]}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-line bg-surface p-6 ">
            <h2 className="text-lg font-semibold text-fg">Current status</h2>
            <div className="mt-4">
              <RepairStatusBadge status={page.repair.status} />
              <p className="mt-3 text-sm text-fg-secondary">
                {getStatusDescription(page.repair.status)}
              </p>
            </div>
          </div>

          <div className="rounded-md border border-line bg-surface p-6 ">
            <h2 className="text-lg font-semibold text-fg">
              Device information
            </h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-sm font-medium text-fg-muted">Type</dt>
                <dd className="mt-1 text-sm text-fg">
                  {page.repair.device.deviceType}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-fg-muted">Brand</dt>
                <dd className="mt-1 text-sm text-fg">
                  {page.repair.device.brand}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-fg-muted">Model</dt>
                <dd className="mt-1 text-sm text-fg">
                  {page.repair.device.model}
                </dd>
              </div>
              {page.repair.device.serialNumber && (
                <div>
                  <dt className="text-sm font-medium text-fg-muted">
                    Serial Number
                  </dt>
                  <dd className="mt-1 tabular-nums text-sm text-fg">
                    {page.repair.device.serialNumber}
                  </dd>
                </div>
              )}
              {page.repair.device.purchaseDate && (
                <div>
                  <dt className="text-sm font-medium text-fg-muted">
                    Purchase Date
                  </dt>
                  <dd className="mt-1 text-sm text-fg">
                    {new Date(
                      page.repair.device.purchaseDate,
                    ).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="rounded-md border border-line bg-surface p-6 ">
          <h2 className="text-lg font-semibold text-fg">Problem Description</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-fg-secondary">
            {page.repair.problemDescription}
          </p>
        </div>

        <div className="rounded-md border border-line bg-surface p-6 ">
          <h2 className="text-lg font-semibold text-fg">Repair Timeline</h2>
          <div className="mt-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-subtle">
                <svg
                  className="h-4 w-4 text-fg-link"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-fg">Repair Submitted</p>
                <p className="text-sm text-fg-muted">
                  {formatDate(page.repair.createdAt)}
                </p>
              </div>
            </div>

            {page.repair.reviewedAt && (
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-subtle">
                  <svg
                    className="h-4 w-4 text-fg-link"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-fg">
                    Reviewed by Admin
                  </p>
                  <p className="text-sm text-fg-muted">
                    {formatDate(page.repair.reviewedAt)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                  [
                    'IN_PROGRESS',
                    'AWAITING_PARTS',
                    'READY_FOR_COLLECTION',
                    'COMPLETED',
                  ].includes(page.repair.status)
                    ? 'bg-primary-subtle'
                    : 'bg-subtle'
                }`}
              >
                {[
                  'IN_PROGRESS',
                  'AWAITING_PARTS',
                  'READY_FOR_COLLECTION',
                  'COMPLETED',
                ].includes(page.repair.status) ? (
                  <svg
                    className="h-4 w-4 text-fg-link"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-sunken" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    [
                      'IN_PROGRESS',
                      'AWAITING_PARTS',
                      'READY_FOR_COLLECTION',
                      'COMPLETED',
                    ].includes(page.repair.status)
                      ? 'text-fg'
                      : 'text-fg-muted'
                  }`}
                >
                  In repair
                </p>
                {[
                  'IN_PROGRESS',
                  'AWAITING_PARTS',
                  'READY_FOR_COLLECTION',
                  'COMPLETED',
                ].includes(page.repair.status) && (
                  <p className="text-sm text-fg-muted">
                    Currently: {getStatusLabel(page.repair.status)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                  page.repair.status === 'COMPLETED'
                    ? 'bg-success-bg'
                    : 'bg-subtle'
                }`}
              >
                {page.repair.status === 'COMPLETED' ? (
                  <svg
                    className="h-4 w-4 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-sunken" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    page.repair.status === 'COMPLETED'
                      ? 'text-fg'
                      : 'text-fg-muted'
                  }`}
                >
                  Repair completed
                </p>
                {page.repair.status === 'COMPLETED' && (
                  <p className="text-sm text-fg-muted">
                    {formatDate(page.repair.updatedAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-line bg-surface p-6 ">
          <h2 className="text-lg font-semibold text-fg">
            Important information
          </h2>
          <div className="mt-4 space-y-3 text-sm text-fg-secondary">
            <p>
              • Your repair ticket reference is:{' '}
              <span className="tabular-nums font-medium">
                {page.repair.reference}
              </span>
            </p>
            <p>
              • Please keep this reference for any inquiries about your repair.
            </p>
            {page.repair.status === 'READY_FOR_COLLECTION' && (
              <p className="font-medium text-success">
                • Your device is ready for collection! Please visit our service
                center.
              </p>
            )}
            {page.repair.status === 'PENDING' && (
              <p>
                • Your repair request is pending admin review. We'll update the
                status soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    PENDING:
      'Your repair request is under review. Our team will approve it shortly.',
    APPROVED:
      'Your repair has been approved and will be assigned to a technician soon.',
    REJECTED:
      'Unfortunately, your repair request has been rejected. Please contact support for more information.',
    ASSIGNED:
      'Your repair has been assigned to a technician and will begin shortly.',
    IN_PROGRESS: 'Our technician is currently working on your device.',
    AWAITING_PARTS:
      'We are waiting for spare parts to arrive to complete your repair.',
    READY_FOR_COLLECTION:
      'Great news! Your repair is complete and ready for collection.',
    COMPLETED:
      'Your repair has been completed and your device has been collected.',
    CANCELLED: 'This repair request has been cancelled.',
  };

  return descriptions[status] || 'Status information not available.';
}

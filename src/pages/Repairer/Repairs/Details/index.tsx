import { formatDate } from '../../../../utils/date';
import { Dialog } from '../../../../components/ui/Dialog';
import { Spinner } from '../../../../components/ui/Feedback';
import { LoadingState } from '../../../../components/ui/Feedback';
import { useEffect, useState } from 'react';
import { useRepairerRepairDetails } from './hooks/useRepairerRepairDetails';
import { RepairStatusBadge } from '../../../Admin/Repairs/components/RepairStatusBadge';
import {
  getValidNextStatuses,
  getStatusLabel,
} from '../../../../utils/statusTransitions';
import type { RepairStatus } from '../../../../types/repair.types';

export default function RepairerRepairDetailsPage() {
  const page = useRepairerRepairDetails();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RepairStatus | null>(
    null,
  );

  useEffect(() => {
    const previous = document.title;
    document.title = 'Repair Details | Appliances LK';
    return () => {
      document.title = previous;
    };
  }, []);

  const handleStatusUpdate = async () => {
    if (selectedStatus) {
      await page.updateStatus(selectedStatus);
      if (!page.updateError) {
        setShowStatusDialog(false);
        setSelectedStatus(null);
      }
    }
  };

  if (page.loading) {
    return (
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <LoadingState />
      </main>
    );
  }

  if (page.error) {
    return (
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <div
          role="alert"
          className="rounded-md border border-danger/25 bg-danger-bg p-8 text-center "
        >
          <p className="font-medium text-danger">Repair Not Found</p>
          <p className="mt-2 text-sm text-danger">{page.error}</p>
          <button
            type="button"
            onClick={() => void page.refresh()}
            className="mt-4 auth-secondary"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!page.repair) {
    return null;
  }

  const validNextStatuses = getValidNextStatuses(page.repair.status);
  const canUpdateStatus = validNextStatuses.length > 0;

  return (
    <>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={page.goBack}
              className="mb-2 text-sm font-medium text-fg-link hover:text-fg-link"
            >
              ← Back to Repairs
            </button>
            <h1 className="ui-page-title text-fg">Repair Details</h1>
            <p className="mt-1 tabular-nums text-sm text-fg-muted">
              {page.repair.reference}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void page.refresh()}
              disabled={page.processing}
              className="auth-secondary"
            >
              Refresh
            </button>
            {canUpdateStatus && (
              <button
                type="button"
                onClick={() => setShowStatusDialog(true)}
                disabled={page.processing}
                className="ui-button ui-button-primary rounded-sm border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-on  hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed "
              >
                Update Status
              </button>
            )}
          </div>
        </div>

        {page.updateError && (
          <div
            role="alert"
            className="rounded-sm border border-danger/25 bg-danger-bg p-4"
          >
            <p className="text-sm text-danger">{page.updateError}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-line bg-surface p-6 ">
            <h2 className="text-lg font-semibold text-fg">Customer</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-sm font-medium text-fg-muted">Name</dt>
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
            <h2 className="text-lg font-semibold text-fg">Device</h2>
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
          <h2 className="text-lg font-semibold text-fg">Status</h2>
          <div className="mt-4 flex items-center gap-4">
            <RepairStatusBadge status={page.repair.status} />
            {canUpdateStatus && (
              <p className="text-sm text-fg-muted">
                Can be updated to:{' '}
                {validNextStatuses.map(getStatusLabel).join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-md border border-line bg-surface p-6 ">
          <h2 className="text-lg font-semibold text-fg">Timeline</h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm font-medium text-fg-muted">Created</dt>
              <dd className="mt-1 text-sm text-fg">
                {formatDate(page.repair.createdAt)}
              </dd>
            </div>
            {page.repair.reviewedAt && (
              <div>
                <dt className="text-sm font-medium text-fg-muted">Reviewed</dt>
                <dd className="mt-1 text-sm text-fg">
                  {formatDate(page.repair.reviewedAt)}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-fg-muted">
                Last Updated
              </dt>
              <dd className="mt-1 text-sm text-fg">
                {formatDate(page.repair.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      </main>

      {showStatusDialog && (
        <Dialog
          open
          onClose={() => {
            setShowStatusDialog(false);
            setSelectedStatus(null);
          }}
          title={'Update repair status'}
          description={'Select the next status for this repair ticket.'}
          busy={page.processing}
        >
          <div className="mt-4 space-y-2">
            {validNextStatuses.map((status) => (
              <button
                key={status}
                type="button"
                aria-pressed={selectedStatus === status}
                onClick={() => setSelectedStatus(status)}
                className={`w-full rounded-sm border p-3 text-left text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'border-primary bg-primary-subtle text-fg-link'
                    : 'border-line bg-surface text-fg hover:bg-page'
                }`}
              >
                <RepairStatusBadge status={status} />
                <p className="mt-1 text-xs text-fg-muted">
                  {getStatusDescription(status)}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowStatusDialog(false);
                setSelectedStatus(null);
              }}
              disabled={page.processing}
              className="flex-1 auth-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleStatusUpdate()}
              disabled={!selectedStatus || page.processing}
              className="ui-button ui-button-primary flex-1 rounded-sm border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-on  hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed "
            >
              {page.processing && <Spinner className="mr-2" />}
              {page.processing ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}

function getStatusDescription(status: RepairStatus): string {
  const descriptions: Record<RepairStatus, string> = {
    PENDING: 'Repair is pending review',
    APPROVED: 'Repair has been approved',
    REJECTED: 'Repair has been rejected',
    ASSIGNED: 'Repair has been assigned',
    IN_PROGRESS: 'Currently working on the repair',
    AWAITING_PARTS: 'Waiting for spare parts to arrive',
    READY_FOR_COLLECTION: 'Repair completed, ready for customer pickup',
    COMPLETED: 'Repair completed and collected',
    CANCELLED: 'Repair has been cancelled',
  };

  return descriptions[status] || '';
}

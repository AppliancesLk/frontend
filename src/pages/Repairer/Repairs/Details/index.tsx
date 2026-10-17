import { useEffect, useState } from 'react';
import { useRepairerRepairDetails } from './hooks/useRepairerRepairDetails';
import { RepairStatusBadge } from '../../../Admin/Repairs/components/RepairStatusBadge';
import {
  getValidNextStatuses,
  getStatusLabel,
} from '../../../../utils/statusTransitions';
import type { RepairStatus } from '../../../../types/repair.types';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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
      <main className="space-y-6">
        <div
          role="status"
          className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <p className="text-sm text-slate-500">Loading repair details...</p>
          <div
            aria-hidden="true"
            className="mt-6 space-y-4 motion-safe:animate-pulse"
          >
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
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm"
        >
          <p className="font-medium text-red-900">Repair Not Found</p>
          <p className="mt-2 text-sm text-red-700">{page.error}</p>
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
      <main className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={page.goBack}
              className="mb-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to Repairs
            </button>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Repair Details
            </h1>
            <p className="mt-1 font-mono text-sm text-slate-500">
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
                className="rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Update Status
              </button>
            )}
          </div>
        </div>

        {page.updateError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <p className="text-sm text-red-700">{page.updateError}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Customer</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-sm font-medium text-slate-500">Name</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {page.repair.customer.username}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Email</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {page.repair.customer.email}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Device</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-sm font-medium text-slate-500">Type</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {page.repair.device.deviceType}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Brand</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {page.repair.device.brand}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Model</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {page.repair.device.model}
                </dd>
              </div>
              {page.repair.device.serialNumber && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">
                    Serial Number
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-slate-900">
                    {page.repair.device.serialNumber}
                  </dd>
                </div>
              )}
              {page.repair.device.purchaseDate && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">
                    Purchase Date
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {new Date(page.repair.device.purchaseDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Problem Description
          </h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">
            {page.repair.problemDescription}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Status</h2>
          <div className="mt-4 flex items-center gap-4">
            <RepairStatusBadge status={page.repair.status} />
            {canUpdateStatus && (
              <p className="text-sm text-slate-500">
                Can be updated to:{' '}
                {validNextStatuses.map(getStatusLabel).join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm font-medium text-slate-500">Created</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {formatDate(page.repair.createdAt)}
              </dd>
            </div>
            {page.repair.reviewedAt && (
              <div>
                <dt className="text-sm font-medium text-slate-500">Reviewed</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {formatDate(page.repair.reviewedAt)}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-slate-500">
                Last Updated
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {formatDate(page.repair.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      </main>

      {showStatusDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">
              Update Repair Status
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Select the new status for this repair ticket
            </p>

            <div className="mt-4 space-y-2">
              {validNextStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full rounded-lg border p-3 text-left text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <RepairStatusBadge status={status} />
                  <p className="mt-1 text-xs text-slate-500">
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
                className="flex-1 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {page.processing ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
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

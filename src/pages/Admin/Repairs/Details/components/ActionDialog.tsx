import { translations } from '../../../../../utils/translations';
import type { useAdminRepairDetails } from '../hooks/useAdminRepairDetails';

const t = translations.adminRepairs;

export function ActionDialog({
  page,
}: {
  page: ReturnType<typeof useAdminRepairDetails>;
}) {
  if (!page.action) return null;

  const isApprove = page.action === 'approve';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">
          {isApprove ? t.approveConfirm : t.rejectConfirm}
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          {isApprove ? t.approveDescription : t.rejectDescription}
        </p>

        {!isApprove && (
          <div className="mt-4">
            <label htmlFor="rejection-reason" className="auth-label">
              {t.rejectionReason}
            </label>
            <textarea
              id="rejection-reason"
              rows={3}
              maxLength={500}
              value={page.rejectionReason}
              onChange={(e) => page.setRejectionReason(e.target.value)}
              placeholder={t.rejectionReasonHint}
              disabled={page.processing}
              className="auth-input resize-none"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              {page.rejectionReason.length} / 500 characters
            </p>
          </div>
        )}

        {page.actionError && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            {page.actionError}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={() =>
              void (isApprove ? page.approveRepair() : page.rejectRepair())
            }
            disabled={page.processing}
            className={`auth-primary ${isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {page.processing
              ? isApprove
                ? t.approving
                : t.rejecting
              : t.confirmAction}
          </button>
          <button
            type="button"
            onClick={() => page.setAction(null)}
            disabled={page.processing}
            className="auth-secondary"
          >
            {t.cancelAction}
          </button>
        </div>
      </div>
    </div>
  );
}

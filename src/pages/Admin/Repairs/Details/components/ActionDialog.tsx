import { Dialog } from '../../../../../components/ui/Dialog';
import { Spinner } from '../../../../../components/ui/Feedback';
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
    <Dialog
      open
      onClose={() => page.setAction(null)}
      title={isApprove ? t.approveConfirm : t.rejectConfirm}
      description={isApprove ? t.approveDescription : t.rejectDescription}
      busy={page.processing}
    >
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
            className="ui-field auth-input resize-none"
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
          {page.processing && <Spinner className="mr-2" />}
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
    </Dialog>
  );
}

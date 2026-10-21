import { promotionText as t } from '../../../../utils/promotionText';
export function PromotionBadge({
  status,
}: {
  status?: keyof typeof t.statuses;
}) {
  const tone =
    status === 'SENT'
      ? 'bg-success-bg text-success'
      : status === 'FAILED' || status === 'UNKNOWN'
        ? 'bg-danger-bg text-danger'
        : status === 'PARTIAL'
          ? 'bg-warning-bg text-warning'
          : 'bg-subtle text-fg-secondary';
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}
    >
      {status ? t.statuses[status] : t.draft}
    </span>
  );
}

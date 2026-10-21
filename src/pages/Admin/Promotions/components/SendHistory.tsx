import { useEffect, useState } from 'react';
import type {
  PromotionRun,
  PromotionRunDetail,
} from '../../../../types/promotion.types';
import { getPromotionRun } from '../../../../services/promotionService';
import { promotionText as t } from '../../../../utils/promotionText';
import { formatDate } from '../../../../utils/date';
import { getApiError } from '../../../../utils/apiErrors';
import { Button } from '../../../../components/ui/Button';
import { EmailPreview } from './EmailPreview';
import { PromotionBadge } from './PromotionBadge';
export function SendHistory({
  id,
  runs,
}: {
  id: string;
  runs: PromotionRun[];
}) {
  const [runId, setRunId] = useState(''),
    [page, setPage] = useState(1),
    [detail, setDetail] = useState<PromotionRunDetail | null>(null),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(false),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!runId) return;
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const next = await getPromotionRun(id, runId, page, controller.signal);
        if (!controller.signal.aborted) setDetail(next);
      } catch (err) {
        if (!controller.signal.aborted)
          setError(
            getApiError(
              err,
              'Unable to load the send report. Please try again.',
            ),
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [id, runId, page, runs, revision]);
  return (
    <section className="ui-panel p-5 sm:p-6">
      <h2 className="text-lg font-semibold">{t.history}</h2>
      <p className="mt-2 text-xs leading-5 text-fg-muted">{t.historyHint}</p>
      <p className="mt-2 text-xs leading-5 text-fg-muted">{t.deliveryHint}</p>
      {!runs.length ? (
        <p className="mt-5 text-sm text-fg-muted">
          This promotion has not been sent yet.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-line">
          {runs.map((run) => (
            <li
              key={run.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <p className="text-sm font-medium">
                  {formatDate(run.createdAt)}
                </p>
                <p className="mt-1 text-xs text-fg-muted">
                  {run.counts.SENT} sent ·{' '}
                  {run.counts.QUEUED + run.counts.PROCESSING} pending ·{' '}
                  {run.counts.FAILED} failed · {run.counts.SKIPPED} skipped ·{' '}
                  {run.counts.UNKNOWN} unknown
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PromotionBadge status={run.status} />
                <Button
                  variant="secondary"
                  onClick={() => {
                    setRunId(runId === run.id ? '' : run.id);
                    setPage(1);
                    setDetail(null);
                  }}
                >
                  {runId === run.id ? 'Close report' : t.viewSent}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {runId && (
        <div className="mt-5 space-y-4 border-t border-line pt-5">
          {loading && <p className="text-xs text-fg-muted">Updating report…</p>}
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}{' '}
              <button
                type="button"
                className="underline"
                onClick={() => setRevision((n) => n + 1)}
              >
                Retry
              </button>
            </p>
          )}
          {detail && (
            <>
              <h3 className="font-semibold">Sent version: {detail.subject}</h3>
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[420px] text-left text-xs">
                  <thead className="bg-subtle">
                    <tr>
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.recipients.map((recipient) => (
                      <tr key={recipient.id} className="border-t border-line">
                        <td className="p-3">
                          <p>{recipient.username}</p>
                          <p className="mt-1 text-fg-muted">
                            {recipient.email}
                          </p>
                        </td>
                        <td className="p-3">
                          <PromotionBadge status={recipient.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(page - 1)}
                >
                  Previous recipients
                </Button>
                <Button
                  variant="secondary"
                  disabled={page * detail.limit >= detail.total || loading}
                  onClick={() => setPage(page + 1)}
                >
                  Next recipients
                </Button>
              </div>
              <EmailPreview
                html={detail.preview.html}
                subject={detail.preview.subject}
              />
            </>
          )}
        </div>
      )}
    </section>
  );
}

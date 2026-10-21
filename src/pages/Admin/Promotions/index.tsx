import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button } from '../../../components/ui/Button';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/ui/Feedback';
import { formatDate } from '../../../utils/date';
import { promotionText as t } from '../../../utils/promotionText';
import { usePromotionsPage } from './hooks/usePromotionsPage';
import { PromotionBadge } from './components/PromotionBadge';
export default function PromotionsPage() {
  const page = usePromotionsPage();
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="ui-page-title">{t.title}</h1>
          <p className="mt-2 text-sm text-fg-secondary">{t.description}</p>
        </div>
        <Link
          to={`${ROUTES.adminPromotions}/new`}
          className="ui-button ui-button-primary"
        >
          + {t.newPromotion}
        </Link>
      </header>
      <div className="flex flex-wrap items-end gap-3 rounded-md border border-line bg-surface p-4">
        <div className="min-w-0 flex-1">
          <label htmlFor="promotion-search" className="auth-label">
            {t.search}
          </label>
          <input
            id="promotion-search"
            className="ui-field"
            type="search"
            maxLength={100}
            value={page.search}
            onChange={(e) => {
              page.setSearch(e.target.value);
              page.setPage(1);
            }}
          />
        </div>
        <Button variant="secondary" onClick={page.refresh}>
          Refresh
        </Button>
      </div>
      {page.error && <ErrorState message={page.error} retry={page.refresh} />}
      {page.loading ? (
        <LoadingState label={t.loading} />
      ) : (
        page.result &&
        !page.error && (
          <>
            {!page.result.items.length ? (
              <EmptyState
                title={page.search ? 'No matching promotions' : t.empty}
                description={t.emptyHint}
                icon="chat"
              />
            ) : (
              <div className="overflow-x-auto rounded-md border border-line bg-surface">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-subtle text-fg-secondary">
                    <tr>
                      {['Promotion', 'Audience', 'Last send', 'Status', ''].map(
                        (title) => (
                          <th
                            key={title}
                            scope="col"
                            className="px-5 py-4 font-medium"
                          >
                            {title}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {page.result.items.map((item) => (
                      <tr key={item.id}>
                        <th
                          scope="row"
                          className="max-w-80 px-5 py-5 text-left font-normal"
                        >
                          <Link
                            className="font-semibold hover:underline"
                            to={`${ROUTES.adminPromotions}/${item.id}`}
                          >
                            {item.subject || t.noSubject}
                          </Link>
                          <p className="mt-2 text-xs text-fg-muted">
                            {item.productCount} products · Updated{' '}
                            {formatDate(item.updatedAt)}
                          </p>
                        </th>
                        <td className="px-5 py-5 text-fg-secondary">
                          {item.audience === 'ALL' ? t.all : t.selected}
                          {item.latestRun && (
                            <p className="mt-1 text-xs">
                              {item.latestRun.recipientCount} recipients
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-5 text-xs text-fg-muted">
                          {item.latestRun ? (
                            <>
                              {formatDate(item.latestRun.createdAt)}
                              <p className="mt-1">
                                {item.latestRun.counts.SENT} sent ·{' '}
                                {item.latestRun.counts.FAILED +
                                  item.latestRun.counts.UNKNOWN}{' '}
                                failed / unknown
                              </p>
                            </>
                          ) : (
                            'Not sent yet'
                          )}
                        </td>
                        <td className="px-5 py-5">
                          <PromotionBadge status={item.latestRun?.status} />
                          {item.latestRun &&
                            item.latestRun.campaignVersion !== item.version && (
                              <p className="mt-2 text-xs text-fg-muted">
                                Edited since last send
                              </p>
                            )}
                        </td>
                        <td className="px-5 py-5">
                          <Link
                            className="ui-button ui-button-secondary whitespace-nowrap"
                            to={`${ROUTES.adminPromotions}/${item.id}`}
                          >
                            {t.editResend}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p>
                {page.result.total} promotions · Page {page.page}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={page.page <= 1}
                  onClick={() => page.setPage(page.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={page.page * page.result.limit >= page.result.total}
                  onClick={() => page.setPage(page.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )
      )}
    </section>
  );
}

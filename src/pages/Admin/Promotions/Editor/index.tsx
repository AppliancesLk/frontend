import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { Dialog } from '../../../../components/ui/Dialog';
import { LoadingState } from '../../../../components/ui/Feedback';
import { ROUTES } from '../../../../constants/routes';
import { promotionText as t } from '../../../../utils/promotionText';
import { usePromotionEditor } from '../hooks/usePromotionEditor';
import { canReviewPromotion } from '../helpers/promotion.helpers';
import { RecipientPicker } from '../components/RecipientPicker';
import { ProductPicker } from '../components/ProductPicker';
import { MessageFields } from '../components/MessageFields';
import { EmailPreview } from '../components/EmailPreview';
import { SendHistory } from '../components/SendHistory';
export default function PromotionEditorPage() {
  const page = usePromotionEditor(),
    errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (page.error && !page.review) errorRef.current?.focus();
  }, [page.error, page.review]);
  return (
    <section className="mx-auto max-w-[1440px] space-y-6">
      <Link
        to={ROUTES.adminPromotions}
        className="inline-flex min-h-9 items-center text-sm text-fg-secondary hover:underline"
      >
        ← {t.back}
      </Link>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="ui-page-title">{page.detail ? t.edit : t.editor}</h1>
          <p className="mt-2 text-sm text-fg-muted">
            {page.dirty ? t.unsaved : t.current}
          </p>
        </div>
        <span className="rounded-full border border-line bg-surface px-4 py-2 text-xs">
          {page.preview?.recipientCount ?? 0} eligible recipients
        </span>
      </header>
      {page.loading ? (
        <LoadingState label="Loading promotion" />
      ) : (
        <>
          {page.error && !page.review && (
            <div
              ref={errorRef}
              tabIndex={-1}
              role="alert"
              className="ui-alert ui-tone-danger"
            >
              <p>{page.error}</p>
              <Button
                variant="secondary"
                className="mt-3"
                onClick={page.reload}
                disabled={page.busy}
              >
                Reload promotion
              </Button>
            </div>
          )}
          {page.success && (
            <p role="status" className="ui-alert ui-tone-success">
              {page.success}
            </p>
          )}
          {page.ready && (
            <>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void page.save();
                }}
              >
                <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
                  <fieldset disabled={page.busy} className="min-w-0 space-y-6">
                    <legend className="sr-only">Promotion editor</legend>
                    <RecipientPicker
                      draft={page.draft}
                      onChange={page.setDraft}
                      selectedUsers={page.selectedUsers}
                      onUsers={page.setSelectedUsers}
                    />
                    <ProductPicker
                      draft={page.draft}
                      onChange={page.setDraft}
                      selectedProducts={page.selectedProducts}
                      onProducts={page.setSelectedProducts}
                    />
                    <MessageFields
                      draft={page.draft}
                      onChange={page.setDraft}
                    />
                  </fieldset>
                  <aside className="min-w-0 xl:sticky xl:top-24">
                    <EmailPreview
                      html={page.preview?.html}
                      subject={page.preview?.subject}
                      loading={page.previewing}
                      error={page.previewError}
                    />
                    {Boolean(page.preview?.excludedCount) && (
                      <p className="mt-3 text-xs text-warning">
                        {page.preview?.excludedCount} {t.excluded}
                      </p>
                    )}
                  </aside>
                </div>
                <div className="sticky bottom-0 z-10 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-surface p-4 shadow-sm">
                  <p className="text-xs text-fg-muted">
                    {page.draft.productIds.length} products ·{' '}
                    {page.draft.audience === 'ALL'
                      ? t.all
                      : `${page.draft.userIds.length} selected users`}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" variant="secondary" busy={page.busy}>
                      {t.save}
                    </Button>
                    <Button
                      disabled={
                        page.busy ||
                        !canReviewPromotion(page.draft) ||
                        page.hasActive
                      }
                      onClick={() => void page.save(true)}
                    >
                      {page.hasActive ? 'Send in progress' : t.review}
                    </Button>
                  </div>
                </div>
              </form>
              {page.detail && (
                <SendHistory id={page.detail.id} runs={page.detail.runs} />
              )}
            </>
          )}
        </>
      )}
      <Dialog
        open={Boolean(page.review)}
        onClose={() => page.setReview(null)}
        title={t.reviewTitle}
        description={t.reviewHint}
        busy={page.busy}
      >
        {page.review && (
          <div className="space-y-4">
            <div className="rounded-md border border-line bg-subtle p-4">
              <p className="text-xs text-fg-muted">Subject</p>
              <p className="mt-1 break-words font-semibold">
                {page.review.promotion.subject}
              </p>
              <p className="mt-3 text-sm">
                {page.review.preview.recipientCount} recipients ·{' '}
                {page.review.promotion.productIds.length} products
              </p>
              <p className="mt-2 text-xs text-fg-muted">
                {page.review.promotion.audience === 'ALL' ? t.all : t.selected}
              </p>
            </div>
            {page.review.preview.excludedCount > 0 && (
              <p className="text-xs text-warning">
                {page.review.preview.excludedCount} {t.excluded}
              </p>
            )}
            {page.error && (
              <p role="alert" className="ui-alert ui-tone-danger">
                {page.error}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                variant="secondary"
                disabled={page.busy}
                onClick={() => page.setReview(null)}
              >
                Keep editing
              </Button>
              <Button
                busy={page.busy}
                disabled={!page.review.preview.recipientCount}
                onClick={() => void page.send()}
              >
                {t.confirmSend}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  );
}

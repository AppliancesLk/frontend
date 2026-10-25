import { Spinner } from '../ui/Feedback';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { uiText } from '../../utils/uiText';
import { LoadingState } from '../ui/Feedback';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
import { formatDate } from '../../utils/date';
import { getApiError } from '../../utils/apiErrors';
import { saveReview, deleteReview } from '../../services/reviewService';
import { useProductReviews } from './hooks/useProductReviews';
import { Rating } from '../common/Rating';
import type { ProductReview, ReviewSummary } from '../../types/review.types';
const t = translations.experience;
function ReviewForm({
  productId,
  mine,
  onSaved,
}: {
  productId: string;
  mine?: ProductReview | null;
  onSaved: () => void;
}) {
  const [rating, setRating] = useState(mine?.rating ?? 5),
    [title, setTitle] = useState(mine?.title ?? ''),
    [body, setBody] = useState(mine?.body ?? ''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  return (
    <form
      className="rounded-md border border-line bg-page p-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (busy) return;
        setBusy(true);
        setError('');
        void saveReview(productId, { rating, title, body }, !!mine)
          .then(onSaved)
          .catch((error) => setError(getApiError(error, t.reviewSaveError)))
          .finally(() => setBusy(false));
      }}
    >
      <h3 className="mb-4 font-semibold text-fg">
        {mine ? t.editReview : t.writeReview}
      </h3>
      <fieldset disabled={busy} className="space-y-4">
        <label className="block text-sm font-medium text-fg-secondary">
          {t.rating}
          <select
            aria-label={t.rating}
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="ui-field auth-input mt-2"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {'★'.repeat(value)} ({value}/5)
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-fg-secondary">
          {t.reviewTitle}
          <input
            required
            minLength={2}
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="ui-field auth-input mt-2"
          />
        </label>
        <label className="block text-sm font-medium text-fg-secondary">
          {t.reviewBody}
          <textarea
            required
            minLength={10}
            maxLength={3000}
            rows={4}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="ui-field auth-input mt-2 h-auto py-2"
          />
        </label>
        <button className="auth-primary">
          {busy && <Spinner className="mr-2" />}
          {busy ? t.loading : mine ? t.updateReview : t.submitReview}
        </button>
      </fieldset>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
export function ProductReviews({
  productId,
  onSummary,
}: {
  productId: string;
  onSummary?: (summary: ReviewSummary) => void;
}) {
  const { user } = useAuth();
  const location = useLocation();
  const customer = user?.role === USER_ROLES.CUSTOMER;
  const page = useProductReviews(
    productId,
    customer ? user.id : undefined,
    user?.role === USER_ROLES.ADMIN,
  );
  const [feedback, setFeedback] = useState(''),
    [error, setError] = useState(''),
    [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const summary = page.data?.summary;
  useEffect(() => {
    if (summary) onSummary?.(summary);
  }, [summary, onSummary]);
  async function remove(id: string) {
    if (deleting) return;
    setDeleting(true);
    setError('');
    try {
      await deleteReview(productId, id);
      setFeedback(t.reviewDeleted);
      setDeleteId(null);
      page.refresh();
    } catch {
      setError(t.reviewDeleteError);
    } finally {
      setDeleting(false);
    }
  }
  return (
    <section
      id="reviews"
      aria-label={t.reviews}
      className="scroll-mt-32 space-y-6"
    >
      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title={t.deleteReview}
        description={t.deleteConfirm}
        busy={deleting}
      >
        {error && (
          <p role="alert" className="ui-alert ui-tone-danger mb-4">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            disabled={deleting}
            onClick={() => setDeleteId(null)}
          >
            {uiText.cancel}
          </Button>
          <Button
            variant="danger"
            busy={deleting}
            onClick={() => {
              if (deleteId) void remove(deleteId);
            }}
          >
            {t.deleteReview}
          </Button>
        </div>
      </Dialog>
      <h2 className="text-xl font-semibold text-fg">
        {user?.role === USER_ROLES.ADMIN ? t.moderation : t.reviews}
      </h2>
      {page.loading ? (
        <LoadingState label={t.loading} compact={true} />
      ) : page.error ? (
        <div role="alert">
          <p className="text-sm text-danger">{t.reviewError}</p>
          <button className="auth-secondary mt-3" onClick={page.refresh}>
            {t.retry}
          </button>
        </div>
      ) : (
        page.data && (
          <>
            <div className="grid gap-6 md:grid-cols-[13rem_1fr]">
              <div className="rounded-md bg-primary-subtle p-5">
                <p className="text-4xl font-bold text-fg">
                  {summary?.count ? summary.average.toFixed(1) : '—'}
                </p>
                <Rating
                  average={summary?.average ?? 0}
                  count={summary?.count ?? 0}
                />
                {summary?.distribution.map((row) => (
                  <div
                    key={row.rating}
                    className="mt-2 flex items-center gap-2 text-xs text-fg-muted"
                  >
                    <span>{row.rating} ★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full bg-accent"
                        style={{
                          width: `${summary.count ? (row.count / summary.count) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span>{row.count}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {page.data.items.length ? (
                  page.data.items.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-md border border-line p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-fg">
                          {review.author}
                        </p>
                        <time
                          className="text-xs text-fg-muted"
                          dateTime={review.createdAt}
                        >
                          {formatDate(review.createdAt)}
                        </time>
                      </div>
                      <p
                        className="mt-2 text-warning"
                        aria-label={`${t.rating}: ${review.rating}/5`}
                      >
                        {'★'.repeat(review.rating)}
                      </p>
                      {review.verifiedPurchase && (
                        <p className="mt-1 text-xs font-medium text-success">
                          {t.verified}
                        </p>
                      )}
                      <h3 className="mt-2 break-words font-semibold text-fg">
                        {review.title}
                      </h3>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-fg-secondary">
                        {review.body}
                      </p>
                      {(review.id === page.mine?.id ||
                        user?.role === USER_ROLES.ADMIN) && (
                        <button
                          disabled={deleting}
                          className="mt-3 rounded-sm px-3 py-2 text-xs font-medium text-danger hover:bg-danger-bg "
                          onClick={() => {
                            setError('');
                            setDeleteId(review.id);
                          }}
                        >
                          {t.deleteReview}
                        </button>
                      )}
                    </article>
                  ))
                ) : (
                  <p className="p-4 text-sm text-fg-muted">{t.noReviews}</p>
                )}
                {page.data.totalPages > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      className="auth-secondary"
                      disabled={page.data.page <= 1}
                      onClick={() => page.setPage(page.data!.page - 1)}
                    >
                      {t.previous}
                    </button>
                    <span className="text-sm text-fg-muted">
                      {page.data.page}/{page.data.totalPages}
                    </span>
                    <button
                      className="auth-secondary"
                      disabled={page.data.page >= page.data.totalPages}
                      onClick={() => page.setPage(page.data!.page + 1)}
                    >
                      {t.next}
                    </button>
                  </div>
                )}
              </div>
            </div>
            {customer ? (
              <ReviewForm
                key={page.mine?.id ?? 'new'}
                productId={productId}
                mine={page.mine}
                onSaved={() => {
                  setFeedback(t.reviewSaved);
                  page.refresh();
                }}
              />
            ) : !user ? (
              <Link
                to={ROUTES.login}
                state={{ from: location.pathname + location.search }}
                className="inline-flex rounded-sm bg-primary px-4 py-3 text-sm font-medium text-primary-on"
              >
                {t.signInReview}
              </Link>
            ) : null}
          </>
        )
      )}
      {feedback && (
        <p role="status" className="text-sm text-success">
          {feedback}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </section>
  );
}

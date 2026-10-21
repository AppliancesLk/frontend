import { useEffect, useState } from 'react';
import { getAdminUsers } from '../../../../services/userService';
import type { AdminUsersResult } from '../../../../types/user.types';
import type {
  PromotionContent,
  PromotionUser,
} from '../../../../types/promotion.types';
import { promotionText as t } from '../../../../utils/promotionText';
import { getApiError } from '../../../../utils/apiErrors';
import { Button } from '../../../../components/ui/Button';
import { LoadingState } from '../../../../components/ui/Feedback';
export function RecipientPicker({
  draft,
  onChange,
  selectedUsers,
  onUsers,
}: {
  draft: PromotionContent;
  onChange: (value: PromotionContent) => void;
  selectedUsers: PromotionUser[];
  onUsers: (value: PromotionUser[]) => void;
}) {
  const [search, setSearch] = useState(''),
    [page, setPage] = useState(1),
    [result, setResult] = useState<AdminUsersResult | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [revision, setRevision] = useState(0),
    [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const next = await getAdminUsers(
          { page, search, role: '', status: 'active' },
          controller.signal,
        );
        if (!controller.signal.aborted) setResult(next);
      } catch (err) {
        if (!controller.signal.aborted)
          setError(getApiError(err, 'Unable to load users. Please try again.'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [search, page, revision]);
  function toggle(user: PromotionUser) {
    const has = draft.userIds.includes(user.id);
    onChange({
      ...draft,
      userIds: has
        ? draft.userIds.filter((id) => id !== user.id)
        : [...draft.userIds, user.id],
    });
    if (!has && !selectedUsers.some((item) => item.id === user.id))
      onUsers([...selectedUsers, user]);
  }
  return (
    <section className="ui-panel p-5 sm:p-6">
      <h2 className="text-lg font-semibold">{t.recipients}</h2>
      <p className="mt-2 text-xs leading-5 text-fg-muted">{t.eligibility}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {(['SELECTED', 'ALL'] as const).map((audience) => (
          <label
            key={audience}
            className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${draft.audience === audience ? 'border-primary bg-primary-subtle' : 'border-line'}`}
          >
            <input
              type="radio"
              name="audience"
              checked={draft.audience === audience}
              onChange={() => onChange({ ...draft, audience })}
              className="h-4 w-4 shrink-0 accent-primary"
            />
            {audience === 'ALL' ? t.all : t.selected}
          </label>
        ))}
      </div>
      {draft.audience === 'SELECTED' && (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
            <p className="font-semibold">
              {draft.userIds.length} / 1000 {t.selectedCount}
            </p>
            {draft.userIds.length > 0 && (
              <button
                type="button"
                className="underline"
                onClick={() => onChange({ ...draft, userIds: [] })}
              >
                Clear selection
              </button>
            )}
          </div>
          {draft.userIds.length > 0 && (
            <ul className="mt-3 space-y-2">
              {draft.userIds.slice(0, expanded ? undefined : 5).map((id) => {
                const user = selectedUsers.find((item) => item.id === id);
                return (
                  <li
                    key={id}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-md bg-subtle px-3 py-2 text-xs"
                  >
                    <span className="min-w-0 break-all">
                      {user
                        ? `${user.username} · ${user.email}`
                        : 'Unavailable account'}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${user?.username ?? 'account'}`}
                      className="shrink-0 px-2 py-1 underline"
                      onClick={() =>
                        onChange({
                          ...draft,
                          userIds: draft.userIds.filter(
                            (value) => value !== id,
                          ),
                        })
                      }
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {draft.userIds.length > 5 && (
            <button
              type="button"
              className="mt-2 text-xs underline"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show fewer' : 'Show all selected users'}
            </button>
          )}
          <label className="auth-label mt-4" htmlFor="promotion-user-search">
            {t.recipientSearch}
          </label>
          <input
            id="promotion-user-search"
            className="ui-field"
            type="search"
            value={search}
            maxLength={100}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {error && (
            <p role="alert" className="mt-3 text-sm text-danger">
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
          {loading ? (
            <LoadingState compact />
          ) : (
            <div className="mt-3 max-h-64 overflow-y-auto rounded-md border border-line">
              {result?.items.length ? (
                result.items.map((user) => (
                  <label
                    key={user.id}
                    className="flex cursor-pointer items-start gap-3 border-b border-line px-3 py-3 last:border-0 hover:bg-subtle"
                  >
                    <input
                      type="checkbox"
                      aria-label={`Select user ${user.username}`}
                      checked={draft.userIds.includes(user.id)}
                      disabled={
                        draft.userIds.length >= 1000 &&
                        !draft.userIds.includes(user.id)
                      }
                      onChange={() => toggle(user)}
                      className="mt-1 h-4 w-4 shrink-0 accent-primary"
                    />
                    <span className="min-w-0 text-sm">
                      <span className="block font-medium">{user.username}</span>
                      <span className="mt-1 block break-all text-xs text-fg-muted">
                        {user.email}
                      </span>
                    </span>
                  </label>
                ))
              ) : (
                <p className="p-4 text-sm text-fg-muted">No matching users.</p>
              )}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between gap-2 text-xs">
            <p>{result?.total ?? 0} eligible users</p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                disabled={page <= 1 || loading}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                disabled={
                  loading || !result || page * result.limit >= result.total
                }
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

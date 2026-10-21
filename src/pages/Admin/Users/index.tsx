import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/Button';
import { Dialog } from '../../../components/ui/Dialog';
import { LoadingState } from '../../../components/ui/Feedback';
import { accountText as t } from '../../../utils/accountText';
import { translations } from '../../../utils/translations';
import { formatDate } from '../../../utils/date';
import { formatCurrency } from '../../../utils/currency';
import type { UserFilters } from '../../../types/user.types';
import { useUsersPage } from './hooks/useUsersPage';
export default function UsersPage() {
  const page = useUsersPage();
  const { user } = useAuth();
  return (
    <section className="space-y-6">
      <header>
        <h1 className="ui-page-title">{t.usersTitle}</h1>
        <p className="mt-2 text-sm text-fg-secondary">{t.usersDescription}</p>
      </header>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-4 rounded-md border border-line bg-surface p-5 md:grid-cols-[minmax(0,1fr)_auto_auto]"
      >
        <div>
          <label htmlFor="user-search" className="auth-label">
            {t.search}
          </label>
          <input
            id="user-search"
            className="ui-field"
            type="search"
            maxLength={100}
            value={page.filters.search}
            onChange={(e) =>
              page.setFilters({
                ...page.filters,
                page: 1,
                search: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label htmlFor="user-role" className="auth-label">
            Role
          </label>
          <select
            id="user-role"
            className="ui-field"
            value={page.filters.role}
            onChange={(e) =>
              page.setFilters({
                ...page.filters,
                page: 1,
                role: e.target.value as UserFilters['role'],
              })
            }
          >
            <option value="">{t.allRoles}</option>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
            <option value="REPAIRER">Repairer</option>
          </select>
        </div>
        <div>
          <label htmlFor="user-status" className="auth-label">
            Status
          </label>
          <select
            id="user-status"
            className="ui-field"
            value={page.filters.status}
            onChange={(e) =>
              page.setFilters({
                ...page.filters,
                page: 1,
                status: e.target.value as UserFilters['status'],
              })
            }
          >
            <option value="">{t.allStatuses}</option>
            <option value="active">{t.active}</option>
            <option value="inactive">{t.inactive}</option>
            <option value="pending">{t.pending}</option>
          </select>
        </div>
      </form>
      {page.error && (
        <div role="alert" className="ui-alert ui-tone-danger">
          <p>{page.error}</p>
          <Button variant="secondary" onClick={page.refresh}>
            {translations.common.retry}
          </Button>
        </div>
      )}
      {page.loading ? (
        <LoadingState label={t.usersTitle} />
      ) : (
        page.result && (
          <>
            {!page.result.items.length ? (
              <p className="ui-panel p-8 text-center text-fg-muted">
                {t.noUsers}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-md border border-line bg-surface">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-subtle text-fg-secondary">
                    <tr>
                      {[
                        'User',
                        'Role',
                        'Status',
                        'Joined',
                        'Loyalty credit',
                        'Access',
                      ].map((label) => (
                        <th
                          key={label}
                          scope="col"
                          className="px-5 py-4 font-medium"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {page.result.items.map((item) => (
                      <tr key={item.id}>
                        <th scope="row" className="px-5 py-4 font-normal">
                          <p className="font-semibold">{item.username}</p>
                          <p className="mt-1 break-all text-xs text-fg-muted">
                            {item.email}
                          </p>
                        </th>
                        <td className="px-5 py-4">{item.role}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block rounded-sm px-2 py-1 text-xs ${item.isActive ? 'bg-success-bg text-success' : item.deactivatedAt ? 'bg-danger-bg text-danger' : 'bg-warning-bg text-warning'}`}
                          >
                            {item.isActive
                              ? t.active
                              : item.deactivatedAt
                                ? t.inactive
                                : t.pending}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-fg-secondary">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          {formatCurrency(item.loyaltyBalance)}
                        </td>
                        <td className="px-5 py-4">
                          {item.id === user?.id ? (
                            <span className="text-xs text-fg-muted">
                              Your account
                            </span>
                          ) : item.deactivatedAt ? (
                            <Button
                              variant="secondary"
                              busy={page.saving}
                              onClick={() => void page.update(item, true)}
                            >
                              {t.reactivate}
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              disabled={page.saving}
                              onClick={() => page.setTarget(item)}
                            >
                              {t.deactivate}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p>
                {page.result.total} users · Page {page.filters.page}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={page.filters.page <= 1}
                  onClick={() =>
                    page.setFilters({
                      ...page.filters,
                      page: page.filters.page - 1,
                    })
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={
                    page.filters.page * page.result.limit >= page.result.total
                  }
                  onClick={() =>
                    page.setFilters({
                      ...page.filters,
                      page: page.filters.page + 1,
                    })
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )
      )}
      <Dialog
        open={Boolean(page.target)}
        onClose={() => page.setTarget(null)}
        title={t.deactivate}
        description={t.deactivateDescription}
        busy={page.saving}
      >
        <p className="font-semibold">{page.target?.username}</p>
        {page.error && (
          <p role="alert" className="ui-alert ui-tone-danger mt-3">
            {page.error}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button
            variant="secondary"
            disabled={page.saving}
            onClick={() => page.setTarget(null)}
          >
            {'Cancel'}
          </Button>
          <Button
            variant="danger"
            busy={page.saving}
            onClick={() => page.target && void page.update(page.target, false)}
          >
            {t.deactivate}
          </Button>
        </div>
      </Dialog>
    </section>
  );
}

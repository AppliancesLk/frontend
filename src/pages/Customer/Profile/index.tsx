import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { AccountDetails } from '../../../components/common/AccountDetails';
import { ThemeToggle } from '../../../components/common/ThemeToggle';
import { Icon } from '../../../components/common/Icon';
import { ROUTES } from '../../../constants/routes';
export default function ProfilePage() {
  const { user } = useAuth();
  const [section, setSection] = useState<'details' | 'preferences'>('details');
  const customer = user?.role === 'CUSTOMER';
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="ui-page-title">Your account</h1>
      <p className="mt-2 text-sm text-fg-secondary">
        A little space for everything that’s yours.
      </p>
      <div className="mt-10 grid items-start gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-md border border-line bg-surface p-4">
          <div className="mb-4 border-b border-line-subtle px-2 pb-5">
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-subtle font-display text-xl font-semibold text-fg-link">
              {user?.username.slice(0, 2).toUpperCase()}
            </span>
            <p className="font-semibold">{user?.username}</p>
            <p className="mt-1 break-all text-xs text-fg-muted">
              {user?.email}
            </p>
          </div>
          <nav aria-label="Account sections" className="space-y-1">
            <button
              className={`account-section ${section === 'details' ? 'is-active' : ''}`}
              onClick={() => setSection('details')}
              aria-pressed={section === 'details'}
            >
              <Icon name="user" />
              Personal details
            </button>
            {customer && (
              <>
                <Link className="account-section" to={ROUTES.orders}>
                  <Icon name="orders" />
                  Your orders
                </Link>
                <Link className="account-section" to={ROUTES.repairs}>
                  <Icon name="repair" />
                  Your repairs
                </Link>
                <Link className="account-section" to={ROUTES.liveChat}>
                  <Icon name="chat" />
                  Live support
                </Link>
              </>
            )}
            {!customer && (
              <Link
                className="account-section"
                to={user?.role === 'ADMIN' ? ROUTES.admin : ROUTES.repairer}
              >
                <Icon name="grid" />
                Your workspace
              </Link>
            )}
            <button
              className={`account-section ${section === 'preferences' ? 'is-active' : ''}`}
              onClick={() => setSection('preferences')}
              aria-pressed={section === 'preferences'}
            >
              <Icon name="filter" />
              Preferences
            </button>
          </nav>
        </aside>
        <section
          className="rounded-md border border-line bg-surface p-6 sm:p-8"
          aria-live="polite"
        >
          {section === 'details' ? (
            <>
              <h2 className="text-2xl font-semibold">Personal details</h2>
              <p className="mt-2 text-sm text-fg-muted">
                Hello, {user?.username}. Here are your account details.
              </p>
              <AccountDetails />
              <Link
                to={ROUTES.products}
                className="ui-button ui-button-primary"
              >
                Continue shopping
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">Preferences</h2>
              <div className="mt-8 flex flex-wrap items-start justify-between gap-6 border-t border-line-subtle pt-6">
                <div>
                  <h3 className="font-semibold">Appearance</h3>
                  <p className="mt-2 max-w-xs text-sm text-fg-muted">
                    Choose your theme, or let it follow your device. Your choice
                    is saved on this browser.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

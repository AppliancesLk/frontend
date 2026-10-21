import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '../../../components/common/BrandLogo';
import { Button } from '../../../components/ui/Button';
import { ROUTES } from '../../../constants/routes';
import { accountText as t } from '../../../utils/accountText';
import {
  useAccountAction,
  type AccountActionMode,
} from './hooks/useAccountAction';

export default function AccountActionPage({
  mode,
}: {
  mode: AccountActionMode;
}) {
  const location = useLocation();
  return <AccountActionContent key={`${mode}:${location.key}`} mode={mode} />;
}
function AccountActionContent({ mode }: { mode: AccountActionMode }) {
  const page = useAccountAction(mode);
  const title =
    mode === 'verify'
      ? t.verifyTitle
      : mode === 'forgot'
        ? t.forgotTitle
        : t.resetTitle;
  const description =
    mode === 'verify'
      ? t.verifyDescription
      : mode === 'forgot'
        ? t.forgotDescription
        : t.resetDescription;
  const validToken = /^[a-f0-9]{64}$/.test(page.token);
  const resetMissing = mode === 'reset' && !validToken && !page.completed;
  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <Link to={ROUTES.home}>
        <BrandLogo />
      </Link>
      <section className="mt-8 rounded-lg border border-line bg-surface p-6 sm:p-8">
        <h1 className="ui-page-title">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-fg-secondary">
          {description}
        </p>
        {page.message && (
          <p
            role="status"
            className={`ui-alert mt-6 ${page.completed ? 'ui-tone-success' : 'ui-tone-info'}`}
          >
            {page.message}
          </p>
        )}
        {page.error && (
          <p role="alert" className="ui-alert ui-tone-danger mt-6">
            {page.error}
          </p>
        )}
        {resetMissing && (
          <p role="alert" className="ui-alert ui-tone-warning mt-6">
            {t.invalid}
          </p>
        )}
        {!page.completed && !resetMissing && (
          <form
            onSubmit={page.submit}
            className="mt-6 space-y-5"
            aria-busy={page.busy}
          >
            {(mode === 'forgot' || (mode === 'verify' && !validToken)) && (
              <div>
                <label htmlFor="action-email" className="auth-label">
                  {t.email}
                </label>
                <input
                  id="action-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  className="ui-field"
                  value={page.email}
                  onChange={(e) => page.setEmail(e.target.value)}
                  disabled={page.busy}
                />
              </div>
            )}
            {mode === 'reset' && (
              <>
                <div>
                  <label htmlFor="new-password" className="auth-label">
                    {t.newPassword}
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={72}
                    className="ui-field"
                    value={page.password}
                    onChange={(e) => page.setPassword(e.target.value)}
                    disabled={page.busy}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="auth-label">
                    {t.confirmPassword}
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={72}
                    className="ui-field"
                    value={page.confirm}
                    onChange={(e) => page.setConfirm(e.target.value)}
                    disabled={page.busy}
                  />
                </div>
              </>
            )}
            <Button type="submit" busy={page.busy} className="w-full">
              {page.busy
                ? t.busy
                : mode === 'verify'
                  ? validToken
                    ? t.verifyAction
                    : t.resend
                  : mode === 'forgot'
                    ? t.sendReset
                    : t.resetAction}
            </Button>
          </form>
        )}
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-fg-link">
          <Link to={ROUTES.login}>{t.signIn}</Link>
          {mode === 'reset' && (
            <Link to={ROUTES.forgotPassword}>{t.sendReset}</Link>
          )}
          {mode === 'verify' && page.token && !page.completed && (
            <Link to={ROUTES.verifyEmail} reloadDocument>
              {t.resend}
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

import { BrandLogo } from '../../../components/common/BrandLogo';
import { Icon } from '../../../components/common/Icon';
import { Spinner } from '../../../components/ui/Feedback';
import { LoadingState } from '../../../components/ui/Feedback';
import { Link, Navigate } from 'react-router-dom';
import { useAuthForm } from '../hooks/useAuthForm';
import { ROUTES } from '../../../constants/routes';
import { translations } from '../../../utils/translations';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const {
    registering,
    user,
    loading,
    location,
    destination,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirm,
    setConfirm,
    showPassword,
    setShowPassword,
    busy,
    error,
    submit,
  } = useAuthForm(mode);
  if (loading)
    return (
      <LoadingState label={translations.auth.checkingSession} compact={true} />
    );
  if (user) return <Navigate to={destination} replace />;
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-story">
          <Link to={ROUTES.home} aria-label="Appliances.lk home">
            <BrandLogo />
          </Link>
          <div className="auth-story-content">
            <h2>
              Good things.
              <br />
              Every day.
            </h2>
            <p>
              Your next upgrade. A device you can rely on. A little help when
              you need it. All in one place.
            </p>
            <div className="auth-brand-plate">
              <div className="flex items-center justify-between border-b border-line-strong px-5 py-4">
                <span className="font-display text-lg font-semibold">
                  Appliances.lk
                </span>
                <Icon name="appliance" />
              </div>
              <dl>
                <div>
                  <dt>Made for</dt>
                  <dd>Everyday living</dd>
                </div>
                <div>
                  <dt>From</dt>
                  <dd>Sri Lanka, with care</dd>
                </div>
                <div>
                  <dt>Here for</dt>
                  <dd>Your next chapter</dd>
                </div>
              </dl>
            </div>
          </div>
          <Link
            to={ROUTES.products}
            className="hidden min-h-11 items-center gap-2 text-sm font-semibold text-fg-link md:flex"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            Continue exploring
          </Link>
        </aside>
        <section className="auth-form-section" aria-labelledby="auth-heading">
          <h1 id="auth-heading" className="ui-page-title">
            {registering
              ? translations.auth.registerTitle
              : translations.auth.loginTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-fg-muted">
            {registering
              ? translations.auth.registerDescription
              : translations.auth.loginDescription}
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5" aria-busy={busy}>
            {error && (
              <div
                role="alert"
                id="auth-error"
                className="rounded-sm border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger"
              >
                {error}
              </div>
            )}
            <div>
              <label htmlFor="username" className="auth-label">
                {registering
                  ? translations.auth.username
                  : translations.auth.usernameOrEmail}
              </label>
              <input
                id="username"
                className="ui-field auth-input"
                aria-describedby={error ? 'auth-error' : undefined}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                minLength={3}
                maxLength={registering ? 32 : 254}
                pattern={registering ? '[a-zA-Z0-9_]{3,32}' : undefined}
                disabled={busy}
              />
              {registering && (
                <p className="mt-1.5 text-xs text-fg-muted">
                  {translations.auth.usernameHint}
                </p>
              )}
            </div>
            {registering && (
              <div>
                <label htmlFor="email" className="auth-label">
                  {translations.auth.email}
                </label>
                <input
                  id="email"
                  type="email"
                  className="ui-field auth-input"
                  aria-describedby={error ? 'auth-error' : undefined}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  maxLength={254}
                  disabled={busy}
                />
              </div>
            )}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="auth-label">
                  {translations.auth.password}
                </label>
                <button
                  type="button"
                  aria-controls="password"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="-mr-2 mb-1 min-h-11 rounded-sm px-2 text-xs font-semibold text-fg-link"
                >
                  {showPassword
                    ? translations.auth.hide
                    : translations.auth.show}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="ui-field auth-input"
                aria-describedby={error ? 'auth-error' : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={registering ? 'new-password' : 'current-password'}
                required
                minLength={8}
                maxLength={72}
                disabled={busy}
              />
              {registering && (
                <p className="mt-1.5 text-xs text-fg-muted">
                  {translations.auth.passwordHint}
                </p>
              )}
            </div>
            {registering && (
              <div>
                <label htmlFor="confirm" className="auth-label">
                  {translations.auth.confirmPassword}
                </label>
                <input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  className="ui-field auth-input"
                  aria-describedby={error ? 'auth-error' : undefined}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={72}
                  disabled={busy}
                />
              </div>
            )}
            <button disabled={busy} className="auth-primary w-full">
              {busy && <Spinner className="mr-2" />}
              {busy
                ? registering
                  ? 'Creating your account…'
                  : 'Signing in…'
                : registering
                  ? translations.auth.createAccount
                  : translations.auth.signIn}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-fg-muted">
            {registering
              ? translations.auth.alreadyRegistered
              : translations.auth.newCustomer}
            <Link
              state={location.state}
              to={registering ? ROUTES.login : ROUTES.register}
              className="font-semibold text-fg-link hover:text-fg-link"
            >
              {registering
                ? translations.auth.signIn
                : translations.auth.createAnAccount}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

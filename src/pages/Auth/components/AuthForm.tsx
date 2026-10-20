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
    <main className="min-h-[calc(100dvh-8rem)] bg-slate-50 px-4 py-10 sm:py-16">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
        <aside className="hidden flex-col justify-between bg-slate-950 p-8 lg:flex text-white sm:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              {translations.auth.brandTagline}
            </p>
            <h2 className="mt-6 text-3xl font-semibold leading-tight text-white">
              {translations.auth.heroFirst}
              <br />
              {translations.auth.heroSecond}
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
              {translations.auth.heroDescription}
            </p>
          </div>
          <div className="mt-10 border-t border-slate-700 pt-6">
            <p className="text-sm text-slate-300">
              {translations.auth.browsing}
            </p>
            <Link
              to={ROUTES.products}
              className="mt-2 inline-block font-medium text-blue-300 hover:text-blue-200"
            >
              {translations.common.continueShopping}
            </Link>
          </div>
        </aside>
        <section className="p-6 sm:p-10 lg:p-12" aria-labelledby="auth-heading">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
            {registering ? translations.auth.join : translations.auth.welcome}
          </p>
          <h1 id="auth-heading" className="ui-page-title mt-3">
            {registering
              ? translations.auth.registerTitle
              : translations.auth.loginTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {registering
              ? translations.auth.registerDescription
              : translations.auth.loginDescription}
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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
                <p className="mt-1.5 text-xs text-slate-500">
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
                  className="mb-2 text-xs font-semibold text-slate-600"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={registering ? 'new-password' : 'current-password'}
                required
                minLength={8}
                maxLength={72}
                disabled={busy}
              />
              {registering && (
                <p className="mt-1.5 text-xs text-slate-500">
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
                ? translations.common.pleaseWait
                : registering
                  ? translations.auth.createAccount
                  : translations.auth.signIn}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            {registering
              ? translations.auth.alreadyRegistered
              : translations.auth.newCustomer}
            <Link
              state={location.state}
              to={registering ? ROUTES.login : ROUTES.register}
              className="font-semibold text-blue-700 hover:text-blue-800"
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

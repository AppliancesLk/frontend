import { useEffect, useRef } from 'react';
import {
  seasonalPresets,
  seasonalText as t,
} from '../../../utils/seasonalText';
import { formatDate } from '../../../utils/date';
import { Button } from '../../../components/ui/Button';
import { Dialog } from '../../../components/ui/Dialog';
import { LoadingState } from '../../../components/ui/Feedback';
import { useThemesPage } from './hooks/useThemesPage';
import { ThemePreview } from './components/ThemePreview';
import { ThemeChoices } from './components/ThemeChoices';
import { ThemeConfiguration } from './components/ThemeConfiguration';

export default function ThemesPage() {
  const page = useThemesPage();
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (page.error) errorRef.current?.focus();
  }, [page.error]);
  const draft = page.draft;
  return (
    <section className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="ui-page-title">{t.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-fg-secondary">
            {t.description}
          </p>
        </div>
        {page.settings && (
          <span className="rounded-full border border-line bg-surface px-4 py-2 text-xs font-medium">
            {t.current}: {seasonalPresets[page.active.theme].name}
          </span>
        )}
      </header>
      {page.loading && <LoadingState label={t.title} />}
      {page.error && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="ui-alert ui-tone-danger"
        >
          <p>{page.error}</p>
          <Button
            className="mt-3"
            variant="secondary"
            onClick={page.reload}
            disabled={page.saving}
          >
            Reload settings
          </Button>
        </div>
      )}
      {page.success && (
        <p role="status" className="ui-alert ui-tone-success">
          {page.success}
        </p>
      )}
      {draft && !page.loading && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void page.save();
          }}
          className="space-y-7"
          aria-busy={page.saving}
        >
          <ThemeChoices
            draft={draft}
            saving={page.saving}
            onChange={page.setDraft}
          />
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
            <div className="space-y-6">
              <ThemeConfiguration
                draft={draft}
                saving={page.saving}
                onChange={page.setDraft}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" busy={page.saving} className="min-w-36">
                  {page.saving ? t.saving : t.save}
                </Button>
                <Button
                  variant="secondary"
                  disabled={page.saving}
                  onClick={() => page.setConfirmReset(true)}
                >
                  {t.reset}
                </Button>
              </div>
              {page.settings?.startsAt && (
                <p className="text-xs text-fg-muted">
                  {t.startsAt}: {formatDate(page.settings.startsAt)}
                  {page.settings.endsAt
                    ? ` · ${t.endsAt}: ${formatDate(page.settings.endsAt)}`
                    : ''}
                </p>
              )}
            </div>
            <aside className="min-w-0 xl:sticky xl:top-24">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{t.preview}</h2>
                <div
                  className="flex rounded-full border border-line bg-surface p-1"
                  role="group"
                  aria-label="Preview color theme"
                >
                  {[false, true].map((dark) => (
                    <button
                      key={String(dark)}
                      type="button"
                      aria-pressed={page.darkPreview === dark}
                      onClick={() => page.setDarkPreview(dark)}
                      className={`min-h-9 rounded-full px-3 text-xs font-medium ${page.darkPreview === dark ? 'bg-primary text-primary-on' : 'text-fg-secondary'}`}
                    >
                      {dark ? t.darkPreview : t.lightPreview}
                    </button>
                  ))}
                </div>
              </div>
              <ThemePreview draft={draft} dark={page.darkPreview} />
              <p className="mt-3 text-xs text-fg-muted">{t.previewHint}</p>
            </aside>
          </div>
        </form>
      )}
      <Dialog
        open={page.confirmReset}
        onClose={() => page.setConfirmReset(false)}
        title={t.restoreTitle}
        description={t.restoreDescription}
        busy={page.saving}
      >
        <div className="mt-4 flex flex-wrap justify-end gap-3">
          <Button
            variant="secondary"
            disabled={page.saving}
            onClick={() => page.setConfirmReset(false)}
          >
            Keep current theme
          </Button>
          <Button busy={page.saving} onClick={() => void page.save(true)}>
            {t.reset}
          </Button>
        </div>
      </Dialog>
    </section>
  );
}

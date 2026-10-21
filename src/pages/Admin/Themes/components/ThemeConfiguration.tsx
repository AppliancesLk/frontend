import {
  seasonalPresets,
  seasonalText as t,
} from '../../../../utils/seasonalText';
import type { ThemeDraft } from '../helpers/theme.helpers';

export function ThemeConfiguration({
  draft,
  saving,
  onChange,
}: {
  draft: ThemeDraft;
  saving: boolean;
  onChange: (draft: ThemeDraft) => void;
}) {
  return (
    <>
      <fieldset
        disabled={saving || draft.theme === 'DEFAULT'}
        className="rounded-lg border border-line bg-surface p-5 sm:p-6"
      >
        <legend className="sr-only">{t.customize}</legend>
        <h2 className="text-xl font-semibold">{t.customize}</h2>
        {draft.theme === 'DEFAULT' ? (
          <p className="mt-3 text-sm leading-6 text-fg-muted">
            {t.defaultHint}
          </p>
        ) : (
          <>
            <p className="mt-2 text-xs leading-5 text-fg-muted">{t.defaults}</p>
            <div className="mt-5">
              <label htmlFor="season-headline" className="auth-label">
                {t.headline}
              </label>
              <input
                id="season-headline"
                className="ui-field"
                maxLength={80}
                value={draft.headline}
                placeholder={seasonalPresets[draft.theme].headline}
                onChange={(e) =>
                  onChange({ ...draft, headline: e.target.value })
                }
              />
            </div>
            <div className="mt-4">
              <label htmlFor="season-message" className="auth-label">
                {t.message}
              </label>
              <textarea
                id="season-message"
                className="ui-field min-h-28 py-3"
                maxLength={180}
                value={draft.message}
                placeholder={seasonalPresets[draft.theme].message}
                onChange={(e) =>
                  onChange({ ...draft, message: e.target.value })
                }
              />
            </div>
            <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={draft.showGreeting}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    showGreeting: e.target.checked,
                  })
                }
                className="h-5 w-5"
              />
              {t.greeting}
            </label>
            <label className="mt-1 flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={draft.decorations}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    decorations: e.target.checked,
                  })
                }
                className="h-5 w-5 shrink-0"
              />
              {t.decorations}
            </label>
            <label className="mt-1 flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={draft.animations}
                disabled={!draft.decorations || !draft.showGreeting}
                onChange={(e) =>
                  onChange({ ...draft, animations: e.target.checked })
                }
                className="h-5 w-5 shrink-0"
              />
              {t.animations}
            </label>
            <p className="mt-2 text-xs leading-5 text-fg-muted">
              {t.motionHint}
            </p>
          </>
        )}
      </fieldset>
      {draft.theme !== 'DEFAULT' && (
        <fieldset
          disabled={saving}
          className="rounded-lg border border-line bg-surface p-5 sm:p-6"
        >
          <legend className="sr-only">{t.timing}</legend>
          <h2 className="text-xl font-semibold">{t.timing}</h2>
          <div className="mt-4 space-y-3">
            {(['NOW', 'SCHEDULED'] as const).map((timing) => (
              <label
                key={timing}
                className="flex min-h-11 items-center gap-3 text-sm"
              >
                <input
                  type="radio"
                  name="seasonTiming"
                  checked={draft.timing === timing}
                  onChange={() => onChange({ ...draft, timing })}
                  className="h-5 w-5"
                />
                {timing === 'NOW' ? t.now : t.schedule}
              </label>
            ))}
          </div>
          {draft.timing === 'SCHEDULED' && (
            <div className="mt-4">
              <label htmlFor="season-start" className="auth-label">
                {t.startsAt}
              </label>
              <input
                id="season-start"
                type="datetime-local"
                required
                className="ui-field"
                value={draft.startsAt}
                onChange={(e) =>
                  onChange({ ...draft, startsAt: e.target.value })
                }
              />
            </div>
          )}
          <div className="mt-4">
            <label htmlFor="season-end" className="auth-label">
              {t.endsAt}
            </label>
            <input
              id="season-end"
              type="datetime-local"
              className="ui-field"
              value={draft.endsAt}
              onChange={(e) => onChange({ ...draft, endsAt: e.target.value })}
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-fg-muted">{t.timezone}</p>
        </fieldset>
      )}
    </>
  );
}

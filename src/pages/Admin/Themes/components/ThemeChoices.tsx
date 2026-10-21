import { SEASONAL_THEMES } from '../../../../types/seasonal-theme.types';
import {
  seasonalPresets,
  seasonalText as t,
} from '../../../../utils/seasonalText';
import { SeasonalArtwork } from '../../../../components/seasonal/SeasonalArtwork';
import type { ThemeDraft } from '../helpers/theme.helpers';

export function ThemeChoices({
  draft,
  saving,
  onChange,
}: {
  draft: ThemeDraft;
  saving: boolean;
  onChange: (draft: ThemeDraft) => void;
}) {
  return (
    <fieldset disabled={saving}>
      <legend className="mb-4 text-lg font-semibold">{t.choose}</legend>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-5">
        {SEASONAL_THEMES.map((theme) => (
          <label
            key={theme}
            className={`relative flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-surface transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary ${draft.theme === theme ? 'border-primary ring-1 ring-primary' : 'border-line hover:border-line-strong'}`}
          >
            <div
              className="season-choice-art"
              data-season={theme === 'DEFAULT' ? undefined : theme}
            >
              <SeasonalArtwork theme={theme} />
            </div>
            <div className="flex flex-1 flex-col p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-base font-semibold">
                  {seasonalPresets[theme].name}
                </span>
                <input
                  type="radio"
                  name="seasonalTheme"
                  aria-label={seasonalPresets[theme].name}
                  value={theme}
                  checked={draft.theme === theme}
                  onChange={() => onChange({ ...draft, theme })}
                  className="h-4 w-4 shrink-0 accent-primary"
                />
              </div>
              <p className="mt-2 text-xs leading-5 text-fg-secondary">
                {seasonalPresets[theme].description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

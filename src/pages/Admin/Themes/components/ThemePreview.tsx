import { BrandLogo } from '../../../../components/common/BrandLogo';
import { Icon } from '../../../../components/common/Icon';
import { SeasonalGreeting } from '../../../../components/seasonal/SeasonalGreeting';
import {
  seasonalPresets,
  seasonalText as t,
} from '../../../../utils/seasonalText';
import { DEFAULT_SEASONAL_THEME } from '../../../../types/seasonal-theme.types';
import type { ThemeDraft } from '../helpers/theme.helpers';

export function ThemePreview({
  draft,
  dark,
}: {
  draft: ThemeDraft;
  dark: boolean;
}) {
  const preset = seasonalPresets[draft.theme];
  const appearance = {
    ...DEFAULT_SEASONAL_THEME,
    theme: draft.theme,
    headline: draft.headline || preset.headline,
    message: draft.message || preset.message,
    showGreeting: draft.showGreeting,
    decorations: draft.decorations,
    animations: draft.animations,
  };
  return (
    <div
      className="season-preview"
      data-testid="season-preview"
      data-theme={dark ? 'dark' : 'light'}
      data-season={draft.theme !== 'DEFAULT' ? draft.theme : undefined}
    >
      <div className="season-preview-header flex items-center justify-between gap-3">
        <BrandLogo theme={draft.theme} decorations={draft.decorations} />
        <Icon name="bag" className="h-5 w-5 shrink-0" />
      </div>
      <SeasonalGreeting appearance={appearance} />
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-xl font-semibold">
            Good things for every day.
          </p>
          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
        </div>
        <p className="mt-2 text-sm text-fg-secondary">
          Your next upgrade, with a little seasonal charm.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3" aria-hidden="true">
          {(['appliance', 'phone'] as const).map((icon) => (
            <div
              key={icon}
              className="overflow-hidden rounded-md border border-line bg-surface"
            >
              <div className="flex h-24 items-center justify-center bg-subtle">
                <Icon name={icon} className="h-10 w-10 text-fg-muted" />
              </div>
              <div className="space-y-2 p-3">
                <div className="h-2 w-3/4 rounded-full bg-line" />
                <div className="h-2 w-1/2 rounded-full bg-line-subtle" />
                <div className="mt-3 h-6 rounded-sm bg-primary-subtle" />
              </div>
            </div>
          ))}
        </div>
        <span className="ui-button ui-button-primary mt-5 w-full">
          {t.browse}
        </span>
      </div>
    </div>
  );
}

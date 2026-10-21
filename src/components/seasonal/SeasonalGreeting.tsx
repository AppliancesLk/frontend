import { useSeasonalTheme } from '../../hooks/useSeasonalTheme';
import type { ActiveSeasonalTheme } from '../../types/seasonal-theme.types';
import { seasonalPresets, seasonalText } from '../../utils/seasonalText';
import { SeasonalParticles, SeasonalScene } from './SeasonalScene';
import { useSeasonalMotion } from './useSeasonalMotion';

export function SeasonalGreeting({
  appearance,
  compact = false,
}: {
  appearance?: ActiveSeasonalTheme;
  compact?: boolean;
}) {
  const { active } = useSeasonalTheme();
  const current = appearance ?? active;
  const {
    ref: bannerRef,
    running,
    controllable,
    paused,
    toggle,
  } = useSeasonalMotion(
    current.theme !== 'DEFAULT' &&
      current.showGreeting &&
      current.decorations &&
      current.animations,
  );
  if (current.theme === 'DEFAULT' || !current.showGreeting) return null;
  return (
    <aside
      ref={bannerRef}
      className={`season-greeting${compact ? ' season-greeting-compact' : ''}`}
      data-motion={running ? 'running' : controllable ? 'paused' : 'disabled'}
      data-greeting-theme={current.theme}
      aria-label={seasonalText.greetingLabel}
    >
      <div className="season-greeting-inner">
        <div className="season-greeting-copy">
          <span className="season-occasion">
            {seasonalPresets[current.theme].occasion}
          </span>
          <p className="season-greeting-title">{current.headline}</p>
          <p className="season-greeting-message">{current.message}</p>
        </div>
        {current.decorations && <SeasonalScene theme={current.theme} />}
      </div>
      {current.decorations && current.animations && (
        <SeasonalParticles theme={current.theme} />
      )}
      {controllable && (
        <button
          type="button"
          className="season-motion-toggle"
          onClick={toggle}
          aria-pressed={paused}
        >
          <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
          {paused ? seasonalText.playEffects : seasonalText.pauseEffects}
        </button>
      )}
    </aside>
  );
}

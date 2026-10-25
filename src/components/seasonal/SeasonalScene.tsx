import type { SeasonalTheme } from '../../types/seasonal-theme.types';
import { SeasonalArtwork } from './SeasonalArtwork';

function SantaSleigh() {
  return (
    <svg
      className="season-sleigh season-animated"
      viewBox="0 0 240 110"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M89 64c24-9 57-11 91-14" stroke="#e6c776" strokeWidth="1.5" />
      <g className="season-reindeer season-animated">
        <ellipse cx="183" cy="50" rx="19" ry="9" fill="#a9784d" />
        <path d="m193 47 8-18 9 3-4 21-13-6Z" fill="#a9784d" />
        <ellipse cx="210" cy="31" rx="10" ry="6" fill="#ba8b5b" />
        <circle cx="218" cy="30" r="3" fill="#d34b4b" />
        <circle cx="211" cy="28" r="1.3" fill="#25211e" />
        <path
          d="m203 27-4-13m3 8-9-3m10 0 5-8m-35 43-10 15m15-13 1 16m14-17 9 13m-4-15 12 3m-42-8-9-7"
          stroke="#c79966"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <rect x="36" y="42" width="18" height="20" rx="2" fill="#527959" />
      <path d="M45 42v20m-9-13h18" stroke="#edcf86" strokeWidth="2" />
      <path d="M53 55c0-16 7-25 17-25s18 13 18 25H53Z" fill="#b73947" />
      <circle cx="70" cy="25" r="9" fill="#f0c7a5" />
      <path d="M60 27c1 19 18 18 20-1-6 5-14 5-20 1Z" fill="#fff4df" />
      <path d="M60 19c0-15 20-20 25-8l-8 4-17 4Z" fill="#bd3444" />
      <path
        d="m59 19 19-4"
        stroke="#fff4df"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="86" cy="11" r="4" fill="#fff4df" />
      <path
        className="season-santa-wave season-animated"
        d="m79 39 11-13 6 1"
        stroke="#b73947"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M26 58h68c10 0 16-5 21-14-1 30-22 36-72 29L26 58Z"
        fill="#aa3041"
        stroke="#f0c878"
        strokeWidth="2"
      />
      <path
        d="m45 74-3 9m46-10 4 10M25 84h84c9 0 15-4 18-10"
        stroke="#e6c776"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="m13 38 2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1 2-4Z"
        fill="#f0dba3"
      />
    </svg>
  );
}

function NewYearLamp() {
  return (
    <svg
      className="season-lamp"
      viewBox="0 0 80 130"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M40 46v54m-22 12h44M27 99h26l12 13H15l12-13Zm-7-65h40L49 49H31L20 34Z"
        stroke="#e9c978"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="season-flame season-animated"
        d="M40 9c12 14 12 22 0 26-10-5-10-12 0-26Z"
        fill="#f6d179"
      />
      <path d="M40 24c4 6 4 9 0 11-4-2-4-5 0-11Z" fill="#fff1c5" />
      <path
        d="m35 5 5-4 5 4M28 119h24"
        stroke="#e9c978"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EasterBunny() {
  return (
    <svg
      className="season-bunny season-animated"
      viewBox="0 0 110 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="season-bunny-ears season-animated">
        <ellipse
          cx="39"
          cy="35"
          rx="11"
          ry="30"
          transform="rotate(-13 39 35)"
          fill="#f2e8e3"
          stroke="#d9c3c8"
          strokeWidth="2"
        />
        <ellipse
          cx="66"
          cy="35"
          rx="11"
          ry="30"
          transform="rotate(12 66 35)"
          fill="#f2e8e3"
          stroke="#d9c3c8"
          strokeWidth="2"
        />
        <path
          d="m36 16 6 33m27-32-6 32"
          stroke="#dcaabd"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <ellipse cx="54" cy="111" rx="30" ry="31" fill="#e8dedc" />
      <circle cx="82" cy="119" r="12" fill="#fff5ec" />
      <ellipse cx="53" cy="77" rx="31" ry="27" fill="#f8eee6" />
      <circle cx="42" cy="74" r="2.8" fill="#514555" />
      <circle cx="64" cy="74" r="2.8" fill="#514555" />
      <path
        d="m49 83 4 4 4-4h-8Zm4 4v6m-6 0c4 4 8 4 12 0"
        stroke="#ad718a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m35 86-16-3m16 9-16 3m52-9 16-3m-16 9 16 3"
        stroke="#c8aab3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse cx="36" cy="137" rx="16" ry="7" fill="#f8eee6" />
      <ellipse cx="66" cy="137" rx="16" ry="7" fill="#f8eee6" />
    </svg>
  );
}

export function SeasonalScene({ theme }: { theme: SeasonalTheme }) {
  return (
    <div className="season-scene" data-scene={theme} aria-hidden="true">
      <div className="season-scene-orbit" />
      <SeasonalArtwork theme={theme} className="season-greeting-art" />
      {theme === 'CHRISTMAS' && (
        <div className="season-sleigh-track">
          <SantaSleigh />
        </div>
      )}
      {theme === 'AVURUDU' && <NewYearLamp />}
      {theme === 'HALLOWEEN' && (
        <svg
          className="season-mist season-animated"
          viewBox="0 0 300 70"
          fill="none"
          focusable="false"
        >
          <path
            d="M0 30c35-25 60 25 100 0s65 20 105 0 70 20 100 0M-30 52c35-25 60 25 100 0s65 20 105 0 70 20 100 0"
            stroke="#d4c5d9"
            strokeOpacity=".2"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      )}
      {theme === 'EASTER' && <EasterBunny />}
    </div>
  );
}

export function SeasonalParticles({ theme }: { theme: SeasonalTheme }) {
  if (theme !== 'CHRISTMAS' && theme !== 'AVURUDU') return null;
  return (
    <div
      className={`season-particles ${theme === 'CHRISTMAS' ? 'season-snow' : 'season-petals'}`}
      aria-hidden="true"
    >
      {Array.from({ length: theme === 'CHRISTMAS' ? 16 : 8 }, (_, i) => (
        <span
          key={i}
          className="season-particle season-animated"
          style={{
            left: `${(i * 37 + 7) % 100}%`,
            width: `${3 + (i % 4)}px`,
            height: `${3 + (i % 4)}px`,
            animationDuration: `${8 + (i % 5)}s`,
            animationDelay: `${-i * 1.7}s`,
          }}
        />
      ))}
    </div>
  );
}

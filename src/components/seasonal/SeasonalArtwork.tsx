import type { SeasonalTheme } from '../../types/seasonal-theme.types';

export function SeasonalArtwork({
  theme,
  className = '',
}: {
  theme: SeasonalTheme;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 300 180"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {theme === 'CHRISTMAS' && (
        <>
          <circle cx="208" cy="81" r="68" fill="#ffffff" fillOpacity=".07" />
          <path
            d="m172 20 22 33h-12l25 35h-15l29 42h-98l29-42h-15l25-35h-12l22-33Z"
            fill="#2f775c"
            stroke="#a4c7ab"
            strokeWidth="1.5"
          />
          <path d="M172 130v17" stroke="#d5a968" strokeWidth="7" />
          <path
            d="m172 14 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"
            fill="#efd28b"
          />
          <path
            d="M154 67c12 7 25 7 36 0m-47 31c17 9 40 9 57 0"
            stroke="#f2d593"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="172" cy="53" r="3" fill="#f4b2b7" />
          <circle cx="153" cy="90" r="3" fill="#ecca83" />
          <circle cx="190" cy="111" r="3" fill="#f4b2b7" />
          <rect x="61" y="110" width="57" height="41" rx="4" fill="#ba3d51" />
          <rect x="56" y="103" width="67" height="13" rx="3" fill="#d66070" />
          <path
            d="M90 104v48m-2-48c-31-3-24-26-10-19 9 4 11 19 11 19Zm3 0c27-9 18-26 8-18-6 4-8 18-8 18Z"
            stroke="#f4deb1"
            strokeWidth="4"
          />
          <path
            d="m241 32 0 13m-6-6h12m-99-28v9m-4-4h8M48 57v12m-6-6h12"
            stroke="#f5e7cb"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <g fill="#e8efe7">
            <circle cx="222" cy="83" r="2" />
            <circle cx="66" cy="30" r="2" />
            <circle cx="118" cy="41" r="1.5" />
            <circle cx="258" cy="114" r="2" />
            <circle cx="42" cy="126" r="1.5" />
          </g>
          <path
            d="M36 154c63-9 144-9 234 0"
            stroke="#d9e6d6"
            strokeOpacity=".35"
            strokeLinecap="round"
          />
        </>
      )}
      {theme === 'AVURUDU' && (
        <>
          <circle cx="156" cy="76" r="53" fill="#f5d77e" fillOpacity=".22" />
          <circle
            cx="156"
            cy="76"
            r="30"
            fill="#edb94f"
            stroke="#f7dea1"
            strokeWidth="2"
          />
          <g
            className="season-sun-rays season-animated"
            stroke="#ebc260"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M156 30V17m0 118v-13m46-46h14m-120 0h14m79-33 10-10m-76 86-10 10m76-10 10 10m-76-86-10-10" />
          </g>
          <path
            className="season-leaves-left season-animated"
            d="M65 133c3-30 13-47 36-62m-27 46c-25-7-28-21-26-36 19 4 30 16 26 36Zm8-19c-12-22-7-39 4-50 13 16 15 33-4 50Z"
            fill="#73834e"
            stroke="#b8c17e"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            className="season-leaves-right season-animated"
            d="M238 134c-7-23-20-37-39-44m29 26c20-8 21-22 16-33-16 5-23 15-16 33Zm-15-16c7-20 0-33-12-41-8 15-7 29 12 41Z"
            fill="#657b4c"
            stroke="#afbb7a"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M107 147c14-25 84-26 98 0H107Z"
            fill="#b66a37"
            stroke="#f5d899"
            strokeWidth="2"
          />
          <path d="M121 148v8h69v-8" stroke="#eac77e" strokeWidth="2" />
          <path d="M119 140h74m-62-7h50" stroke="#dfac6b" strokeWidth="1.5" />
          <g fill="#f5d68b">
            <circle cx="50" cy="42" r="2" />
            <circle cx="244" cy="39" r="2" />
            <path d="m245 63 3 4-3 4-3-4 3-4Z" />
          </g>
        </>
      )}
      {theme === 'HALLOWEEN' && (
        <>
          <path
            d="M214 20a31 31 0 1 0 14 57 29 29 0 0 1-14-57Z"
            fill="#ead8b4"
          />
          <path
            className="season-bats season-animated"
            d="m51 50 10-8 9 8 10-8 10 8-19-2-1 6-1-6-18 2Zm156 45 9-7 8 7 9-7 9 7-17-2-1 6-1-6-16 2Z"
            fill="#bca6cc"
          />
          <path
            d="M138 86c-2-13 3-22 11-24"
            stroke="#b1bd87"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M141 89c-34-19-66 4-66 34 0 31 32 44 65 31 33 13 65 0 65-31 0-30-31-53-64-34Z"
            fill="#db7b36"
            stroke="#f5bd79"
            strokeWidth="2"
          />
          <ellipse
            cx="140"
            cy="122"
            rx="25"
            ry="37"
            stroke="#a94823"
            strokeWidth="2"
          />
          <path
            d="m108 113 9-12 8 13-17-1Zm48 0 8-12 9 13-17-1Z"
            fill="#38253d"
          />
          <path
            className="season-pumpkin-smile season-animated"
            d="m118 134 10 6 12-5 12 5 11-6c-8 17-35 19-45 0Z"
            fill="#38253d"
          />
          <g stroke="#d4beda" strokeWidth="1.5" strokeLinecap="round">
            <path d="M52 94v10m-5-5h10m184 26v10m-5-5h10M116 36v7m-3-4h6" />
          </g>
          <path
            d="M63 162c48-6 112-6 165 0"
            stroke="#c2a4d0"
            strokeOpacity=".35"
            strokeLinecap="round"
          />
        </>
      )}
      {theme === 'EASTER' && (
        <>
          <circle cx="154" cy="79" r="66" fill="#ffffff" fillOpacity=".14" />
          <path
            d="M67 151c-3-23-13-41-28-51m23 25c-24 1-29-12-28-25 16 0 27 8 28 25Zm-5-20c-15-14-15-27-8-39 14 9 20 23 8 39Z"
            fill="#7d987a"
          />
          <path
            d="M237 149c7-25 20-39 35-47m-26 26c23 3 30-8 31-21-17-3-28 5-31 21Zm8-21c16-12 19-24 14-36-15 6-23 18-14 36Z"
            fill="#7d987a"
          />
          <path
            d="M160 57c-21 0-40 36-40 62 0 27 19 39 40 39s40-12 40-39c0-26-19-62-40-62Z"
            fill="#bca1d3"
            stroke="#eadff3"
            strokeWidth="2"
          />
          <path
            d="m122 114 12-9 13 9 13-9 13 9 13-9 12 9m-75 19h74"
            stroke="#f6e4a7"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="M101 90c-16 0-31 27-31 47 0 19 15 28 31 28s31-9 31-28c0-20-15-47-31-47Z"
            fill="#e4bdaf"
            stroke="#f8e4d7"
            strokeWidth="2"
          />
          <g fill="#faf2d9">
            <circle cx="90" cy="125" r="3" />
            <circle cx="110" cy="139" r="3" />
            <circle cx="91" cy="150" r="3" />
            <circle cx="110" cy="112" r="3" />
          </g>
          <path
            d="m77 44 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Zm154 18 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"
            fill="#f4dda0"
          />
        </>
      )}
      {theme === 'DEFAULT' && (
        <g stroke="currentColor" strokeWidth="2" opacity=".7">
          <rect x="106" y="39" width="90" height="107" rx="22" />
          <path d="M134 67v18m33-18v18m-43 0h53v8a26 26 0 0 1-53 0v-8Zm27 35v14" />
          <circle cx="180" cy="53" r="5" fill="#facc15" stroke="none" />
        </g>
      )}
    </svg>
  );
}

export function BrandOrnament({ theme }: { theme: SeasonalTheme }) {
  if (theme === 'DEFAULT') return null;
  return (
    <svg
      viewBox="0 0 44 34"
      fill="none"
      className={`season-logo-ornament season-logo-${theme.toLowerCase()}`}
      data-ornament={theme}
      aria-hidden="true"
      focusable="false"
    >
      {theme === 'CHRISTMAS' && (
        <>
          <path
            d="M7 25C13 5 25 1 35 15l-7 2c-4-5-7-4-8 1l-1 9-12-2Z"
            fill="#b32840"
            stroke="#79243b"
            strokeWidth="1"
          />
          <rect
            x="4"
            y="23"
            width="23"
            height="7"
            rx="3.5"
            transform="rotate(-9 4 23)"
            fill="#fff8ec"
            stroke="#c8d1c7"
          />
          <circle cx="35" cy="16" r="5" fill="#fff8ec" stroke="#c8d1c7" />
        </>
      )}
      {theme === 'AVURUDU' && (
        <>
          <g stroke="#c98b25" strokeWidth="1.5" strokeLinecap="round">
            <path d="M25 2v4m0 22v4M10 17h4m22 0h4M14 6l3 3m16 16 3 3m0-22-3 3M17 25l-3 3" />
          </g>
          <circle cx="25" cy="17" r="8" fill="#f2cc6e" stroke="#b7721f" />
          <path
            d="M5 28c-2-8 0-13 8-16 4 8 1 14-8 16Z"
            fill="#71834c"
            stroke="#b4c17f"
          />
        </>
      )}
      {theme === 'HALLOWEEN' && (
        <>
          <path
            d="m10 25 9-23 5 11 9 6-6 6H10Z"
            fill="#573469"
            stroke="#b8a0c6"
          />
          <path d="m13 17 15 3-3 5-13-2 1-6Z" fill="#ed9b4e" />
          <ellipse
            cx="22"
            cy="26"
            rx="19"
            ry="4"
            fill="#452952"
            stroke="#b8a0c6"
          />
          <path d="m20 8 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" fill="#f8d68d" />
        </>
      )}
      {theme === 'EASTER' && (
        <>
          <ellipse
            cx="15"
            cy="15"
            rx="5"
            ry="14"
            transform="rotate(-19 15 15)"
            fill="#f4e7f5"
            stroke="#9d78b7"
            strokeWidth="1.5"
          />
          <ellipse
            cx="29"
            cy="15"
            rx="5"
            ry="14"
            transform="rotate(17 29 15)"
            fill="#f4e7f5"
            stroke="#9d78b7"
            strokeWidth="1.5"
          />
          <path
            d="m12 8 4 14m15-14-3 14"
            stroke="#d9b3cf"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

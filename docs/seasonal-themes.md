# Seasonal themes

Open **Admin → Seasonal themes** (`/admin/themes`) to choose Default, Avurudu, Christmas, Halloween or Easter/Pasku. Preview light and dark appearances, optionally edit the greeting, and independently enable the greeting strip, decorative artwork and animation. Changes become public only after **Save theme**.

Choose **Start immediately**, or schedule a start and optional end. All editor dates use Sri Lanka time (UTC+05:30), regardless of the administrator's browser timezone. An end automatically restores Default. **Restore default** clears the current seasonal selection and schedule after confirmation. There is one selected occasion/window at a time.

Default retains the existing site appearance. Seasonal selections never override the existing site colors, buttons, backgrounds, navigation or light/dark/system preferences. They add an optional neutral banner, local SVG scenes and logo ornaments across the shared layouts. The homepage uses a full scene; other customer, authentication and repairer pages use a more compact banner. Admin pages retain their existing colors and show logo ornaments plus the editor preview.

- Christmas: bounded snowfall, an evergreen tree, and an occasional Santa sleigh with a waving Santa and reindeer.
- Avurudu: rotating sun rays, swaying leaves, drifting petals and a traditional oil lamp with a gentle flame.
- Halloween: floating bats, a slowly glowing pumpkin and drifting mist.
- Easter/Pasku: painted eggs and a bunny with a subtle hop and ear movement.

The admin can independently disable the banner, artwork/logo ornaments, and animation. Visitors can pause effects; that preference lasts for the tab session. Reduced-motion and data-saving preferences produce static artwork. CSS effects pause when the banner is offscreen or the document is hidden. Motion is limited to the banner, decorative layers cannot intercept clicks, and print styles remove them. No animation library, canvas render loop, remote artwork, external scripts, or per-frame JavaScript are used. Mobile renders fewer particles.

`SeasonalThemeProvider` uses the shared API service to load the public backend configuration. It refreshes at most every minute while visible, on focus/visibility changes, and near a known schedule boundary. Known end times restore Default locally even if a refresh hangs. Public requests time out after eight seconds; failures fall back to Default without blocking shopping. A change made by another admin can take up to a minute to reach an already open page.

The admin editor uses the protected API and optimistic versions to prevent overwriting another editor's changes. A conflicting edit displays an error with a reload action. Custom copy renders as text. Artwork is local SVG and requires no external image downloads or new packages.

Backend dependency: apply `1792500000000-StorefrontSeasonalTheme` and deploy the `storefront-theme` module. Also apply `1792500100000-SeasonalThemeAnimations`. API details are in `docs/seasonal-themes.md` in the backend repository.

## Verification

Use a development/test database: these suites temporarily change the shared seasonal setting.

```sh
npm run test:themes
npm run test:themes:e2e
npm run build
npm run lint
```

Browser tests start the real backend with mocked SMTP, use temporary accounts, and cover desktop/mobile previews, save/restore, all presets, unchanged site color tokens in light/dark mode, shared page coverage, visibility and animation switches, visitor pause/resume, offscreen pausing, reduced motion, literal text, scheduling, expiry during an API stall, and API failure. The previous theme configuration is restored afterward. Run these tests separately from backend seasonal integration tests because they share one setting.

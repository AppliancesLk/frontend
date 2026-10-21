const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadTypeScript } = require('./helpers/load-typescript.cjs');
const { colomboLocal, colomboIso, themeUpdate, themeDraft } = loadTypeScript(
  path.resolve(__dirname, '../src/pages/Admin/Themes/helpers/theme.helpers.ts'),
);
const draft = {
  theme: 'CHRISTMAS',
  headline: '  Happy holidays  ',
  message: '  Welcome  ',
  showGreeting: true,
  decorations: false,
  animations: false,
  timing: 'NOW',
  startsAt: '',
  endsAt: '',
};
test('Sri Lanka scheduling is independent of the browser timezone and round-trips', () => {
  assert.equal(colomboLocal('2026-12-24T18:30:00Z'), '2026-12-25T00:00');
  assert.equal(colomboIso('2026-12-25T00:00'), '2026-12-24T18:30:00.000Z');
  assert.equal(colomboIso(''), null);
  for (const value of [
    '2026-02-30T12:00',
    '2026-12-25',
    'wrong',
    '2026-13-01T00:00',
  ])
    assert.throws(() => colomboIso(value));
});
test('Default clears stale decorations, text and schedules', () => {
  const result = themeUpdate(
    { ...draft, theme: 'DEFAULT', startsAt: 'invalid', endsAt: 'invalid' },
    12,
  );
  assert.deepEqual(
    { ...result },
    {
      theme: 'DEFAULT',
      headline: '',
      message: '',
      showGreeting: true,
      decorations: true,
      animations: true,
      startsAt: null,
      endsAt: null,
      version: 12,
    },
  );
});
test('updates trim text and preserve switches and version', () => {
  const result = themeUpdate(draft, 4);
  assert.equal(result.headline, 'Happy holidays');
  assert.equal(result.message, 'Welcome');
  assert.equal(result.decorations, false);
  assert.equal(result.version, 4);
  assert.equal(result.startsAt, null);
});
test('scheduled windows reject missing starts, expired ends and reversed dates', () => {
  const now = Date.parse('2026-12-01T00:00:00Z');
  assert.throws(() => themeUpdate({ ...draft, timing: 'SCHEDULED' }, 0, now));
  assert.throws(() =>
    themeUpdate({ ...draft, endsAt: '2026-11-01T00:00' }, 0, now),
  );
  assert.throws(() =>
    themeUpdate(
      {
        ...draft,
        timing: 'SCHEDULED',
        startsAt: '2026-12-26T00:00',
        endsAt: '2026-12-25T00:00',
      },
      0,
      now,
    ),
  );
  const result = themeUpdate(
    {
      ...draft,
      timing: 'SCHEDULED',
      startsAt: '2026-12-24T00:00',
      endsAt: '2026-12-26T00:00',
    },
    0,
    now,
  );
  assert.equal(result.startsAt, '2026-12-23T18:30:00.000Z');
});
test('existing settings populate the editor in Sri Lanka time', () => {
  const result = themeDraft({
    ...draft,
    startsAt: '2026-12-24T18:30:00Z',
    endsAt: null,
  });
  assert.equal(result.timing, 'SCHEDULED');
  assert.equal(result.startsAt, '2026-12-25T00:00');
  assert.equal(result.endsAt, '');
});

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const suites = (
  process.env.UI_REGRESSION_SUITES ||
  'admin-orders,cart,catalog,chat,checkout,experience,home,orders'
).split(',');
const failed = [];
for (const suite of suites) {
  console.log('\nUI regression suite: ' + suite);
  // A fresh backend per existing suite keeps the real authentication limiter enabled.
  const result = spawnSync(
    process.execPath,
    [
      path.resolve(__dirname, '../node_modules/@playwright/test/cli.js'),
      'test',
      '--config',
      'playwright.ui-regression.config.cjs',
    ],
    {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        UI_REGRESSION_CONFIG: 'playwright.' + suite + '.config.cjs',
      },
    },
  );
  if (result.status !== 0) failed.push(suite);
}
if (failed.length) {
  console.error('UI regression suites needing attention: ' + failed.join(', '));
  process.exitCode = 1;
} else console.log('All ' + suites.length + ' UI regression suites passed.');

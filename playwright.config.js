const { defineConfig, devices } = require('@playwright/test');
const lingo = require('./lingo.config');

const isCI = !!process.env.CI;
const withUA = (device) => ({
  ...device,
  userAgent: lingo.userAgentSuffix ? `${device.userAgent} ${lingo.userAgentSuffix}` : device.userAgent,
});

module.exports = defineConfig({
  testDir: './lingo/features',
  testMatch: '**/*.test.js',
  outputDir: 'reports/artifacts',

  timeout: 90_000,
  expect: { timeout: 15_000 },

  // Every test gets a brand-new browser context = no cookies, no cache, no storage.
  // That satisfies "make sure cookie and cache is cleared" from the manual test cases.
  fullyParallel: false,
  workers: 1,
  retries: isCI ? 1 : 0, // a pass-on-retry is reported as "flaky", not as a failure
  forbidOnly: isCI,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['./reporters/slack-reporter.js'],
  ],

  use: {
    baseURL: lingo.baseURL,
    locale: 'en-US',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },

  projects: [
    // Real installed Google Chrome: Playwright's bundled Chromium is blocked on prod.
    { name: 'desktop-chrome', use: { ...withUA(devices['Desktop Chrome']), channel: 'chrome' } },
    { name: 'desktop-safari', use: { ...withUA(devices['Desktop Safari']) } },
    { name: 'mobile-chrome', use: { ...withUA(devices['Pixel 7']), channel: 'chrome' } },
    { name: 'mobile-safari', use: { ...withUA(devices['iPhone 14']) } },
  ],
});

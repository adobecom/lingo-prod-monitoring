const { test } = require('@playwright/test');
const { name, features } = require('./akamai-redirects.spec.js');
const { resolve } = require('#helpers/url.js');
const { openPage } = require('#helpers/page.js');
const { note } = require('#helpers/note.js');
const { checkNoRedirect, checkRedirectedTo } = require('#steps/redirect.step.js');

test.describe(name, () => {
  for (const f of features) {
    test(`${f.name},${f.tags}`, async ({ page, baseURL }) => {
      note('tcid', f.tcid);
      const url = resolve(baseURL, f.path);
      let nav;

      // Fresh browser context per test = cookies and cache are clean.
      await test.step(`step-1: Open ${f.path} with a clean browser`, async () => { nav = await openPage(page, url); });

      if (f.behavior === 'stay') {
        await test.step(`step-2: Not redirected, still on ${f.path}`, () => checkNoRedirect({ nav, requestedUrl: url }));
      } else {
        await test.step(`step-2: Redirected to ${f.to} and no "${f.forbid}" in the url`, () => checkRedirectedTo({ nav, expectedPath: f.to, forbid: f.forbid }));
      }
    });
  }
});

const { test } = require('@playwright/test');
const { name, features } = require('./unique-pages.spec.js');
const { resolve } = require('#helpers/url.js');
const { openPage } = require('#helpers/page.js');
const { note } = require('#helpers/note.js');
const { checkNoRedirect } = require('#steps/redirect.step.js');

test.describe(name, () => {
  for (const f of features) {
    test(`${f.name},${f.tags}`, async ({ page, baseURL }) => {
      note('tcid', f.tcid);
      const url = resolve(baseURL, f.path);
      let nav;

      await test.step(`step-1: Open ${f.path} with a clean browser`, async () => { nav = await openPage(page, url); });
      await test.step('step-2: User stays on the same page, no redirect', () => checkNoRedirect({ nav, requestedUrl: url }));
    });
  }
});

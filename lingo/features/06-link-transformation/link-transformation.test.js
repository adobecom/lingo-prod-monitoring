const { test } = require('@playwright/test');
const { name, features } = require('./link-transformation.spec.js');
const { resolve } = require('#helpers/url.js');
const { openPage } = require('#helpers/page.js');
const { note } = require('#helpers/note.js');
const { checkLinkTransformation } = require('#steps/link-transform.step.js');

test.describe(name, () => {
  for (const f of features) {
    test(`${f.name},${f.tags}`, async ({ page, baseURL }) => {
      note('tcid', f.tcid);
      const url = resolve(baseURL, f.path);

      await test.step(`step-1: Open ${f.path} with a clean browser`, async () => { await openPage(page, url); });
      await test.step(`step-2: Links point to the base site /${f.baseLocale}/, not to child regions`, () => checkLinkTransformation({ page, rule: f }));
    });
  }
});

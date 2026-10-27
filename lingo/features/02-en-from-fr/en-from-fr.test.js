const { test } = require('@playwright/test');
const { name, features } = require('./en-from-fr.spec.js');
const { resolve } = require('#helpers/url.js');
const { openPage } = require('#helpers/page.js');
const { note } = require('#helpers/note.js');
const { checkNoRedirect } = require('#steps/redirect.step.js');
const { checkPageLanguage } = require('#steps/language.step.js');
const { checkPriceFormat } = require('#steps/pricing.step.js');

test.describe(name, () => {
  for (const f of features) {
    test(`${f.name},${f.tags}`, async ({ page, baseURL }) => {
      note('tcid', f.tcid);
      const url = resolve(baseURL, f.path);
      let nav;

      await test.step(`step-1: Open ${f.path} with a clean browser`, async () => { nav = await openPage(page, url); });
      await test.step('step-2: Page is not redirected', () => checkNoRedirect({ nav, requestedUrl: url }));
      await test.step('step-3: Page content is English only', () => checkPageLanguage({ page, expected: 'en' }));
      await test.step(`step-4: Price shows ${f.priceText.join(' / ')}`, () => checkPriceFormat({ page, anyOf: f.priceText }));
    });
  }
});

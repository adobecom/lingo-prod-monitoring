const { test } = require('@playwright/test');
const { name, features } = require('./region-cookies.spec.js');
const { openPage } = require('#helpers/page.js');
const { note } = require('#helpers/note.js');
const { selectRegion, checkRegionCookies } = require('#steps/cookie.step.js');

test.describe(name, () => {
  for (const f of features) {
    test(`${f.name},${f.tags}`, async ({ page, context, baseURL }) => {
      note('tcid', f.tcid);

      await test.step('step-1: Open the home page with a clean browser', async () => { await openPage(page, `${baseURL}/`); });
      await test.step(`step-2: Footer > Change region > ${f.code.toUpperCase()}`, () => selectRegion({ page, rule: f }));
      await test.step(`step-3: Cookies country=${f.cookies.country} and intl=${f.cookies.intl}`, () => checkRegionCookies({ context, rule: f }));
    });
  }
});

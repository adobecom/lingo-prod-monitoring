const { expect } = require('@playwright/test');
const { note } = require('#helpers/note.js');

const ADOBE_HOST = /^www\.(stage\.)?adobe\.com$/;
const LOCALE_SEGMENT = /^[a-z]{2}(_[a-z]{2})?$/;

/**
 * Links on a child-region visit must point to the BASE locale site.
 *  - FAIL when an adobe.com link uses a forbidden child prefix (/be_fr/ ...), unless the path is an allowed region-unique page.
 *  - FAIL when no link uses the base locale at all (transformation did not run).
 *  - Locale counts are always written to the report.
 * Links inside the region picker are ignored: that list legitimately links to every region.
 */
async function checkLinkTransformation({ page, rule }) {
  const links = await page.locator('a[href]').evaluateAll((as) => as
    .filter((a) => !a.closest('.feds-regionPicker, [class*="regionPicker" i], .dialog-modal, [role="dialog"]'))
    .map((a) => a.href));

  const counts = {};
  const violations = [];
  for (const href of links) {
    let url;
    try { url = new URL(href); } catch { continue; }
    if (!ADOBE_HOST.test(url.hostname)) continue;
    const seg = url.pathname.split('/')[1] || '';
    const key = LOCALE_SEGMENT.test(seg) ? seg : '(no locale)';
    counts[key] = (counts[key] || 0) + 1;
    const allowed = (rule.allowedPathPatterns || []).some((re) => re.test(url.pathname));
    if (rule.childLocales.includes(seg) && !allowed) violations.push(url.pathname + url.search);
  }

  note('Link locales', JSON.stringify(counts));
  const unique = [...new Set(violations)];
  expect.soft(unique, `links still point to a child region instead of /${rule.baseLocale}/ (${unique.length}):\n${unique.slice(0, 15).join('\n')}`).toEqual([]);
  expect.soft(counts[rule.baseLocale] || 0, `no link points to the base site /${rule.baseLocale}/`).toBeGreaterThan(0);
}

module.exports = { checkLinkTransformation };

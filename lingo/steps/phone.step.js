const { expect } = require('@playwright/test');
const gnav = require('#blocks/gnav.js');
const { containsPhone, clean } = require('#helpers/text.js');
const { note } = require('#helpers/note.js');

// Read text of an area INCLUDING collapsed menus (textContent, not innerText), plus tel: links.
const readArea = (page, selector) => page.evaluate((sel) => {
  const el = document.querySelector(sel);
  if (!el) return { text: '', tels: [] };
  return {
    text: el.textContent || '',
    tels: [...el.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href').replace(/^tel:/i, '')),
  };
}, selector);

const softPoll = (fn, message) => expect.configure({ soft: true }).poll(fn, { message, timeout: 20_000, intervals: [500, 1000, 2000] });

/** Header and body each show their expected phone number (formatting ignored). */
async function checkPhoneNumbers({ page, rule }) {
  const headerSel = (await page.locator(gnav.root).count()) ? gnav.root : gnav.anyHeader;

  await softPoll(async () => {
    const { text, tels } = await readArea(page, headerSel);
    return containsPhone(text, rule.header, tels);
  }, `header phone ${rule.header} not found`).toBe(true);

  await softPoll(async () => {
    const { text, tels } = await readArea(page, 'main');
    return containsPhone(text, rule.body, tels);
  }, `body phone ${rule.body} not found`).toBe(true);

  const header = await readArea(page, headerSel);
  const body = await readArea(page, 'main');
  note('Phone numbers', `header tel: ${header.tels.join(', ') || '-'} | body tel: ${body.tels.join(', ') || '-'}`);
  note('Header text sample', clean(header.text).slice(0, 160));
}

module.exports = { checkPhoneNumbers };

const { expect } = require('@playwright/test');
const price = require('#blocks/price.js');
const { clean, compact, containsAny } = require('#helpers/text.js');
const { note } = require('#helpers/note.js');

const PRICE_TIMEOUT = 25_000;

async function resolvedPriceTexts(page) {
  await expect.soft(page.locator(price.amount).first(), 'no resolved price on the page').toBeAttached({ timeout: PRICE_TIMEOUT });
  return (await page.locator(price.resolved).allTextContents()).map(clean).filter(Boolean);
}

/**
 * Categories 2 + 3: at least one resolved price carries the expected currency/tax text,
 * e.g. '€/mo incl. VAT' matches "€14.99/mo incl. VAT" (amount and spacing are ignored).
 */
async function checkPriceFormat({ page, anyOf }) {
  const texts = await resolvedPriceTexts(page);
  note('Price sample', [...new Set(texts)].slice(0, 3).join(' | ') || '(none)');
  const hit = texts.some((t) => containsAny(t, anyOf));
  expect.soft(hit, `no price contains any of [${anyOf.join(' | ')}]; saw: ${[...new Set(texts)].slice(0, 3).join(' | ')}`).toBe(true);
}

/**
 * Category 5: price shown, currency symbol belongs to the region, tax / VAT info shown (or reported).
 */
async function checkDynamicPricing({ page, rule }) {
  const texts = await resolvedPriceTexts(page);
  note('Price sample', [...new Set(texts)].slice(0, 3).join(' | ') || '(none)');

  expect.soft(texts.some((t) => /\d/.test(t)), 'no price with an amount').toBe(true);

  const symbols = [...new Set((await page.locator(`${price.resolved} ${price.currencySymbol}`).allTextContents()).map(clean))].filter(Boolean);
  note('Currency symbols', symbols.join(' | ') || '(none)');
  expect.soft(symbols.length, 'prices with a currency symbol').toBeGreaterThan(0);
  const wrong = symbols.filter((s) => !rule.symbols.some((v) => compact(s).includes(compact(v))));
  expect.soft(wrong, `currency is not ${rule.currency} (${rule.symbols.join(' / ')}); found: ${wrong.join(' | ')}`).toEqual([]);

  const taxLabels = await page.locator(`${price.resolved} ${price.taxLabel}`).count();
  note('Tax label', `${taxLabels} price(s) with a tax / VAT label`);
  if (rule.tax === 'required') expect.soft(taxLabels, 'tax / VAT info missing on prices').toBeGreaterThan(0);
}

module.exports = { checkPriceFormat, checkDynamicPricing };

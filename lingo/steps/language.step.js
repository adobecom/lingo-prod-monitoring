const { expect } = require('@playwright/test');
const { detectLanguage } = require('#helpers/text.js');
const { mainText } = require('#helpers/page.js');
const { note } = require('#helpers/note.js');

// Max share of the "other" language's function words tolerated (quotes, brand names, legal snippets).
const TOLERANCE = 0.1;
const MIN_WORDS = 40;

/** Page content is in ONE language: 'en' (no French) or 'fr' (no English). */
async function checkPageLanguage({ page, expected }) {
  const text = await mainText(page);
  const d = detectLanguage(text);
  const htmlLang = await page.evaluate(() => document.documentElement.lang);
  note('Language', `expected ${expected} | html lang="${htmlLang}" | words=${d.words} en-hits=${d.en} fr-hits=${d.fr}`);

  expect.soft(d.words, 'page has too little text to judge its language').toBeGreaterThan(MIN_WORDS);
  if (expected === 'en') {
    expect.soft(d.frShare, `French content found on an English page (fr ${d.fr} vs en ${d.en})`).toBeLessThanOrEqual(TOLERANCE);
    expect.soft(d.en, 'no English content found').toBeGreaterThan(0);
  } else {
    expect.soft(d.enShare, `English content found on a French page (en ${d.en} vs fr ${d.fr})`).toBeLessThanOrEqual(TOLERANCE);
    expect.soft(d.fr, 'no French content found').toBeGreaterThan(0);
  }
}

module.exports = { checkPageLanguage };

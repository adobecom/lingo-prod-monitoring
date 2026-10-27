const NBSP = /\u00a0/g;

/** Collapse whitespace (incl. non-breaking spaces). */
const clean = (s = '') => String(s).replace(NBSP, ' ').replace(/\s+/g, ' ').trim();

/** Remove amounts such as 14.99 / 1 234,50 so "€14.99/mo incl. VAT" can be matched with "€/mo incl. VAT". */
const stripNumbers = (s) => String(s).replace(/\d+(?:[.,\u00a0 ]\d+)*/g, '');

/** Comparison form: no amounts, no whitespace, lower case.  "€ 14.99 /mo incl. VAT" -> "€/moincl.vat" */
const compact = (s) => stripNumbers(clean(s)).replace(/\s+/g, '').toLowerCase();

/** True when `text` contains any of `variants` (compared in compact form). */
const containsAny = (text, variants) => {
  const hay = compact(text);
  return variants.some((v) => hay.includes(compact(v)));
};

/**
 * Phone match that ignores formatting: "0800 80 982" == "0800-80-982" == "0800.80.982".
 * `tels` = values of tel: links (may carry a country code, e.g. +18009159428).
 */
function containsPhone(text, phone, tels = []) {
  const digits = String(phone).replace(/\D/g, '');
  const pattern = digits.split('').join('[^\\d]{0,3}');
  const re = new RegExp(`(?<!\\d)${pattern}(?!\\d)`);
  if (re.test(String(text).replace(NBSP, ' '))) return true;
  return tels.some((t) => String(t).replace(/\D/g, '').endsWith(digits));
}

// Language detection by common function words. Product names ("Creative Cloud") are not in the lists.
const EN = new Set('the and of to in for with your you is that from are as by all get our more this it at an be can will have has not what how which their'.split(' '));
const FR = new Set('le la les de des du et en pour avec vos votre vous est sur que qui dans un une au aux par ou pas ce cette nous sont ses leur tout'.split(' '));

function detectLanguage(text) {
  const words = (String(text).toLowerCase().match(/[\p{L}']+/gu) || []).map((w) => w.replace(/^'+|'+$/g, ''));
  let en = 0;
  let fr = 0;
  for (const w of words) {
    if (EN.has(w)) en += 1;
    if (FR.has(w)) fr += 1;
  }
  const hits = en + fr;
  return {
    words: words.length,
    en,
    fr,
    frShare: hits ? fr / hits : 0,
    enShare: hits ? en / hits : 0,
  };
}

module.exports = { clean, stripNumbers, compact, containsAny, containsPhone, detectLanguage };

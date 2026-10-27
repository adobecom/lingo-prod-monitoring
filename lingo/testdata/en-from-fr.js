// Category 2 — Visit the ENGLISH site from France and its child countries.
//   path        opened as-is (akamaiLocale simulates the visitor's country)
//   priceText   any ONE of these must appear in a resolved price (amounts are ignored, whitespace is ignored)
//   language    page content must be English only
module.exports = [
  { id: 'fr',    path: '/creativecloud.html?akamaiLocale=fr',    language: 'en', priceText: ['€/mo incl. VAT'] },
  { id: 'ca_fr', path: '/creativecloud.html?akamaiLocale=ca_fr', language: 'en', priceText: ['CAD $', '$ CAD', 'CAD'] },
  { id: 'be',    path: '/creativecloud.html?akamaiLocale=be',    language: 'en', priceText: ['€/mo incl. VAT'] },
  { id: 'lu',    path: '/creativecloud.html?akamaiLocale=lu',    language: 'en', priceText: ['€/mo incl. VAT'] },
  { id: 'ch',    path: '/creativecloud.html?akamaiLocale=ch',    language: 'en', priceText: ['CHF /mo incl. VAT'] },
];

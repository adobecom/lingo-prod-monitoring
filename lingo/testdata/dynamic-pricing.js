// Category 5 — Currency format / dynamic pricing: price, currency, tax / VAT info.
//   symbols  every resolved price's currency symbol must contain ONE of these
//   tax      'required' = tax / VAT label must be shown; 'report' = only record what is shown
// The sheet asks for "Tax / VAT info" on every row. CAD / SGD / NZD prices are not tax-inclusive in the reference
// repo (regions.js: ca taxLabel:false), so those are report-only. Flip to 'required' once confirmed.
module.exports = [
  { id: 'fr-ch',    path: '/fr/creativecloud.html?akamaiLocale=ch',    currency: 'CHF', symbols: ['CHF'],            tax: 'required' },
  { id: 'fr-ca_fr', path: '/fr/creativecloud.html?akamaiLocale=ca_fr', currency: 'CAD', symbols: ['CAD', 'C$', 'CA$'], tax: 'report' },
  { id: 'fr-be',    path: '/fr/creativecloud.html?akamaiLocale=be',    currency: 'EUR', symbols: ['€'],              tax: 'required' },
  { id: 'fr-lu',    path: '/fr/creativecloud.html?akamaiLocale=lu',    currency: 'EUR', symbols: ['€'],              tax: 'required' },
  { id: 'en-sg',    path: '/creativecloud.html?akamaiLocale=sg',       currency: 'SGD', symbols: ['S$', 'SGD'],      tax: 'report' },
  { id: 'en-nz',    path: '/creativecloud.html?akamaiLocale=nz',       currency: 'NZD', symbols: ['NZ$', 'NZD'],     tax: 'report' },
  { id: 'fr-students-premiere-ch', path: '/fr/creativecloud/buy/students/premiere-pro.html?akamaiLocale=ch', currency: 'CHF', symbols: ['CHF'], tax: 'required' },
  { id: 'fr-students-premiere-lu', path: '/fr/creativecloud/buy/students/premiere-pro.html?akamaiLocale=lu', currency: 'EUR', symbols: ['€'],   tax: 'required' },
];

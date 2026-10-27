// Category 3 — Visit the FR site from France and its child countries.
// NOTE: the Excel row for /fr/ + akamaiLocale=ch expects '€/mo incl. VAT' (English text, euro) — a copy-paste of the
// first row. Switzerland is CHF everywhere else in the sheet, so CHF is used here. CONFIRM with the Lingo team.
module.exports = [
  { id: 'ch',    path: '/fr/creativecloud.html?akamaiLocale=ch',    language: 'fr', priceText: ['CHF'] },
  { id: 'ca_fr', path: '/fr/creativecloud.html?akamaiLocale=ca_fr', language: 'fr', priceText: ['CAD $', '$ CAD', 'CAD'] },
  { id: 'be',    path: '/fr/creativecloud.html?akamaiLocale=be',    language: 'fr', priceText: ['€/mois TTC'] },
  { id: 'lu',    path: '/fr/creativecloud.html?akamaiLocale=lu',    language: 'fr', priceText: ['€/mois TTC'] },
];

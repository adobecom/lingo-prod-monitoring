// Category 7 — Phone number check on /fr/howtobuy/buying-programs.html.
//   header : number expected in the page header (gnav)
//   body   : number expected in the page body (main)
// ⚠ Excel: for 'ca' the header is 800-915-9428 and the body 915-800-9428 (same digits, swapped groups); every other
// row has body 915-800-9428. Looks like a typo in one of them — CONFIRM, then fix `ca` here (one line).
// Formatting is ignored when matching (spaces, dashes, dots).
const PATH = '/fr/howtobuy/buying-programs.html';
module.exports = [
  { id: 'ca', path: `${PATH}?akamaiLocale=ca`, header: '800-915-9428', body: '915-800-9428' },
  { id: 'be', path: `${PATH}?akamaiLocale=be`, header: '0800 80 982',  body: '915-800-9428' },
  { id: 'ch', path: `${PATH}?akamaiLocale=ch`, header: '0800 723 9761', body: '915-800-9428' },
  { id: 'lu', path: `${PATH}?akamaiLocale=lu`, header: '800 27 340',   body: '915-800-9428' },
];

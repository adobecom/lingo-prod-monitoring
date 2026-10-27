// Category 8 — INTL and country cookie setting after choosing a region in the footer "Change region".
// (The Excel spells the cookie "county"; the intended cookie is "country".)
//   code     region folder in the list link (/fr/, /jp/)
//   name     visible label fallback
//   cookies  expected cookie values (compared case-insensitively)
module.exports = [
  { id: 'france', code: 'fr', name: /France/i,        cookies: { country: 'fr', intl: 'fr' } },
  { id: 'japan',  code: 'jp', name: /Japan|日本/i,     cookies: { country: 'jp', intl: 'jp' } },
];

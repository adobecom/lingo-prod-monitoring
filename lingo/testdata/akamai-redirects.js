// Category 1 — Akamai redirects check.
//   behavior 'stay'     : browser must NOT be redirected; final path == requested path
//   behavior 'redirect' : final path must be `to`, and must not contain `forbid`
module.exports = [
  { id: 'in', path: '/in/creativecloud.html', behavior: 'stay' },
  { id: 'fr', path: '/fr/creativecloud.html', behavior: 'stay' },
  { id: 'au', path: '/au/creativecloud.html', behavior: 'stay' },
  { id: 'sg', path: '/sg/creativecloud.html', behavior: 'redirect', to: '/creativecloud.html', forbid: '/sg/' },
  { id: 'ca', path: '/ca/creativecloud.html', behavior: 'redirect', to: '/creativecloud.html', forbid: '/ca/' },
  { id: 'nz', path: '/nz/creativecloud.html', behavior: 'redirect', to: '/creativecloud.html', forbid: '/nz/' },
];

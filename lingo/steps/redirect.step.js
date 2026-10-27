const { expect } = require('@playwright/test');
const { pathOf } = require('#helpers/url.js');
const { note } = require('#helpers/note.js');

const describeChain = (nav) => (nav.chain.length
  ? nav.chain.map((h) => `${h.status} ${h.url}`).join(' → ') + ` → ${nav.finalUrl}`
  : 'no redirect');

/** The browser must end on the very page it asked for: no server redirect, same path, HTTP 200. */
function checkNoRedirect({ nav, requestedUrl }) {
  note('Redirects', describeChain(nav));
  expect.soft(nav.chain.length, `page was redirected: ${describeChain(nav)}`).toBe(0);
  expect.soft(pathOf(nav.finalUrl), `final path differs from requested ${pathOf(requestedUrl)}`).toBe(pathOf(requestedUrl));
  expect.soft(nav.response?.status(), `HTTP status of ${nav.finalUrl}`).toBe(200);
}

/** The browser must be redirected to `expectedPath`, and the final path must not contain `forbid`. */
function checkRedirectedTo({ nav, expectedPath, forbid }) {
  note('Redirects', describeChain(nav));
  expect.soft(pathOf(nav.finalUrl), `should be redirected to ${expectedPath} — ${describeChain(nav)}`).toBe(expectedPath.toLowerCase());
  if (forbid) expect.soft(new URL(nav.finalUrl).pathname.toLowerCase().includes(forbid), `final url still contains "${forbid}": ${nav.finalUrl}`).toBe(false);
  expect.soft(nav.response?.status(), `HTTP status of ${nav.finalUrl}`).toBe(200);
}

module.exports = { checkNoRedirect, checkRedirectedTo };

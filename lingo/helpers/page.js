const consent = require('#blocks/consent.js');
const geoModal = require('#blocks/geo-modal.js');

// Some redirects are done in JavaScript right after load; wait a moment so we judge the FINAL url.
const JS_REDIRECT_WAIT = 1500;

/** Redirect hops the browser followed to get to `response`: [{ url, status }], oldest first. */
async function redirectChain(response) {
  const hops = [];
  let req = response?.request();
  while (req) {
    const prev = req.redirectedFrom();
    if (!prev) break;
    const res = await prev.response();
    hops.unshift({ url: prev.url(), status: res?.status() });
    req = prev;
  }
  return hops;
}

/** Open a URL and report where we ended up. Never throws on HTTP errors. */
async function openPage(page, url) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('load').catch(() => {});
  await page.waitForTimeout(JS_REDIRECT_WAIT);
  return { response, chain: await redirectChain(response), finalUrl: page.url() };
}

/** Visible text of the page content (main), falling back to the whole body. */
async function mainText(page) {
  const main = page.locator('main').first();
  if (await main.count()) return main.innerText();
  return page.locator('body').innerText();
}

/** Close cookie banner / geo modal if they show up, so they cannot block clicks. */
async function dismissOverlays(page) {
  const accept = page.locator(consent.acceptAll).first();
  await accept.waitFor({ state: 'visible', timeout: 4000 }).then(() => accept.click()).catch(() => {});
  const close = page.locator(`${geoModal.modal} ${geoModal.close}`).first();
  await close.waitFor({ state: 'visible', timeout: 2500 }).then(() => close.click()).catch(() => {});
}

module.exports = { openPage, redirectChain, mainText, dismissOverlays };

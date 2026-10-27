const { expect } = require('@playwright/test');
const region = require('#blocks/region-selector.js');
const { dismissOverlays } = require('#helpers/page.js');
const { note } = require('#helpers/note.js');

/** Footer > "Change region" > pick the region. */
async function selectRegion({ page, rule }) {
  await dismissOverlays(page);

  const trigger = page.locator(region.trigger).first();
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger, '"Change region" link not found in the footer').toBeVisible({ timeout: 15_000 });
  await trigger.click();

  // Prefer the region's link target (/fr/); fall back to its visible name.
  let option = page.locator(region.optionByCode(rule.code)).first();
  if (!(await option.count())) option = page.getByRole('link', { name: rule.name }).first();
  await expect(option, `region "${rule.code}" not found in the region list`).toBeVisible({ timeout: 15_000 });
  await option.click();
  await page.waitForLoadState('load').catch(() => {});
}

/** Both cookies exist and carry the region value. */
async function checkRegionCookies({ context, rule }) {
  await expect.poll(async () => (await context.cookies()).map((c) => c.name), {
    message: 'cookies "country" and "intl" were not both set',
    timeout: 15_000,
  }).toEqual(expect.arrayContaining(Object.keys(rule.cookies)));

  const jar = await context.cookies();
  for (const [name, expected] of Object.entries(rule.cookies)) {
    const c = jar.find((x) => x.name === name);
    note(`Cookie ${name}`, c ? `${c.value} (domain ${c.domain})` : 'missing');
    expect.soft(c?.value?.toLowerCase(), `cookie "${name}" should be "${expected}"`).toBe(expected);
  }
}

module.exports = { selectRegion, checkRegionCookies };

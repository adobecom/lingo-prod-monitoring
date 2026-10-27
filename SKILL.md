---
name: lingo-prod-monitoring
description: Daily production monitoring of the Adobe "Lingo" release on www.adobe.com using Playwright (JavaScript). Use this skill whenever you need to run, debug, extend, schedule or interpret the Lingo prod monitor — Akamai redirects, EN/FR sites from FR child countries, language-unique pricing pages, dynamic currency/VAT format, link transformation, phone numbers, and the INTL/country region cookies — on desktop and mobile (Chrome + Safari), with a daily Slack report.
---

# Lingo prod monitoring — skill guide

> **One-line summary:** once a day, GitHub Actions opens ~46 Lingo URLs/flows in 4 browser profiles
> (desktop Chrome, desktop Safari, mobile Chrome, mobile Safari = **184 checks**), verifies redirects, language,
> currency/VAT, links, phone numbers and region cookies, and posts one summary to Slack.

---

## 1. Why this exists

Lingo changes how adobe.com serves regional/language sites (e.g. `/fr/` serving Belgium, Luxembourg, Switzerland,
Canada-FR with the right currency, tax label, phone number and links). A silent break (wrong redirect, wrong currency,
untransformed links, missing cookie) hits revenue immediately, so the manual test cases from
`Lingo-prod-monitoring-cases.xlsx` are automated and run every day against **production**.

The framework follows the structure of the `lingo-automation` (Nala) repo, but is plain `@playwright/test`
so it runs anywhere with `npm install` (no private tarballs).

---

## 2. What is tested (Excel category → code)

| # | Excel category | Feature folder (`lingo/features/`) | Data (`lingo/testdata/`) | Check function (`lingo/steps/`) | Tests / browser |
|---|---|---|---|---|---|
| 1 | Akamai redirects check | `01-akamai-redirects` | `akamai-redirects.js` | `redirect.step.js` | 6 |
| 2 | Visit **English** site from FR and child countries | `02-en-from-fr` | `en-from-fr.js` | `redirect`, `language`, `pricing.checkPriceFormat` | 5 |
| 3 | Visit **FR** site from FR and child countries | `03-fr-from-fr` | `fr-from-fr.js` | `redirect`, `language`, `pricing.checkPriceFormat` | 4 |
| 4 | EN language-unique pages (plans / pricing / student pricing) | `04-unique-pages` | `unique-pages.js` | `redirect.checkNoRedirect` | 16 |
| 5 | Currency format – dynamic pricing | `05-dynamic-pricing` | `dynamic-pricing.js` | `pricing.checkDynamicPricing` | 8 |
| 6 | Link transformation | `06-link-transformation` | `link-transformation.js` | `link-transform.step.js` | 1 |
| 7 | Phone number check | `07-phone-numbers` | `phone-numbers.js` | `phone.step.js` | 4 |
| 8 | INTL and country cookie setting | `08-region-cookies` | `region-cookies.js` | `cookie.step.js` | 2 |

### Exactly what each check asserts

1. **Akamai redirects** — `behavior: 'stay'` (`/in/`, `/fr/`, `/au/`): no redirect hop, final path = requested path, HTTP 200.
   `behavior: 'redirect'` (`/sg/`, `/ca/`, `/nz/`): final path is `/creativecloud.html` and the final URL no longer contains `/sg/` (`/ca/`, `/nz/`).
2. **EN from FR** (`/creativecloud.html?akamaiLocale=fr|ca_fr|be|lu|ch`): not redirected; content is English only; a resolved price contains the expected currency/tax text (`€/mo incl. VAT`, `CAD $`, `CHF /mo incl. VAT`).
3. **FR from FR** (`/fr/creativecloud.html?akamaiLocale=ch|ca_fr|be|lu`): not redirected; content is French only; price contains `CHF`, `CAD $`, `€/mois TTC`.
4. **Unique pages** — 16 pages (`/ca|eg_en|gr_en|hk_en|id_en/creativecloud/plans.html`, `/…/acrobat/pricing.html`, `/…/acrobat/pricing/students.html`): open with **no redirect**.
5. **Dynamic pricing** — a price with an amount is shown; every currency symbol belongs to the region (CHF, CAD, €, S$/SGD, NZ$/NZD); tax/VAT label shown (`tax: 'required'`) or only recorded (`tax: 'report'`).
6. **Link transformation** — `/fr/…?akamaiLocale=be&country=be`: no adobe.com link points at `/be_fr/ /lu_fr/ /ch_fr/ /ca_fr/` (allow-list for region-unique pages) and at least one link points at `/fr/`. Region-picker links are ignored.
7. **Phone numbers** — `/fr/howtobuy/buying-programs.html?akamaiLocale=ca|be|ch|lu`: header contains the region number, body contains `915-800-9428`. Formatting is ignored (`0800 80 982` = `0800-80-982`), partial matches are rejected, `tel:` links count.
8. **Cookies** — open `/`, footer **Change region** → France / Japan; cookies `country` and `intl` both exist with value `fr` / `jp`.

> "Cookie and cache cleared" from the manual steps is guaranteed by Playwright itself: **every test runs in a brand-new
> browser context** (no cookies, storage or cache).

---

## 3. Browsers (desktop + mobile)

Defined in `playwright.config.js` → `projects`:

| Project | Engine | Profile |
|---|---|---|
| `desktop-chrome` | installed **Google Chrome** (`channel: 'chrome'`) | Desktop Chrome |
| `desktop-safari` | WebKit | Desktop Safari |
| `mobile-chrome` | installed Google Chrome | Pixel 7 emulation |
| `mobile-safari` | WebKit | iPhone 14 emulation |

* Installed Chrome (not bundled Chromium) is used because Chromium is blocked on prod.
* Every UA gets the allow-listed suffix **`NALA-Acom`** (`UA_SUFFIX` in `.env`; empty disables it).
* WebKit is Playwright's Safari engine, not Apple's Safari app — good for engine-level differences, not a 100 % substitute for real Safari.

---

## 4. Project layout

```
lingo.config.js              env (prod/stage), base URL, UA suffix
playwright.config.js         projects, retries, reporters, timeouts
lingo/
  features/NN-<category>/    <name>.spec.js  = list of tests (built from testdata)
                             <name>.test.js  = the journey, step by step
  steps/                     check functions (assertions) — reusable
  blocks/                    selectors ONLY
  testdata/                  URLs + expected values — edit here to change coverage
  helpers/                   url, page (openPage, redirect chain), text (matching, language), spec, note
reporters/slack-reporter.js  builds + posts the Slack summary, writes reports/summary.json
.github/workflows/lingo-prod-monitor.yml   daily cron + manual run
scripts/selftest.js          offline unit checks of the matching helpers
```

**Rule of thumb (same as the Nala repo):** data in `testdata/`, selectors in `blocks/`, assertions in `steps/`,
the `.test.js` only lists steps in order. Import aliases: `#helpers/*`, `#testdata/*`, `#blocks/*`, `#steps/*`.

All assertions are **soft** (`expect.soft`): a failing check is recorded and the test continues, so one run shows *everything* wrong on a page.

Test title convention: `@<prefix>-<id>,<tags>` e.g. `@phone-be,@lingo @daily @p1 @phone`.
Tags: `@lingo` (all) · `@daily` · `@p1` · and one per category: `@akamai @en-from-fr @fr-from-fr @unique-pages @pricing @link-transformation @phone @cookies`.

---

## 5. Setup and run

Requires Node 20+.

```bash
npm install
npx playwright install --with-deps chrome webkit   # or: npm run install:browsers
cp .env.example .env                               # optional locally
npm run selftest                                   # offline helper sanity check
```

```bash
npm test                              # everything: 4 browsers
npm run test:desktop                  # desktop-chrome + desktop-safari
npm run test:mobile                   # mobile-chrome + mobile-safari
npx playwright test --grep @akamai    # one category
npx playwright test --grep @phone-be --project=desktop-chrome --headed
npm run test:debug                    # Playwright Inspector
LINGO_ENV=stage npm test              # run against www.stage.adobe.com
npm run report                        # open the HTML report
```

---

## 6. Daily schedule and Slack

### Slack (one-time)
1. Slack → *Apps* → **Incoming Webhooks** (or create a Slack app → *Incoming Webhooks* → *Add New Webhook to Workspace*) and pick the target channel.
2. GitHub repo → *Settings → Secrets and variables → Actions*:
   * **Secret** `SLACK_WEBHOOK_URL` = the webhook URL
   * *(optional)* **Variable** `SLACK_MENTION` = `<!subteam^S0123456>` or `<@U0123456>` — tagged **only when something fails**
3. Run the workflow once manually (*Actions → Lingo prod monitoring → Run workflow*) to see the first message.

### What the message contains
Header with status (✅ all passed · 🟡 passed with flaky retries · ❌ N failed), environment, run time/duration,
totals, **per-category** and **per-browser** pass counts, up to 15 failures (`[browser] test` + the first line of each failed check),
and a link to the Actions run (HTML report + traces are attached as an artifact for 14 days).

### Schedule
`cron: '30 3 * * *'` = daily 03:30 UTC (edit in the workflow). Manual runs accept `env`, `grep` and `project` inputs.
Retries = 1 in CI: a test that fails then passes is **flaky** (🟡) and does not fail the run.
If the job dies before reporting (install error, config error) a fallback step posts "run did not complete".

### If Akamai blocks GitHub runners
GitHub-hosted IPs may be bot-challenged. Ask the edge team to allow-list the `NALA-Acom` UA (already sent) or the runner IPs, or switch
`runs-on:` to a **self-hosted runner** inside an allowed network. Symptom: many tests fail with 403 / challenge pages at once.

---

## 7. How to change / extend

| I want to… | Do this |
|---|---|
| Add a URL to an existing category | Add a row in `lingo/testdata/<category>.js`. Nothing else. |
| Add a region (e.g. `/de/` + AT) | New rows in the relevant testdata files. |
| Change an expected phone / currency | Edit the row (`phone-numbers.js`, `dynamic-pricing.js`, `*-from-fr.js`). |
| Make a report-only check strict | `dynamic-pricing.js`: `tax: 'report'` → `'required'`. |
| Allow a region-unique page to keep its own prefix | Add a regex to `allowedPathPatterns` in `link-transformation.js`. |
| Add a new category | 1) `testdata/x.js` 2) `steps/x.step.js` (soft assertions, selectors from `blocks/`) 3) `features/09-x/x.spec.js` + `x.test.js` copying an existing pair 4) add a row in §2 of this file. |
| Change the Slack layout | `reporters/slack-reporter.js` → `buildPayload()`. |

Price matching detail: amounts and whitespace are removed before comparing, so the sheet's `€/moincl. VAT`
(which is `€14.99/mo` + `incl. VAT` rendered side by side) is written `'€/mo incl. VAT'` in the data and matches `€ 14,99 /mo incl. VAT`.

---

## 8. Reading a failure

1. Slack line: `[mobile-chrome] @phone-be` → `header phone 0800 80 982 not found`.
2. Open the Actions run → artifact → `reports/html/index.html`: every step, the **annotations** (redirect chain, price sample,
   currency symbols, link-locale counts, cookie values, header text) and a trace/screenshot for failures.
3. Reproduce locally: `npx playwright test --grep @phone-be --project=mobile-chrome --headed`.
4. Decide: real regression → raise a bug; expectation changed → update `testdata/`; selector changed → update `blocks/`.

---

## 9. Known assumptions and open points (please confirm)

This code was written from the Excel + reference repo **without access to live adobe.com**, so the first live run may need small tuning.

1. **Region selector selectors** (`blocks/region-selector.js`) and the region-list link format (`a[href$="/fr/"]`) are best guesses — most likely first-run fix.
2. **Excel typos handled**
   * FR site + `akamaiLocale=ch` expects `€/moincl. VAT` (English, euro) → implemented as **CHF** (Switzerland is CHF in every other row).
   * Phone `ca`: header `800-915-9428`, body `915-800-9428` are the same digits swapped → kept as written, likely one is a typo.
   * Students-pricing rows say "go to …/pricing.html" in the steps while column A has `/pricing/students.html` → column A is used; duplicate rows removed (16 unique pages).
   * Cookie `county` → `country`.   `?&akamaiLocale=lu` → `?akamaiLocale=lu`.
3. **Link transformation** used a *stage* URL in the sheet; it runs on the active environment (prod by default).
   The "expected" text ("links pointing to base site which is FR") is implemented as *no child-region prefixes + at least one `/fr/` link*; the exceptions list is a guess.
4. **Tax/VAT** is strict (`required`) for CHF/EUR and report-only for CAD/SGD/NZD until confirmed.
5. **Language detection** is a function-word heuristic with 10 % tolerance — robust for marketing pages, not a translation QA tool.
6. `akamaiLocale` simulates the visitor's country; a runner IP's real country does not change results while the parameter is present.

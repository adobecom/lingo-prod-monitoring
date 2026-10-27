// Quick sanity test of the matching helpers — no browser, no network.  npm run selftest
const assert = require('node:assert/strict');
const { compact, containsAny, containsPhone, detectLanguage } = require('../lingo/helpers/text.js');

// price text: amount + spacing ignored
assert.equal(compact('€ 14,99 /mo incl. VAT'), '€/moincl.vat');
assert.ok(containsAny('US$ 1 234,50 /mois TTC', ['/mois TTC']));
assert.ok(containsAny('€14.99/mo incl. VAT', ['€/mo incl. VAT']));
assert.ok(containsAny('CHF 19.90/mo incl. VAT', ['CHF /mo incl. VAT']));
assert.ok(!containsAny('$14.99/mo', ['€/mo incl. VAT']));

// phones: format-insensitive, no partial-number matches
assert.ok(containsPhone('Call 0800 80 982 today', '0800-80-982'));
assert.ok(containsPhone('Appelez le 800.915.9428', '800-915-9428'));
assert.ok(!containsPhone('Call 800-915-9428', '915-800-9428'));      // swapped groups must NOT match
assert.ok(!containsPhone('Call 10800 80 982', '0800 80 982'));        // longer number must NOT match
assert.ok(containsPhone('no text', '800-915-9428', ['+18009159428'])); // tel: link with country code

// language
const en = detectLanguage('Get the apps you need for your work and all of the creativity that you can have with our plans');
const fr = detectLanguage('Obtenez les applications dont vous avez besoin pour votre travail et toute la créativité que vous pouvez avoir dans nos offres');
assert.ok(en.frShare < 0.1 && en.en > 0, JSON.stringify(en));
assert.ok(fr.enShare < 0.1 && fr.fr > 0, JSON.stringify(fr));
console.log('selftest OK');

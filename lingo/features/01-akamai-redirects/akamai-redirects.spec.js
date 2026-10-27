// Category 1 — Akamai redirects check. Data: testdata/akamai-redirects.js
const { buildFeatures } = require('#helpers/spec.js');

module.exports = {
  name: 'Lingo | 01 Akamai redirects',
  features: buildFeatures({
    prefix: 'akamai', tcPrefix: 'AKA', tags: '@lingo @daily @p1 @akamai',
    rows: require('#testdata/akamai-redirects.js'),
  }),
};

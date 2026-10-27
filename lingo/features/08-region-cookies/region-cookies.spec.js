// Category 8 — INTL and country cookie setting via the footer region selector. Data: testdata/region-cookies.js
const { buildFeatures } = require('#helpers/spec.js');

module.exports = {
  name: 'Lingo | 08 INTL and country cookie setting',
  features: buildFeatures({
    prefix: 'cookie', tcPrefix: 'CKE', tags: '@lingo @daily @p1 @cookies',
    rows: require('#testdata/region-cookies.js'),
  }),
};

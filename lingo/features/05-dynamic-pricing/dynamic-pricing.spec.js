// Category 5 — Currency format / dynamic pricing. Data: testdata/dynamic-pricing.js
const { buildFeatures } = require('#helpers/spec.js');

module.exports = {
  name: 'Lingo | 05 Currency format - dynamic pricing',
  features: buildFeatures({
    prefix: 'pricing', tcPrefix: 'PRC', tags: '@lingo @daily @p1 @pricing',
    rows: require('#testdata/dynamic-pricing.js'),
  }),
};

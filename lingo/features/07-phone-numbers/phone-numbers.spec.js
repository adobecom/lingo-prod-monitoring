// Category 7 — Phone number check (header + body). Data: testdata/phone-numbers.js
const { buildFeatures } = require('#helpers/spec.js');

module.exports = {
  name: 'Lingo | 07 Phone number check',
  features: buildFeatures({
    prefix: 'phone', tcPrefix: 'PHN', tags: '@lingo @daily @p1 @phone',
    rows: require('#testdata/phone-numbers.js'),
  }),
};

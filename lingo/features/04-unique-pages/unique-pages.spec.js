// Category 4 — EN language-unique pages (plans / pricing / student pricing). Data: testdata/unique-pages.js
const { buildFeatures } = require('#helpers/spec.js');

module.exports = {
  name: 'Lingo | 04 EN language-unique pages',
  features: buildFeatures({
    prefix: 'unique', tcPrefix: 'UNQ', tags: '@lingo @daily @p1 @unique-pages',
    rows: require('#testdata/unique-pages.js'),
  }),
};

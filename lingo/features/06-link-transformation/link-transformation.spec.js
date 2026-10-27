// Category 6 — Link transformation. Data: testdata/link-transformation.js
const { buildFeatures } = require('#helpers/spec.js');

module.exports = {
  name: 'Lingo | 06 Link transformation',
  features: buildFeatures({
    prefix: 'links', tcPrefix: 'LNK', tags: '@lingo @daily @p1 @link-transformation',
    rows: require('#testdata/link-transformation.js'),
  }),
};

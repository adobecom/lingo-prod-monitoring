// Category 3 — French site visited from France and its child countries. Data: testdata/fr-from-fr.js
const { buildFeatures } = require('#helpers/spec.js');

module.exports = {
  name: 'Lingo | 03 FR site from FR and child countries',
  features: buildFeatures({
    prefix: 'fr-from', tcPrefix: 'FRFR', tags: '@lingo @daily @p1 @fr-from-fr',
    rows: require('#testdata/fr-from-fr.js'),
  }),
};

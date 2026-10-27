// Category 2 — English site visited from France and its child countries. Data: testdata/en-from-fr.js
const { buildFeatures } = require('#helpers/spec.js');

module.exports = {
  name: 'Lingo | 02 EN site from FR and child countries',
  features: buildFeatures({
    prefix: 'en-from', tcPrefix: 'ENFR', tags: '@lingo @daily @p1 @en-from-fr',
    rows: require('#testdata/en-from-fr.js'),
  }),
};

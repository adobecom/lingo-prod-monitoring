// Category 6 — Link transformation: on a /fr/ page opened as a Belgian visitor, links must point to the BASE site (/fr/),
// never to the child-region prefixes (/be_fr/, /lu_fr/, /ch_fr/, /ca_fr/).
// The Excel URL is on www.stage.adobe.com; the path is used here so the run follows LINGO_ENV
// (LINGO_ENV=stage npm test  ->  stage). Default = prod.
//   allowedPathPatterns : region-unique pages that legitimately keep their own prefix (confirm list with Lingo team)
module.exports = [
  {
    id: 'fr-be',
    path: '/fr/creativecloud.html?akamaiLocale=be&country=be',
    baseLocale: 'fr',
    childLocales: ['be_fr', 'lu_fr', 'ch_fr', 'ca_fr'],
    allowedPathPatterns: [/\/creativecloud\/plans\.html/i, /\/acrobat\/pricing/i],
  },
];

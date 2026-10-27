// "Change region" in the footer and the region list it opens.
// !! These are the selectors most likely to need a tweak on the first live run — see SKILL.md > Troubleshooting.
module.exports = {
  trigger: [
    '.feds-regionPicker',
    'footer [class*="regionPicker" i]',
    'footer a:has-text("Change region")',
    'footer button:has-text("Change region")',
  ].join(', '),
  modal: '.dialog-modal, [role="dialog"]',
  // A region link in the opened list, matched by its target prefix (e.g. /fr/, /jp/)
  optionByCode: (code) => [
    `.dialog-modal a[href$="/${code}/"]`,
    `[role="dialog"] a[href$="/${code}/"]`,
    `.dialog-modal a[href="/${code}/"]`,
  ].join(', '),
};

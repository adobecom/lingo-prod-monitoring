// Category 4 — EN, language-unique pages (plans / pricing / student pricing).
// Each must open WITHOUT any redirect and stay on the same path.
// The Excel repeats the students rows twice and its "steps" text points at /pricing.html for the students rows;
// duplicates are removed and the URL in column A is used.
const rows = [];
const add = (kind, path) => rows.push({ id: `${path.split('/')[1]}-${kind}`, path });

['ca', 'eg_en', 'gr_en', 'hk_en', 'id_en'].forEach((l) => add('cc-plans', `/${l}/creativecloud/plans.html`));
['ca', 'eg_en', 'gr_en', 'hk_en', 'id_en', 'ie'].forEach((l) => add('acrobat-pricing', `/${l}/acrobat/pricing.html`));
['eg_en', 'gr_en', 'hk_en', 'id_en', 'ie'].forEach((l) => add('acrobat-students', `/${l}/acrobat/pricing/students.html`));

module.exports = rows;

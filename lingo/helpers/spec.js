/**
 * Turn testdata rows into the `features` list a spec file exports.
 * Test title = "@<prefix>-<row.id>,<tags>"  (same convention as the Nala repo).
 */
function buildFeatures({ prefix, tcPrefix, tags, rows }) {
  return rows.map((row, i) => ({
    ...row,
    tcid: `${tcPrefix}-${String(i + 1).padStart(2, '0')}`,
    name: `@${prefix}-${row.id}`,
    tags,
  }));
}

module.exports = { buildFeatures };

const { test } = require('@playwright/test');

/** Adds a visible annotation to the HTML report (what was seen, even when the check passes). */
const note = (type, description) => test.info().annotations.push({ type, description: String(description) });

module.exports = { note };

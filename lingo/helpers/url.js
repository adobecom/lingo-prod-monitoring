/** Resolve a path (with optional query) against the run's base URL. */
const resolve = (baseURL, path) => new URL(path, baseURL).toString();

/** Lower-cased pathname without trailing slash (root stays "/"). */
function pathOf(url) {
  const p = new URL(url).pathname.toLowerCase();
  return p.length > 1 ? p.replace(/\/+$/, '') : p;
}

module.exports = { resolve, pathOf };

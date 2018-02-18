/**
 * List either top-level paths or sub-paths based on the given prefix.
 * To list methods on an object specify the complete path.
 * @example
 * mdncomp -l .
 * mdncomp -l javascript.builtins
 * mdncomp -l javascript.builtins.NUmber
 *
 * @param prefix
 * @param sensitive
 * @returns {Array}
 */
function list(prefix, sensitive) {
  let
    _prefix = sensitive ? prefix : prefix.toLowerCase(),
    tbl = buildTable(),
    result = [];

  tbl.forEach(path => {
    let _path = sensitive ? path : path.toLowerCase();
    if (_path.startsWith(_prefix) && !isCompat(path)) result.push(path);
  });

  return result.length === 1 ? Object.keys(getPathAsObject(result[0]) || {}) : result
}

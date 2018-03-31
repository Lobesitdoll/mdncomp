/**
 * Performs a search through the MDN tree using simple regex
 * for each path. Every __compat object (if found) is store
 * to the resulting array.
 * @param keyword
 * @param sensitive
 * @returns {Array}
 */
function search(keyword, sensitive) {
  let
    cmp,
    tbl = buildTable(),
    result = [];

  cmp = getComparer(keyword, options.fuzzy, !sensitive);
  tbl.forEach(path => {
    if (cmp.test(path) && isCompat(path)) result.push(path);
  });

  return result
}

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
    cmp = getComparer(sensitive ? keyword : keyword.toLowerCase()),
    tbl = buildTable(),
    result = [];

  tbl.forEach(path => {
    let _path = sensitive ? path : path.toLowerCase();
    if (cmp.test(_path) && isCompat(path)) result.push(path);
  });

  return result
}

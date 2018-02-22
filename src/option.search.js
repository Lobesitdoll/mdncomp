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

  if (keyword.endsWith(".")) {
    keyword = _toCase(keyword).substr(0, keyword.length - 1);
    for(let path of tbl) {
      let _path = _toCase(path);
      if (_path.endsWith(keyword)) {
        result.push(path);
        break;
      }
    }
  }
  else {
    cmp = getComparer(_toCase(keyword));
    tbl.forEach(path => {
      let _path = _toCase(path);
      if (cmp.test(_path) && isCompat(path)) result.push(path);
    });
  }

  function _toCase(txt) {
    return sensitive ? txt : txt.toLowerCase()
  }

  return result
}

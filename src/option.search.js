/*!
  Search module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const utils = require("./core.utils");
const mdn = utils.loadMDN();

/**
 * Performs a search through the MDN tree using simple regex
 * for each path. Every __compat object (if found) is store
 * to the resulting array.
 * @param keyword
 * @param sensitive
 * @returns {Array}
 */
function search(keyword, sensitive) {
  const cmp = utils.getComparer(keyword, options.fuzzy, !sensitive);
  return utils
    .buildTable(mdn)
    .filter(path => cmp.test(path) && utils.isCompat(mdn, path));
}

module.exports = search;

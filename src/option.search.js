/*
  Search module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const utils = loadModule("core.utils");
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
  const result = [];

  utils
    .getRootList(mdn)
    .forEach(key => _iterateNode(mdn, key, key));

  function _iterateNode(node, inKey, branch) {
    const subNode = node[ inKey ];

    if ( typeof subNode === "object" ) {
      Object
        .keys(subNode)
        .filter(key => key !== "__compat")
        .forEach(key => {
          let cBranch = branch + "." + key;
          if ( cmp.test(cBranch) && ((key !== inKey && result.length) || !result.length) ) {
            result.push(cBranch);
          }
          else {
            _iterateNode(subNode, key, branch + "." + key);
          }
        });
    }
  }

  return result;
}

module.exports = search;

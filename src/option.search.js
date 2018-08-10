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
  const result = [];

  utils
    .getRootList(mdn)
    .filter(key => key !== "browsers")
    .forEach(key => _iterateNode(mdn, key, key));

  function _iterateNode(node, inKey, branch) {
    const subNode = node[inKey];

    if (typeof subNode === "object") {
      Object.keys(subNode).forEach(key => {
        if (key !== "__compat" && key !== "worker_support" && key !== "sharedarraybuffer_support" && key !== "SharedArrayBuffer_as_param") {
          let cBranch = branch + "." + key;
          if (cmp.test(cBranch) && ((key !== inKey && result.length) || !result.length)) {
            result.push(cBranch);
          }
          else {
            _iterateNode(subNode, key, branch + "." + key);
          }
        }
      });
    }
  }

  return result
}

module.exports = search;

/*
  Search module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const utils = loadModule("core.utils");

/**
 * Performs a search through the MDN tree using simple regex
 * for each path. Every __compat object (if found) is store
 * to the resulting array.
 * @param keyword
 * @returns {Array}
 */
function search(keyword) {
  const mdn = utils.loadMDN();
  const cmp = utils.getComparer(keyword, options.fuzzy, !options.caseSensitive);
  const result = [];

  utils
    .getRootList(mdn)
    .forEach(key => _iterateNode(mdn, key, key));

  function _iterateNode(node, inKey, branch) {
    const subNode = node[ inKey ];

    if ( typeof subNode === "object" ) {
      let keys = Object.keys(subNode);
      if ( !options.deep ) keys = keys.filter(key => key !== "__compat");

      keys
        .filter(key => {
          const obj = utils.getPathAsObject(mdn, branch + "." + key);
          return !(obj && obj.__compat && (obj.__compat.short || obj.__compat.title))
        })
        .forEach(key => {
        // Deep mode
        if ( key === "__compat" && !result.includes(branch) ) {
          const o = subNode[ key ];
          if (
            (typeof o.description === "string" && cmp.test(o.description)) ||
            (typeof (o.title || o.short) === "string" && cmp.test(o.title || o.short) ||
              inSupportObject(o.support))
          ) {
            result.push(branch);
          }
        }
        else {
          const currentBranch = branch + "." + key;
          if ( cmp.test(currentBranch) && ((key !== inKey && result.length) || !result.length) ) {
            result.push(currentBranch);
          }
          else {
            _iterateNode(subNode, key, currentBranch);
          }
        }
      });
    }
  }

  function inSupportObject(support) {
    for(let key of Object.keys(support)) {
      const browser = support[ key ];
      const statements = Array.isArray(browser) ? browser : [ browser ];

      for(let statement of statements) {
        const _notes = statement.notes;
        if ( typeof _notes === "string" && cmp.test(_notes) ) {
          return true;
        }
        else if ( Array.isArray(_notes) ) {
          for(let note of _notes) if ( cmp.test(note) ) return true;
        }

        if ( typeof statement.alternative_name === "string" && cmp.test(statement.alternative_name) ) return true;
        if ( typeof statement.prefix === "string" && cmp.test(statement.prefix) ) return true;

        if ( Array.isArray(statement.flags) ) {
          for(let flag of statement.flags) {
            if (
              (typeof flag.type === "string" && cmp.test(flag.type)) ||
              (typeof flag.name === "string" && cmp.test(flag.name))
            ) {
              return true;
            }
          }
        }
      }

    }
    return false;
  }

  return result;
}

module.exports = search;

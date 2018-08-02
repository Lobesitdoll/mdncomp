/*
  List option module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
 */

const utils = loadModule("core.utils");
const mdn = utils.loadMDN();

function list(path) {

  // top-levels
  if ( typeof path !== "string" || !path.length || path === "." ) {
    log(`?R${text.valid} ${text.pathRoots}:`);
    log(`?g${utils.listTopLevels(mdn).join(lf)}?R`);
    log(lf + `${text.valid} ${text.statuses}:`);
    log("?gstandard, experimental, deprecated?R");
  }

  // list on status
  else if ( [ "deprecated", "experimental", "standard" ].includes(path) ) {
    log(listOnStatus(path));
  }

  // List API
  else {
    let list = listAPI(path);

    if ( list.length === 1 && utils.isCompat(mdn, list[ 0 ]) ) {
      options.list = undefined;
      listAPI(list[ 0 ]);
    }
    else
      log(list);
  }
}

/**
 * List either top-level paths or sub-paths based on the given prefix.
 * To list methods on an object specify the complete path.
 * @example
 * mdncomp -l .
 * mdncomp -l javascript.builtins
 * mdncomp -l javascript.builtins.Number
 * mdncomp -l experimental
 * mdncomp -l deprecated
 *
 * @param prefix
 * @returns {Array}
 */
function listAPI(prefix) {
  const _prefix = options.caseSensitive ? prefix : prefix.toLowerCase();
  const tbl = utils.buildTable(mdn);
  const maxSegments = _prefix.split(".").length + 1;

  let last = "";

  return tbl
    .filter(path => {
      const _path = options.caseSensitive ? path : path.toLowerCase();
      if ( _path.startsWith(_prefix) && path.split(".").length <= maxSegments && path !== last ) {
        return last = path;
      }
    })
    .sort()
    .map(path => {
      const obj = utils.getPathAsObject(mdn, path);
      let color = "";
      let prefix = "?GB?R";

      if (obj.__compat) {
        color = "?c";
        prefix = "F"
      }
      else if (utils.hasChildren(obj)) {
        color = "?g";
        prefix = "P"
      }

      if (color.length) {
        const parts = path.split(".");
        parts[parts.length - 1] = color + parts[parts.length - 1] + "?R";
        return `${color}${prefix}?R ${parts.join(".")}`
      }

      return `${prefix} ${path}`
    });
}

function listOnStatus(statTxt) {
  const result = [];
  const keys = utils.listTopLevels(mdn);

  if ( statTxt === "standard" ) statTxt += "_track";

  keys.forEach(key1 => {
    let o = mdn[ key1 ];
    if ( o.__compat && _check(o) ) result.push(key1);
    Object.keys(mdn[ key1 ]).forEach(key2 => {
      let o = mdn[ key1 ][ key2 ];
      if ( o.__compat && _check(o) ) result.push(key1 + "." + key2);
      Object.keys(mdn[ key1 ][ key2 ]).forEach(key3 => {
        let o = mdn[ key1 ][ key2 ][ key3 ];
        if ( key3.__compat && _check(o) ) result.push(key1 + "." + key2 + "." + key3);
      });
    });
  });

  function _check(compat) {
    const status = compat.__compat.status || {};
    return !!status[ statTxt ];
  }

  // colorize
  const color = statTxt === "deprecated" ? "?o" : (statTxt === "experimental" ? "?y" : "?g");

  return result
    .sort()
    .map(res => {
      const t = res.lastIndexOf(".") + 1;
      return "?R" + res.substr(0, t) + color + res.substr(t);
    });
}

module.exports = list;
/*
  List option module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
 */

const utils = loadModule("core.utils");
const mdn = utils.loadMDN();

function list(path, recursive = false) {

  // top-levels
  if ( typeof path !== "string" || !path.length || path === "." ) {
    log(`?R${text.valid} ${text.pathRoots}:`);
    log(`?g${utils.getRootList(mdn).join(lf)}?R`);
    log(lf + `${text.valid} ${text.statuses}:`);
    log("?gstandard, experimental, deprecated?R");
  }

  // list on status
  else if ( [ "deprecated", "experimental", "standard" ].includes(path) ) {
    const result = listOnStatus(path, recursive);
    if (result.length > 1) {
      checkIndex(result)
    }
    else log(result);
  }

  // List API
  else {
    let result = listAPI(path, recursive);

    if ( result.length === 1 && utils.isCompat(mdn, result[ 0 ]) ) {
      options.list = undefined;
      listAPI(result[ 0 ]);
    }
    else if (result.length > 1) {
      checkIndex(result)
    }
  }

  function checkIndex(result) {
    if (options.index > -1) {
      if (options.index < 0 || options.index >= result.length) {
        err(text.indexOutOfRange);
        return;
      }

      let parts = result[options.index].split(" ");
      let line = parts[parts.length - 1].replace(/\?./g, "");
      options.index = -1;

      list(line, true);
    }
    else {
      log(result);
    }
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
 * @param recursive
 * @returns {Array}
 */
function listAPI(prefix, recursive = false) {
  const _prefix = options.caseSensitive ? prefix : prefix.toLowerCase();
  const tbl = utils.bcdToList(mdn);
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
    .map((path, i, arr) => {
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

      const index = recursive ? "" : "?y[?g" + (i + "").padStart(Math.log10(arr.length) + 1) + "?y]?R ";

      if (color.length) {
        const parts = path.split(".");
        parts[parts.length - 1] = color + parts[parts.length - 1] + "?R";
        return `${index}${color}${prefix}?R ${parts.join(".")}`
      }

      return `${index}${prefix} ${path}`
    });
}

function listOnStatus(statTxt, recursive = false) {
  const result = [];

  if ( statTxt === "standard" ) statTxt += "_track";

  utils
    .getRootList(mdn)
    .filter(key => key !== "browsers" && key !== "webextensions")
    .forEach(key => _iterateNode(mdn, key, key));

  function _iterateNode(node, inKey, branch) {
    const subNode = node[ inKey ];

    if ( typeof subNode === "object" ) {
      Object.keys(subNode).forEach(key => {
        if ( key !== "__compat") {
          if (_check(subNode[key].__compat)) result.push(branch + "." + key);
          _iterateNode(subNode, key, branch + "." + key);
        }
      });
    }
  }

  function _check(compat) {
    if (compat) {
      const status = compat.status || {};
      return !!status[ statTxt ];
    }
  }

  // colorize
  const color = statTxt === "deprecated" ? "?o" : (statTxt === "experimental" ? "?y" : "?g");
  const pad = Math.log10(result.length) + 1;

  return result
    .sort()
    .map((res, i) => {
      const index = recursive ? "" : "?y[?g" + (i + "").padStart(pad) + "?y]?R ";
      const t = res.lastIndexOf(".") + 1;
      return `?R${index}${res.substr(0, t) + color + res.substr(t)}`;
    });
}

module.exports = list;
/*
  Random feature module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const utils = loadModule("core.utils");
const mdn = utils.loadMDN();

function getRandom(path) {

  let tbl = utils.buildTable(mdn);
  let state = false;
  let i;

  if (typeof path === "string" && path.length) {
    let cmp = utils.getComparer(path, options.fuzzy, options.caseSensitive);
    tbl = tbl.filter(item => cmp.test(item));
  }

  while(!state) {
    i = (Math.random() * tbl.length)|0;
    state = utils.isCompat(mdn, tbl[i]);
    if (state && (options.doc || options.docforce || options.desc)) {
      let o = utils.getPathAsObject(mdn, tbl[i]).__compat;
      if (!(o.mdn_url && o.mdn_url.length)) state = false;
    }
  }

  return tbl[i]
}

module.exports = getRandom;
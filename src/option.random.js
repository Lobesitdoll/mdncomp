
function randomCompat(path, sensitive) {

  let tbl = buildTable(), state, i, tmp = [], cmp;

  if (path !== ".") {
    cmp = getComparer(path, options.fuzzy, !sensitive);
    tbl.forEach(item => {if (cmp.test(item)) tmp.push(item)});
    tbl = tmp;
  }

  while(!state) {
    i = (Math.random() * tbl.length)|0;
    state = isCompat(tbl[i]);
    if (state && (options.doc || options.docforce || options.desc)) {
      let o = getPathAsObject(tbl[i]).__compat;
      if (!(o.mdn_url && o.mdn_url.length)) state = false;
    }
  }

  return tbl[i]
}
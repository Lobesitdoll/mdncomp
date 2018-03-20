
function randomCompat() {

  const tbl = buildTable();
  let state, i;

  while(!state) {
    i = (Math.random() * tbl.length)|0;
    state = isCompat(tbl[i]);
    if (state && options.doc) {
      let o = getPathAsObject(tbl[i]).__compat;
      if (!(o.mdn_url && o.mdn_url.length)) state = false;
    }
  }

  return tbl[i]
}

function randomCompat() {

  const tbl = buildTable();
  let state, i;

  while(!state) {
    i = (Math.random() * tbl.length)|0;
    state = isCompat(tbl[i]);
  }

  return tbl[i]
}
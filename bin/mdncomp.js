#!/usr/bin/env node

/*-------------------------------------------------------*/

const DEBUG = true;

/*-------------------------------------------------------*/

const _base = `../${DEBUG ? "src" : "build"}/`;
const _outBuffer = [];

/**
 * Available globally to all modules.
 * Properties here are for things that can be cached due to
 * being used through the entire lifetime, or because some
 * properties came from the config file.
 */
Object.assign(global, {
  DEBUG   : DEBUG,
  _base   : _base,
  lf      : "\r\n",
  sepChar : "|",
  shortPad: 1,
  lang    : "en-US",
  ANSI    : require(_base + "core.ansi"),
  options : {},
  loadMDN : loadMDN,
  outInfo : outInfo,
  outStore: outStore
});

// Load options from command line and config file
const options = global.options = require(_base + "init.options");

// Use ANSI color?
if (!options.colors || options.markdown || getExt(options.out) === ".txt") {
  Object
    .keys(global.ANSI)
    .filter(item => !item.includes("ursor"))
    .forEach(item => ANSI[item] = "");
}

/*---------------------------------------------------------

    Check for update, update patch/full if exists or exit

*/
if (options.update) {
  require(_base + "core.update")(false, false);
}

/*---------------------------------------------------------

    Check if an update is available.

*/
else if (options.cupdate) {
  require(_base + "core.update")(false, true);
}

/*---------------------------------------------------------

    Force full update

*/
else if (options.fupdate) {
  require(_base + "core.update")(true, false);
}

/*---------------------------------------------------------

    List browser versions and status

*/
else if (options.browser) {
  require(_base + "option.browser")(options.browser);
}

/*---------------------------------------------------------

    List by API paths

*/
else if (options.list) {
  require(_base + "option.list")(options.list);
}

/*---------------------------------------------------------

    Search APIs for features

*/
else if (options.args.length) {
  console.log("todo search:", options.args);
}

/*---------------------------------------------------------

    Unknown or no option

*/
else options.help();

/*---------------------------------------------------------

  HELPERS

*/

// todo move these to sep. module

function loadMDN() {
  let mdn;
  try {
    mdn = require("../data/data.json");
  }
  catch(err) {
    log("Critical error: data file not found. Try running with option --fupdate to download latest snapshot.");
    process.exit(1);
  }

  return mdn
}

function outInfo(txt) {
  if (Array.isArray(txt)) {
    txt = txt.join(lf);
  }
  console.log(txt + ANSI.reset);
}

function outStore(txt, noFile) {
  if (Array.isArray(txt)) txt = txt.join(lf);
  if (noFile || !options.out) {
    console.log(txt);
  }
  else {
    _outBuffer.push(txt);
  }
}

function getExt(path) {
  if (typeof path !== "string") return "";
  let i = path.lastIndexOf(".");
  return i < 0 ? "" : path.substr(++i)
}

#!/usr/bin/env node

/*-----------------------------------------------------------------------------------*/

const DEBUG = true;

/*-----------------------------------------------------------------------------------*/

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
  options : require(_base + "init.options"),
  loadMDN : loadMDN,
  outInfo : outInfo,
  outStore: outStore
});

const options = global.options;

/*-------------------------------------------------------------------------------------------------

  PREPS

-------------------------------------------------------------------------------------------------*/

// Anything to do?
if ( !options.args.length ) {
  options.help();
  return;
}

// Use color ANSI?
if (!options.colors || options.markdown || getExt(options.out) === ".txt") {
  Object
    .keys(global.ANSI)
    .filter(item => !item.includes("ursor"))
    .forEach(item => ANSI[item] = "");
}

/*-------------------------------------------------------------------------------------------------

  COMMANDS

-------------------------------------------------------------------------------------------------*/

let arg = options.args[0];
if (!arg || typeof arg !== "string") arg = ".";

if (options.browser) {
  require(_base + "option.browser")(arg);
}
else if (options.list) {

}
else {

}

/*-------------------------------------------------------------------------------------------------

  HELPERS

-------------------------------------------------------------------------------------------------*/

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

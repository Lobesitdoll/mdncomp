#!/usr/bin/env node

/*-------------------------------------------------------*/

const DEBUG = true;

/*-------------------------------------------------------*/

const _base = `../${DEBUG ? "src" : "build"}/`;
const utils = require(_base + "core.utils");

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
  options : {}
});

// Load options from command line and config file
const options = global.options = require(_base + "init.options");

// Use ANSI color?
if (!options.colors || options.markdown || utils.getExt(options.out) === ".txt") {
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
  require(_base + "option.search")(options.args[0]);
}

/*---------------------------------------------------------

    If no option, default to help

*/
else options.help();

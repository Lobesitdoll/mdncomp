/*
  Init options module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const options = loadModule("core.commander");
const version = require("../package.json").version;
const args = process.argv;

/**
 * Parse command line arguments.
 * Provides a help text if no (valid) arguments are supplied.
 * Can show help per option as well ("--help --browser").
 * @type {*}
 * @returns {*} The options object with flags and arguments.
 */
module.exports = (() => {

  // override help combined with an option
  if ( args.length >= 4 ) {
    for(let arg of args) {
      if ( arg === "-h" || arg === "--help" ) extendedHelp();
    }
  }

  // override "?" -> -h
  if ( args.length === 3 && args[ 2 ] === "?" ) args[ 2 ] = "-h";

  options
    .version(version)
    .usage(`[${text.aboutOptions}] [*]`)
    .description(`${text.aboutBCD}${lf}  (c) 2018 epistemex.com`)

    .option("-l, --list [api]", text.optionsList)
    .option("-b, --browser [id]", text.optionsBrowser)
    .option("-i, --index <index>", text.optionsIndex, -1)
    .option("-D, --no-desktop", text.optionsNoDesktop)
    .option("-M, --no-mobile", text.optionsNoMobile)
    .option("-x, --ext", text.optionsExt)
    .option("-R, --no-children", text.optionsNoChildren)
    .option("-c, --case-sensitive", text.optionsCaseSens)
    .option("-z, --fuzzy", text.optionsFuzzy)
    .option("-d, --deep", text.optionsDeep)
    .option("-s, --shorthand", text.optionsShorthand)
    .option("--desc", text.optionsDesc)
    .option("--specs", text.optionsSpecs)
    .option("--sub <index>", text.optionsSub)
    .option("-j, --json", text.optionJSON)
    .option("-N, --no-notes", text.optionsNoNotes)
    .option("-F, --no-flags", text.optionsNoFlags)
    .option("-y, --history", text.optionsHistory)
    .option("-O, --no-obsolete", text.optionsNoObsolete)
    .option("-u, --columns <columns>", text.optionsColumns)
    .option("--random [scope]", text.optionsRandom)
    .option("--no-colors", text.optionsNoColors)
    .option("--max-chars <width>", text.optionsMaxChars, 84)
    .option("-G, --no-config", text.optionsNoConfig)
    .option("--set <kv>", text.optionsSet)
    .option("--configpath", text.optionsConfigPath)
    .option("--expert [level]", text.optionsExpert, 0)
    .option("--lang <isocode>", text.optionsLang, "en-us")
    .option("--update", text.optionsUpdate)
    .option("--fupdate", text.optionsForceUpdate)
    .on("--help", extendedHelp)
    .parse(args);

  // apply config file settings to options. Config JSON is preloaded in main (if any)
  loadModule("init.config").initConfig(options);

  function extendedHelp() {
    if (!options.minihelp) loadModule("init.help")();
    else log();
  }

  // check for shorthand index number arg
  if ( options.index < 0 ) {
    for(let i = 0, arg; arg = options.args[ i ]; i++) {
      //noinspection JSCheckFunctionSignatures
      if ( !isNaN(arg) ) {
        options.args.splice(i, 1);
        options.index = +arg;
        break;
      }
    }
  }

  return options;
})();

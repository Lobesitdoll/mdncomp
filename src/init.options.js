/*!
  Init options module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const options = require("commander");
const version = require("../package.json").version;
const args = process.argv;

/**
 * Parse command line arguments.
 * Provides a help text if no (valid) arguments are supplied.
 * Can show help per option as well ("--help --browser").
 * @type {options.CommanderStatic}
 * @returns {*} The options object with flags and arguments.
 */
module.exports = (() => {

  // override help combined with an option
  if (args.length >= 4) {
    for(let arg of args) {
      if (arg === "-h" || arg === "--help") extendedHelp();
    }
  }

  options
    .version(version, "-v, --version")
    .usage("[options] [*]")
    .description(`Get MDN Browser Compatibility Data, docs and specs.${lf}  Version: ${version + lf}  (c) 2018 epistemex.com`)

    .option("-l, --list [api]", "List paths starting with given branch(es), or none for root list")
    .option("-b, --browser [id]", "Show information about this browser, or list if none")
    .option("-i, --index <index>", "Show this index from a multiple result list", -1)
    .option("-D, --no-desktop", "Don't show for desktop devices")
    .option("-M, --no-mobile", "Don't show for mobile devices")
    .option("--ext", "Show extended table of browsers/servers")
    .option("-R, --no-children", "Don't show object children in the table listing.")
    .option("-c, --case-sensitive", "Search in case-sensitive mode")
    .option("-a, --all", "If search results in more than entry, show info for all")
    .option("-z, --fuzzy", "Use path as a fuzzy search term")
    .option("-s, --shorthand", "Show compatibility as shorthand with multiple results")
    .option("-t, --split", "Split a shorthand line into two lines (use with -s)")
    .option("-N, --no-notes", "Don't show notes")
    .option("-F, --no-flags", "Don't show flags")
    .option("-y, --history", "List version history entries per browser.")
    .option("--desc", "Show Short description of the feature")
    .option("--specs", "Show specification links")
    .option("-w, --workers", "Show detailed workers information.")
    .option("--sab", "Show detailed SharedArrayBuffer as param information.")
    .option("--obsoletes", "Show obsolete, non-standard and deprecated child features.")
    .option("--update", "Update data from remote if available")
    .option("--fupdate", "Force update data from remote")
    .option("--cupdate", "Check if update is available")
    .option("--random [scope]", "Show a random entry within \"scope\" (use . for any)")
    .option("--no-colors", "Don't use colors in output")
    .option("--max-chars <width>", "Max number of chars per line before wrap", 84)
    .option("-G, --no-config", "Ignore config file (mdncomp.json) in config folder")
    .option("--read", "Mark notifications in the current update as read") // todo notifications
    .option("--configpath", "Show path to where config file and cache is stored")
    .on("--help", extendedHelp)
    .parse(args);

  // apply config file settings if any
  global.loadModule("init.config")(options);

  function extendedHelp() {
    global.loadModule("init.help")();
  }

  return options
})();

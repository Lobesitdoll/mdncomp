/*!
  Init options module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const options = require("commander");
const version = require("../package.json").version;
const args = process.argv;
const lf = global.lf;

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

  //
  options
    .version(version, "-v, --version")
    .usage("[options] [*]")
    .description(`Get MDN Browser Compatibility Data, docs and specs.${lf}  Version: ${version + lf}  (c) 2018 epistemex.com`)

    .option("-l, --list <api>", "List paths starting with the given value or '.' for top-level")
    .option("-b, --browser <id>", "Show information about this browser, or list if '.'")
    .option("-i, --index <index>", "Show this index from a multiple result list", -1)
    .option("-R, --no-children", "Don't show object children in the table listing.")    // todo
    .option("-D, --no-desktop", "Don't show for desktop devices")
    .option("-M, --no-mobile", "Don't show for mobile devices")
    .option("-c, --case-sensitive", "Search in case-sensitive mode")
    .option("-a, --all", "If search results in more than entry, show info for all")
    .option("-z, --fuzzy", "Use path as a fuzzy search term")
    .option("-s, --shorthand", "Show compatibility as shorthand with multiple results")
    .option("-t, --split", "Split a shorthand line into two lines (use with -s)")
    .option("-W, --no-workers", "Don't show worker support information.")
    .option("-N, --no-notes", "Don't show notes")
    .option("-f, --markdown", "Format link as markdown and turns off colors")
    .option("--ext", "Show extended table of browsers/servers")
    .option("--desc", "Show Short description of the feature")
    .option("--history", "List version history per browser.")
    .option("--specs", "Show specification links")
    .option("--sab", "Show support for SharedArrayBuffer as param.")
    .option("-o, --out <path>", "Save information to file. Use extension for type (.txt or .ansi)")
    .option("-x, --overwrite", "Overwrites an existing file with --out option")
    .option("--doc", "Show documentation. Show cached or fetch")
    .option("--docforce", "Show documentation. Force fetch from MDN server")
    .option("--mdn", "Open entry's document URL in default browser")
    .option("--update", "Update data from remote if available")
    .option("--fupdate", "Force update data from remote")
    .option("--cupdate", "Check if update is available")
    .option("--random [scope]", "Show a random entry within \"scope\" (use . for any)")
    .option("--no-colors", "Don't use colors in output")
    .option("--max-chars <width>", "Max number of chars per line before wrap", 72)
    .option("--no-config", "Ignore config file (mdncomp.json) in config folder")
    .option("--waitkey", "Wait for ENTER key before continuing")
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

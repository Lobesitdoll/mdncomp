/*!
	Core file ver 0.3.0-alpha
	Copyright (c) 2018 Epistemex
	www.epistemex.com
*/

"use strict";

module.exports = init;

const
  mdn = require("mdn-browser-compat-data"),
  options = require("commander"),
  fs = require("fs"),
  version = require('../package.json').version,
  args = process.argv,
  log = console.log.bind(console);

function init() {

  options
    .version(version, "-v, --version")
    .usage('[options] <apipath>')
    .description("Get MDN Browser Compatibility data.\n  (c) 2018 K3N / epistemex.com")
    .option("-l, --list", "List paths starting with the given value or . for top-level")
    .option("-o, --out <path>", "Save information to file")
    .option("-d, --desktop", "Show desktop only")
    .option("-m, --mobile", "Show mobile devices only")
    .option("-c, --case-sensitive", "Search in case-sensitive mode")
    .option("-a, --show-all", "If search results in more than entry, show info for all")
    .option("-s, --shorthand", "Show compatibility as shorthand with multiple results")
    .option("-b, --no-colors", "Don't use colors in output", false)
    .option("--max-chars <width>", "Max number of chars per line before wrap (min. 62)", 72)
    .option("-N, --no-notes", "Don't show notes")
    .option("-e, --noteend", "Show notes (-n) at end instead of in sections")
    .option("-f, --markdown [type]", "Format output as markdown (0=none, 1=GitHub, 2=Stackoverflow", 0)
    //.option("-t, --type <type>", "Used with -o, file type [txt, md, png, jpeg, svg, pdf]", "txt")
    //.option("-w, --width <width>", "Used with -o, Set width of image", 640)
    .action(go)
    .on("--help", function() {
      log();
      log("  Default output is a formatted code block.");
      log();
      log("  Examples:");
      log("    $ mdncomp api.Blob");
      log("    $ mdncomp --notes api.Blob");
      log("    $ mdncomp css.properties.background-color");
      log("    $ mdncomp --list api.HTML*");
      //log("    $ mdncomp -i CanvasPattern.png api.CanvasPattern");
      log()
    })
    .parse(args);
}

function outInfo(txt) {
  if (Array.isArray(txt)) txt = txt.join("\n");
  log(txt);
}

function outStore(txt, noFile) {
  if (Array.isArray(txt)) txt = txt.join("\n");
  if (noFile || !options.out) log(txt);
  else {
    // file
  }
}

/*
  Main call - invokes based on options
 */
function go(path) {

  // invoke boring mode
  if (!options.colors) {
    Object.keys(ANSI).forEach(color => {ANSI[color] = ""});
  }

  // list tree data?
  if (options.list) {
    if (path === ".") {
      outInfo(listTopLevels());
    }
    else {
      let result = list(path, options.caseSensitive);
      outInfo(result);
      outInfo("Found " + result.length + " items.")
    }
  }

  /*
    Main use: list all based on keyword
   */
  else {
    let result = search(path, options.caseSensitive);

    if (!result.length) outInfo("Not found.");
    else {
      if (result.length === 1 || options.showAll) {
        result.forEach(function(entry) {
          resultOut(entry);
        });
        outStore(ANSI.fgMagenta + ANSI.dim + "Data from MDN - `npm i -g mdncomp` ver. " + version + ANSI.reset + lf);
      }
      else {
        outStore(result);
        outInfo("Found " + result.length + " items.")
      }
    }

  }

  function resultOut(entry) {
    outStore(options.shorthand
      ? compatToShort(convertCompat(entry))
      : compatToLong(convertCompat(entry)));
  }
}

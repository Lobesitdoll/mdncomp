/*!
	Core file (version: see package.json)
	Copyright (c) 2018 Epistemex
	www.epistemex.com
*/

"use strict";

module.exports = init;

const
  mdn = require("mdn-browser-compat-data"),
  saves = [],
  options = require("commander"),
  fs = require("fs"),
  version = require('../package.json').version,
  args = process.argv,
  log = console.log.bind(console);

let shortPad = 2;

function init() {

  options
    .version(version, "-v, --version")
    .usage('[options] <apipath>')
    .description("Get MDN Browser Compatibility data." + lf + "  Version: " + version + lf + "  (c) 2018 K3N / epistemex.com")
    .option("-l, --list", "List paths starting with the given value or . for top-level")
    .option("-o, --out <path>", "Save information to file. Extension for type, or --type.")
    .option("-t, --type <type>", "Output format (ansi, txt, svg)", "ansi")
    .option("-d, --desktop", "Show desktop only")
    .option("-m, --mobile", "Show mobile devices only")
    .option("-c, --case-sensitive", "Search in case-sensitive mode")
    .option("-a, --show-all", "If search results in more than entry, show info for all.")
    .option("-s, --shorthand", "Show compatibility as shorthand with multiple results")
    .option("-b, --no-colors", "Don't use colors in output", false)
    .option("--max-chars <width>", "Max number of chars per line before wrap (min. 62)", 72)
    .option("-N, --no-notes", "Don't show notes")
    .option("-e, --noteend", "Show notes (-n) at end instead of in sections")
    .option("-f, --markdown", "Format link as markdown and turns off colors.")
    .option("-w, --width <width>", "Used with -o, Set width of image", 800)
    .action(go)
    .on("--help", function() {
      log();
      log("  Default output is a formatted code block.");
      log();
      log("  Examples:");
      log("   mdncomp arcTo                     show information for arcTo");
      log("   mdncomp arc -a                    show information for all containing \"arc\"");
      log("   mdncomp arc                       list all objects containing \"arc\"");
      log("   mdncomp *html*toblob*             will find HTMLCanvasElement.toBlob");
      log("   mdncomp --list .                  list all top-levels");
      log("   mdncomp *sharedar* -o info.svg    export as svg");
      log()
    })
    .parse(args);

  if (!options.args.length) options.help();
}

function outInfo(txt) {
  if (Array.isArray(txt)) txt = txt.join(lf);
  log(txt);
}

function outStore(txt, noFile) {
  if (Array.isArray(txt)) txt = txt.join(lf);
  if (noFile || !options.out) log(txt);
  else {
    saves.push(txt);
  }
}

/*
  Main call - invokes based on options
 */
function go(path) {

  if (options.out && options.type === "ansi") options.type = getExt(options.out || ".txt");

  // invoke boring mode
  if (!options.colors || options.markdown || options.type === "txt") {
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
      //outInfo("Found " + result.length + " items.")
    }
  }

  /*
    Main use: list all based on keyword
   */
  else {
    let result = search(path, options.caseSensitive);

    if (!result.length) outInfo("Not found.");
    else {
      if (result.length === 1 || (options.showAll && options.type === "txt")) {
        if (options.shorthand) shortPad = getPadLength(result);
        result.forEach(entry => {outResult(entry)});
        if (options.type !== "svg") outStore(ANSI.fgMagenta + "Data from MDN - `npm i -g mdncomp` by epistemex" + ANSI.reset + lf);
        commit();
      }
      else {
        outInfo(result);
        //outInfo("Found " + result.length + " items.")
      }
    }

  }

  function outResult(entry) {
    if (options.type === "svg") {
      outStore(compatToSVG(convertCompat(entry)))
    }
    else {
      outStore(options.shorthand
        ? compatToShort(convertCompat(entry), shortPad)
        : compatToLong(convertCompat(entry)));
    }
  }

  /**
   * If --out is specified, commit all text to a single file.
   */
  function commit() {
    if (options.out && saves.length) {
      fs.writeFile(options.out, saves.join("\n"), function(err) {
        if(err) return log("An error occurred:" + lf + err);
        log("Saved output to file \"" + options.out + "\"!");
      })
    }
  }

  function getPadLength(list) {
    let max = 0;
    list.forEach(e => {
      let len = (prePathFromPath(e) + nameFromPath(e)).length;
      if (len > max) max = len;
    });
    return ++max
  }

  function getExt(path) {
    let i = path.lastIndexOf(".");
    return i < 0 ? "" : path.substr(++i)
  }
}

/*!
	Core file (version: see package.json)
	Copyright (c) 2018 Epistemex
	www.epistemex.com
*/

"use strict";

module.exports = init;

const
  saves = [],
  options = require("commander"),
  version = require("../package.json").version,
  args = process.argv,
  log = console.log.bind(console);

let
  mdn, //require("mdn-browser-compat-data"),
  shortPad = 2;

function init() {

  // Update
  if (args.length === 3 && (args[2] === "--update" || args[2] === "--fupdate")) {
    update(args[2] === "--fupdate");
  }
  else {
    options
      .version(version, "-v, --version")
      .usage('[options] <apipath>')
      .description("Get MDN Browser Compatibility data." + lf + "  Version: " + version + lf + "  (c) 2018 K3N / epistemex.com")
      .option("-l, --list", "List paths starting with the given value or . for top-level")
      .option("-o, --out <path>", "Save information to file. Extension for type, or --type.")
      .option("-t, --type <type>", "Output format (ansi, txt, svg)", "ansi")
      .option("-x, --overwrite", "Overwrites an existing file with --out option.")
      .option("-d, --desktop", "Show desktop only")
      .option("-m, --mobile", "Show mobile devices only")
      .option("-c, --case-sensitive", "Search in case-sensitive mode")
      .option("-a, --show-all", "If search results in more than entry, show info for all.")
      .option("-s, --shorthand", "Show compatibility as shorthand with multiple results")
      .option("-b, --no-colors", "Don't use colors in output", false)
      .option("--max-chars <width>", "Max number of chars per line before wrap.", 72)
      .option("-N, --no-notes", "Don't show notes")
      .option("-e, --noteend", "Show notes (-n) at end instead of in sections (text)")
      .option("-f, --markdown", "Format link as markdown and turns off colors.")
      .option("-w, --width <width>", "Used with -o, Set width of image", 800)
      .option("--raw", "Output the raw JSON data.")
      .option("--update, --fupdate", "Update MDN BCD data from remote (--fupdate forced update).")
      .action(go)
      //    .on("--help", () => {
      //      log();
      //      log("  Examples:");
      //      log("   mdncomp arcTo                     show information for arcTo");
      //      log("   mdncomp arc -a                    show information for all containing \"arc\"");
      //      log("   mdncomp arc                       list all objects containing \"arc\"");
      //      log("   mdncomp *html*toblob*             will find HTMLCanvasElement.toBlob");
      //      log("   mdncomp --list .                  list all top-levels");
      //      log("   mdncomp *sharedar* -o info.svg    export as svg");
      //      log()
      //    })
      //    .on("--remote", () => {
      //      log("updating...");
      //    })
      .parse(args);
    if (!options.args.length) options.help();
  }

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

  mdn = require("../data/data.json");

  if (options.update) {
    log("Updating...");
    return
  }

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
    else if (["deprecated", "experimental"].indexOf(path) >= 0) {
      outInfo(listOnStatus(path));
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
      if (result.length === 1 || (options.showAll && (options.type !== "svg" || options.raw))) {
        if (options.shorthand) shortPad = getPadLength(result);
        result.forEach(entry => {outResult(entry)});
        if (options.type !== "svg") outStore(ANSI.fgMagenta + "Data from MDN - `npm i -g mdncomp` by epistemex" + ANSI.fgWhite + lf);
        commit();
      }
      else {
        outInfo(result);
      }
    }
  }

  function outResult(entry) {
    let compat = new MDNComp(entry);
    if (options.raw) {
      outInfo(indent(JSON.stringify(getPathAsObject(compat.path, true))));
    }
    else if (options.type === "svg") {
      outStore(compatToSVG(compat))
    }
    else {
      outStore(options.shorthand
        ? compatToShort(compat, shortPad)
        : compatToLong(compat));
    }
  }

  /**
   * If --out is specified, commit all text (if any) to a single file.
   */
  function commit() {
    let fs;
    if (options.out && saves.length) {
      fs = require("fs");
      if (fs.existsSync(options.out) && !options.overwrite) {
        const readLine = require('readline'),
          rl = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
          });

        rl.question(ANSI.fgYellow + "A file exist with this name. Overwrite (y, default no)? " + ANSI.fgWhite, resp => {
          if (resp.toLowerCase() === "y" || resp.toLowerCase() === "yes") _save(function() {
            rl.close();
          });
          else {
            log("File not saved.");
            rl.close()
          }
        });
      }
      else _save();
    }

    function _save(callback) {
      fs.writeFile(options.out, saves.join("\n"), "utf8", function(err) {
        if(err) return log("An error occurred:" + lf + err);
        log("Saved output to file \"" + options.out + "\"!");
        if (callback) callback();
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

}

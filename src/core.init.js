/**
 * Initialize options and actions, initialize main modules -or- invoke update process.
 */
function init() {

  // Update
  if (args.length === 3 && (args[2] === "--update" || args[2] === "--fupdate" || args[2] === "--cupdate")) {
    update(args[2] === "--fupdate", args[2] === "--cupdate");
  }

  // Regular options
  else {
    (options = require("commander"))
      .version(version, "-v, --version")
      .usage('[options] <feature>')
      .description("Get MDN Browser Compatibility data." + lf + "  Version: " + version + lf + "  (c) 2018 epistemex.com")
      .option("-l, --list", "List paths starting with the given value or '.' for top-level")
      .option("-o, --out <path>", "Save information to file. Extension for type, or --type.")
      .option("-t, --type <type>", "Output format (ansi, txt, svg)", "ansi")
      .option("-x, --overwrite", "Overwrites an existing file with --out option.")
      .option("-d, --desktop", "Show desktop only")
      .option("-m, --mobile", "Show mobile devices only")
      .option("-c, --case-sensitive", "Search in case-sensitive mode")
      .option("-a, --all", "If search results in more than entry, show info for all.")
      .option("-i, --index <index>", "Show this index from a multiple result list.", -1)
      .option("-s, --shorthand", "Show compatibility as shorthand with multiple results")
      .option("-h, --shorthand-split", "Split a shorthand line into two lines (use with -s)")
      .option("-b, --browser", "Show information about this browser, or if '.' list.")
      .option("-N, --no-notes", "Don't show notes")
      .option("-e, --noteend", "Show notes (-n) at end instead of in sections (text)")
      .option("-f, --markdown", "Format link as markdown and turns off colors.")
      .option("-w, --width <width>", "Used with -o, Set width of image", 800)
      .option("--no-colors", "Don't use colors in output")
      .option("--max-chars <width>", "Max number of chars per line before wrap.", 72)
      .option("--raw", "Output the raw JSON data.")
      .option("--update, --fupdate, --cupdate", "Update BCD from remote (--fupdate=force, --cupdate=check).")
      .option("--no-config", "Ignore config file (mdncomp.json) in root folder.")
      .action(go)
      .on("--help", () => {parseHelp(args)})
      .parse(args);
    if (!options.args.length) options.help();
  }
} // :init

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

/*------------------------------------------------------------------------------------------------------------------*

    MAIN

*------------------------------------------------------------------------------------------------------------------*/

function go(path) {

  // load data
  try {
    mdn = require("../data/data.json");
  } catch(err) {
    log("Critical error: data file not found. Try running using option --fupdate to download latest snapshot.");
    return
  }

  // load config file if any
  try {
    loadConfig();
  } catch(err) {}

  // default type
  if (options.out && options.type === "ansi")
    options.type = getExt(options.out || ".txt");

  // both dt and mob -> cancel out the not options
  if (options.desktop && options.mobile)
    options.desktop = options.mobile = false;

  // invoke boring mode
  if (!options.colors || options.markdown || options.type === "txt")
    Object.keys(ANSI).forEach(color => {ANSI[color] = ""});

  /*
      List tree data?
   */
  if (options.list) {
    if (path === ".") {
      outInfo(listTopLevels())
    }
    else if (["deprecated", "experimental"].indexOf(path) >= 0) {
      outInfo(listOnStatus(path));
    }
    else {
      outInfo(list(path, options.caseSensitive));
    }
  }

  /*
      List browser info?
   */
  else if (options.browser) {
    if (path === ".") {
      outInfo(listBrowsers());
      outInfo(lf + "Valid statuses:");
      outInfo(ANSI.green + getBrowserStatusList().join(", ") + ANSI.white + ANSI.reset);
    }
    else {
      outInfo(listBrowser(path.toLowerCase()).join(lf) + ANSI.white + ANSI.reset);
    }
  }

  /*
    Main use: show info based on keyword
   */
  else {
    let result = search(path, options.caseSensitive);

    if (!result.length) {
      outInfo("Not found.");
    }
    else {
      if (result.length === 1 || (options.index >= 0 && options.index < result.length) || (options.all && (options.type !== "svg" || options.raw))) {

        if (options.shorthand)
          shortPad = getMaxLength(result);

        if (options.index >= 0 && options.index < result.length)
          result = result.splice(options.index, 1);

        result.forEach(entry => {outResult(entry)});

        if (options.type !== "svg")
          outStore(ANSI.magenta + "Data from MDN - `npm i -g mdncomp` by epistemex" + ANSI.white + lf + ANSI.reset);

        commit();
      }
      else {
        let pad = (result.length + "").length;
        result.forEach((item, i) => {
          outInfo(ANSI.yellow + "[" + ANSI.green +(i + "").padStart(pad) + ANSI.yellow + "] " + ANSI.white + item + ANSI.reset);
        });
        //outInfo(result);
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
   * If --out is specified, commit all data (if any) to a single file.
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

        rl.question(ANSI.yellow + "A file exist with this name. Overwrite (y, default no)? " + ANSI.white, resp => {
          if (resp.toLowerCase() === "y" || resp.toLowerCase() === "yes") _save(function() {
            rl.close();
          });
          else {
            log("File not saved.");
            rl.close()
          }
        });
      }
      else
        _save();
    }

    function _save(callback) {
      fs.writeFile(options.out, saves.join("\n"), "utf8", function(err) {
        if(err) return log("An error occurred:" + lf + err);
        log("Saved output to file \"" + options.out + "\"!");
        if (callback) callback();
      })
    }
  }

} // :go

function loadConfig() {
  if (!fs) fs = require("fs");
  const
    path = require("path"),
    file = path.resolve(cfgPath, "mdncomp/mdncomp.json");

  let
    unres = false;  // detect possible access issues

    // todo temp - to detect possible unresolved paths on unknown systems
  if (!fs.existsSync(cfgPath)) {
    log();
    log(ANSI.red + "Could not detect user data area on this system for config file!");
    log("Please report to: https://github.com/epistemex/mdncomp/issues");
    log("and include the following data (replace username with just user):");
    log("  Unresolved path: '" + cfgPath + "'");
    log("  OS: '" + process.platform + "' + the path you would normally use for user data.");
    log("  APPDATA: " + process.env.APPDATA);
    log("  HOME: " + process.env.HOME);
    log(ANSI.reset);
    unres = true;
  }

  if (fs.existsSync(file)) {
    cfg = require(file);
    delete cfg.browser;
    delete cfg.list;
    delete cfg.out;
    delete cfg.all;
    delete cfg.index;
    Object.assign(options, cfg);
    if (unres) log(ANSI.red + "*** If you see this line please include with the above. ***" + ANSI.reset);
  }
}

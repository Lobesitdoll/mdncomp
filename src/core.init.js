
const fs = require("fs");
const path = require("path");

/**
 * Initialize options and actions, initialize main modules -or- invoke update process.
 */
function init() {

  // Check config path
  if (args.length === 3 && args[2] === "--configpath") {
    log(ANSI.white + require("./io").getConfigPath() + ANSI.reset);
  }

  // Update
  else if (args.length >=3 && args.length <= 4 && (args[2] === "--update" || args[2] === "--fupdate" || args[2] === "--cupdate")) {
    if (args.length === 4 && args[3] !== "--diff") {
      log(ANSI.white + "Invalid option. Needs to be: --[*]update [--diff]" + ANSI.reset);
      process.exit(1);
    }
    require("./update")(args[2] === "--fupdate", args[2] === "--cupdate", args[3] === "--diff");
  }

  // Regular options
  else {
    (options = require("commander"))
      .version(version, "-v, --version")
      .usage("[options] <feature>")
      .description("Get MDN Browser Compatibility Data, docs and specs." + lf + "  Version: " + version + lf + "  (c) 2018 epistemex.com")
      .option("-l, --list", "List paths starting with the given value or '.' for top-level")
      .option("-o, --out <path>", "Save information to file. Use extension for type (.txt or .ansi)")
      .option("-x, --overwrite", "Overwrites an existing file with --out option")
      .option("-d, --desktop", "Show desktop only")
      .option("-m, --mobile", "Show mobile devices only")
      .option("-c, --case-sensitive", "Search in case-sensitive mode")
      .option("-a, --all", "If search results in more than entry, show info for all")
      .option("-z, --fuzzy", "Use path as a fuzzy search term")
      .option("-i, --index <index>", "Show this index from a multiple result list", -1)
      .option("-s, --shorthand", "Show compatibility as shorthand with multiple results")
      .option("-h, --split", "Split a shorthand line into two lines (use with -s)")
      .option("-b, --browser", "Show information about this browser, or list if '.'")
      .option("-N, --no-notes", "Don't show notes")
      .option("-e, --noteend", "Show notes at end instead of in sections (text)")
      .option("-f, --markdown", "Format link as markdown and turns off colors")
      .option("--ext", "Show extended table of browsers/servers")
      .option("--desc", "Show Short description of the feature")
      .option("--specs", "Show specification links")
      .option("--doc", "Show documentation. Show cached or fetch")
      .option("--docforce", "Show documentation. Force fetch from MDN server")
      .option("--mdn", "Open entry's document URL in default browser")
      .option("--waitkey", "Wait for ENTER key before continuing")
      .option("--random", "Show a random entry. (mdncomp --random . )")
      .option("--update, --fupdate, --cupdate", "Update data from remote (--fupdate=force, --cupdate=check)")
      .option("--diff", "Only valid appended to --[*]update. Shows list of new features")
      .option("--no-colors", "Don't use colors in output")
      .option("--max-chars <width>", "Max number of chars per line before wrap", 72)
      .option("--no-config", "Ignore config file (mdncomp.json) in config folder")
      .option("--configpath", "Show path to where config file and cache is stored")
      .action(go)
      .on("--help", () => {parseHelp(args)})
      .parse(args);

    if (!options.args.length) options.help();
  }
} // :init

function outInfo(txt) {
  if (Array.isArray(txt)) txt = txt.join(lf);
  log(txt + ANSI.reset);
}

function outStore(txt, noFile) {
  if (Array.isArray(txt)) txt = txt.join(lf);
  if (noFile || !options.out) log(txt);
  else {
    saves.push(txt);
  }
}

/*------------------------------------------------------------------------------------------------------------------*

    PARSE KEY OPTIONS

*------------------------------------------------------------------------------------------------------------------*/

function go(path) {

  io = require("./io");

  // fixing non-valid args produced by f.ex "\*"
  if (typeof path !== "string") path = ".";

  // load data
  try {
    mdn = require("../data/data.json");
  }
  catch(err) {
    log("Critical error: data file not found. Try running with option --fupdate to download latest snapshot.");
    process.exit(1);
  }

  // load config file if any
  try {
    loadConfig()
  } catch(err) {}

  // both dt and mob -> cancel out the not options
  if (options.desktop && options.mobile)
    options.desktop = options.mobile = false;

  // invoke boring mode
  if (!options.colors || options.markdown || getExt(options.out || ".ansi") === "txt")
    Object.keys(ANSI).forEach(color => {
      if (!color.includes("ursor")) ANSI[color] = "";
    });

  /*
      Random ?
   */
  if (options.random) {
    path = randomCompat(path);
    options.index = 0;
  }

  /*
      List tree data ?
   */
  if (options.list) {
    // top-levels
    if (path === ".") {
      outInfo(ANSI.reset + "Valid path roots:");
      outInfo(ANSI.green + listTopLevels().join(lf) + ANSI.reset);
      outInfo(lf + "Valid statuses:");
      outInfo(ANSI.green + "standard, experimental, deprecated" + ANSI.reset);
    }
    // list on status
    else if (["deprecated", "experimental", "standard"].includes(path)) {
      outInfo(listOnStatus(path));
    }
    else {
      let _list = list(path, options.caseSensitive);
      if (_list.length === 1 && isCompat(_list[0])) {
        options.list = undefined;
        go(_list[0]);
      }
      else
        outInfo(_list);
    }
  }

  /*
      List browser info ?
   */
  else if (options.browser) {
    if (path === ".") {
      outInfo(ANSI.reset + "Valid browser identifiers:");
      outInfo(ANSI.green + listBrowsers().join(lf) + ANSI.reset);
      outInfo(lf + "Valid statuses:");
      outInfo(ANSI.green + getBrowserStatusList().join(", "));
    }
    else {
      outInfo(listBrowser(path.toLowerCase()).join(lf));
    }
  }

  /*------------------------------------------------------------------------------------------------------------------*

      MAIN USE: Show info based on keyword (wildcard, fuzzy, regexp)

  *------------------------------------------------------------------------------------------------------------------*/

  else {
    let result = search(path, options.caseSensitive);

    if (!result.length) {
      outInfo("Not found.");
    }
    else {
      if (result.length === 1 || (options.index >= 0 && options.index < result.length) || options.all) {

        if (options.shorthand)
          shortPad = getMaxLength(result);

        if (options.index >= 0 && options.index < result.length)
          result = result.splice(options.index, 1);

        result.forEach(entry => {outResult(entry)});

        if (result.length === 1) {
          let compat = new MDNComp(result[0]);

          // check --doc link
          if (options.doc || options.docforce) {
            if (compat.url.length) {
              getDoc(compat.url, _commit)
            }
            else {
              outInfo(ANSI.red + "Documentation URL is not defined for this feature." + ANSI.reset + lf);
              _commit();
            }
          }
          else {
            _commit();
          }

          // check --mdn link
          if (options.mdn) {
            if (compat.url.length) {
              io.run(compat.url);
            }
            else {
              log("No URL is defined for this entry.");
            }
          }

        }
      }
      else {
        let pad = (result.length + "").length;
        result.forEach((item, i) => {
          outInfo(ANSI.yellow + "[" + ANSI.green +(i + "").padStart(pad) + ANSI.yellow + "] " + ANSI.white + item + ANSI.reset);
        });
      }
    }

    function _commit() {
      addFooter();
      commit();
      if (options.waitkey) {
        console.log(ANSI.cursorUp + ANSI.cursorUp);
        setTimeout(() => console.log("Waiting for ENTER key..." + ANSI.cursorUp), 3000);
        process.stdin.on("data", () => process.exit());
      }
    }
  }

  function addFooter() {
    outStore(ANSI.magenta + "Data from MDN - `npm i -g mdncomp` by epistemex" + ANSI.white + lf + ANSI.reset)
  }

  function outResult(entry) {
    let compat = new MDNComp(entry);
    outStore(options.shorthand
             ? compatToShort(compat, shortPad)
             : compatToLong(compat));
  }

  /**
   * If --out is specified, commit all data (if any) to a single file.
   */
  function commit() {
    if (options.out && saves.length) {
      // race cond. in this scenario is theoretically possible..
      if (fs.existsSync(options.out) && !options.overwrite) {
        const readLine = require('readline'),
          rl = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
          });

        rl.question(ANSI.yellow + "A file with this name already exists. Overwrite? (y(es), default: no)? " + ANSI.white, resp => {
          if (resp.startsWith("y")) _save(() => {
            rl.close();
          });
          else {
            log("File not saved.");
            rl.close();
            process.exit();
          }
        });
      }
      else
        _save();
    }

    function _save(callback) {
      fs.writeFile(options.out, saves.join("\n"), "utf8", function(err) {
        if(err) return log("An error occurred:" + lf + err);
        log(ANSI.green + `Saved output to file "${ANSI.cyan + options.out + ANSI.green}"!` + ANSI.reset);
        if (callback) callback();
      })
    }
  }

} // :go

function loadConfig() {

  const
    file = path.resolve(io.getConfigDataPath(), ".config.json");

  if (fs.existsSync(file)) {
    let cfg = require(file);
    cfg = cfg.options || cfg || {};

    if (isBool(cfg.fuzzy)) options.fuzzy = cfg.fuzzy;
    if (isBool(cfg.colors)) options.colors = cfg.colors;
    if (isBool(cfg.notes)) options.notes = cfg.notes;
    if (isBool(cfg.noteEnd)) options.noteEnd = cfg.noteEnd;
    if (isBool(cfg.shorthand)) options.shorthand = cfg.shorthand;
    if (isBool(cfg.split)) options.split = cfg.split;
    if (isBool(cfg.caseSensitive)) options.caseSensitive = cfg.caseSensitive;
    if (isBool(cfg.desktop)) options.desktop = cfg.desktop;
    if (isBool(cfg.mobile)) options.mobile = cfg.mobile;
    if (isBool(cfg.overwrite)) options.overwrite = cfg.overwrite;
    if (isBool(cfg.markdown)) options.markdown = cfg.markdown;
    if (isNum(cfg.maxChars)) options.maxChars = cfg.maxChars|0;
    if (isBool(cfg.doc)) options.doc = cfg.doc;
    if (isBool(cfg.docforce)) options.docforce = cfg.docforce;
    if (isBool(cfg.ext)) options.ext = cfg.ext;
    if (isBool(cfg.desc)) options.desc = cfg.desc;
    if (isBool(cfg.specs)) options.specs = cfg.specs;
    if (isBool(cfg.waitkey)) options.waitkey = cfg.waitkey;

    function isBool(v) {return typeof v === "boolean"}
    function isNum(v) {return typeof v === "number"}
  }
}

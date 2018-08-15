#!/usr/bin/env node
/*! mdncomp (c) epistemex */

/*----------------------------------------------------------------------------*/

const DEBUG = true;

/*----------------------------------------------------------------------------*/

const lf = "\r\n";

const text = {
  basicSupport     : "Basic Support",
  desktop          : "Desktop",
  mobile           : "Mobile",
  ext              : "Extended",
  hdrNotes         : "NOTES",
  hdrLinks         : "LINKS",
  hdrFlags         : "FLAGS",
  hdrFlagsHistory  : "FLAGS & HISTORY",
  hdrHistory       : "HISTORY",
  hdrSpecs         : "SPECS",
  hdrWorkers       : "WORKER SUPPORT",
  hdrSAB           : "SHAREDARRAYBUFFER AS PARAMETER SUPPORT",
  hdrBrowsers      : "Browsers:",
  workerSupport    : "In Worker:",
  sabSupport       : "SAB as param:",
  sabInDataView    : "SAB in DataView:",
  standard         : "On Standard Track",
  experimental     : "Experimental",
  deprecated       : "Deprecated",
  nonStandard      : "Non-Standard",
  standardShort    : "STD",
  experimentalShort: "EXP",
  deprecatedShort  : "DEPR",
  nonStandardShort : "NOSTD",
  altName          : "Alternative name",
  usesAltName      : " uses alternative name: ",
  versionColumn    : "Version ",
  partialImpl      : "Partial implementation.",
  vendorPrefix     : "Vendor prefix",
  tooLimitedScope  : "Sorry, too limited scope.",
  noResult         : "Sorry, no result",
  workerHint       : "?RUse option ?c-w, --worker?R to see Worker support details.",
  sabHint          : "?RUse option ?c--sab?R to see SharedArrayBuffer as a parameter details.",
  historyHint      : "?RUse option ?c-y, --history?R to see historical data.",
  specsHint        : "?RUse option ?c--specs?R to see specifications.",
  descHint         : "?RUse option ?c--desc?R to get a short description of the feature.",
  filterHint       : "?RAdd additional search terms to filter result list.",
  refLink          : "Ref link",
  seeNote          : "See note",
  thisFeatBehind   : "This feature is behind the",
  preference       : "preference",
  setTo            : "set to",
  compileWith      : "Compile with",
  startWith        : "Start with",
  specRec          : "Recommendation",
  specCandidate    : "Candidate",
  specStandard     : "Standard",
  specDraft        : "Draft",
  specRelease      : "Release",
  specWorking      : "Working",
  specEditors      : "Editor's",
  specLiving       : "Living",
  obsolete         : "Obsolete",
  status           : "status",
  unknownBrowser   : "Unknown browser",
  noArgListsId     : "No argument lists all valid IDs",
  listFeature      : "Feature",
  listParent       : "Parent branch",
  listBranch       : "Branch (not a feature, no direct sub-features)",
  hasMergedAnother : "This has been merged in another",
  lastCallWorking  : "Last Call Working",
  specProposed     : "Proposed",
  valid            : "Valid",
  browserIds       : "browser identifiers:",
  statuses         : "statuses",
  pathRoots        : "path roots",
  addOptionIndex   : "Add option '-i <n>' to list a specific feature using the same search.",

  indexOutOfRange : "Index out of range",
  invalidRegex    : "Invalid regular expression.",
  invalidColumnIds: "Invalid browser id in custom columns.",
  notFeatureObject: "Not a feature object or parent to feature(s). Also see the \"--list\" option.",
  versionWarning  : "WARNING: mdncomp is built for Node version 8 or newer. It may not work in older Node.js versions.",
  criticalDataFile: "Critical error: data file not found.\n?yTry running with option --fupdate to download latest snapshot.",
  missingModule   : "Critical: A core module seem to be missing. Use 'npm i -g mdncomp' to reinstall.",
  unhandled       : ` *** An unhandled error occurred!
  Please consider reporting to help us solve it via GitLab:
  https://gitlab.com/epistemex/mdncomp/issues
  
  Try update/reinstall 'npm i -g mdncomp' (or --fupdate) if the issue persists.
  `
};

/*- SYSTEM VALIDATIONS AND ERROR HANDLING ------------------------------------*/

if ( +process.versions.node.split(".")[ 0 ] < 8 ) {
  console.log(text.versionWarning);
}

const _errHandler = (err) => {
  console.log(text.unhandled, err);
  process.exitCode = 1;
};

process.on("error", _errHandler);
process.on("uncaughtException", _errHandler);

const _base = `../${DEBUG ? "src" : "build"}/`;
const utils = loadModule("core.utils");

/**
 * Available globally to all modules.
 * Properties here are for things that can be cached due to
 * being used through the entire lifetime, or because some
 * properties came from the config file.
 */
Object.assign(global, {
  lf,
  DEBUG,
  _base,
  text,
  loadModule,
  shortPad: 1,
  char    : { sep: "|", progressBar: "#", yes: "Y", no: "-", unknown: "?", feature: "F", parent: "P", branch: "B", flags: "F" },
  lang    : "en-US",
  ANSI    : loadModule("core.ansi"),
  log     : utils.log,
  err     : utils.err,
  options : {}
});

const options = global.options = loadModule("init.options");

// No ANSI color?
if ( !options.colors ) {
  Object
    .keys(global.ANSI)
    .filter(ansi => !ansi.includes("ursor"))
    .forEach(color => ANSI[ color ] = "");
}

/*- CHECK FOR UPDATE, UPDATE PATCH/FULL IF EXISTS, OR EXIT -------------------*/

if ( options.update ) {
  loadModule("core.update")(false, false);
}

/*- CHECK IF AN UPDATE IS AVAILABLE. -----------------------------------------*/

else if ( options.cupdate ) {
  loadModule("core.update")(false, true);
}

/*- FORCE FULL UPDATE --------------------------------------------------------*/

else if ( options.fupdate ) {
  loadModule("core.update")(true, false);
}

/*- SHOW CONFIG PATH ---------------------------------------------------------*/

else if ( options.configpath ) {
  console.log(require("path").resolve(loadModule("core.io").getConfigDataPath()));
}

/*- LIST BROWSER VERSIONS AND STATUS -----------------------------------------*/

else if ( options.browser ) {
  loadModule("option.browser")(options.browser);
}

/*- LIST BY API PATHS --------------------------------------------------------*/

else if ( options.list ) {
  loadModule("option.list")(options.list);
}

/*- SEARCH APIS FOR FEATURES -------------------------------------------------*/

else if ( options.args.length ) {
  search();
}

/*- RANDOM -------------------------------------------------------------------*/

else if ( options.random ) {
  const path = loadModule("option.random")(options.random);
  if ( path.length ) {
    showResults(path);
  }
  else {
    err("Sorry, the keyword doesn't produce a scope. Try add --fuzzy.");
  }
}

/*- IF NO OPTIONS OR KEYWORDS, DEFAULT TO HELP -------------------------------*/

else {
  options.help();
}

/*- SEARCH -------------------------------------------------------------------*/

function search() {
  const keyword = options.args.shift(); // Note: secondary+ args are extracted in formatter.common module
  const result = loadModule("option.search")(keyword);

  // no result
  if ( !result.length ) {
    if ( !options.fuzzy && !keyword.includes("*") && !keyword.startsWith("/") ) {
      options.fuzzy = true;
      options.args.unshift(keyword);  // reinsert as we do a second call, just with fuzzy
      search();
    }
    else {
      log(`?R${text.noResult}.`);
    }
  }

  // multiple results
  else if ( result.length > 1 && options.index < 0 ) {
    let pad = Math.log10(result.length) + 1;
    let str = "";
    result.forEach((line, i) => {
      str += `?y[?g${("" + i).padStart(pad)}?y] ?w${line}\n`;
    });
    str += `?R\n` + utils.breakAnsiLine(text.addOptionIndex, options.maxLength);
    log(str);
  }

  // index out of range?
  else if ( result.length > 1 && options.index >= result.length ) {
    err(`?y${text.indexOutOfRange}.?R`);
  }

  // show feature
  else {
    showResults(result.length === 1 ? result[ 0 ] : result[ options.index ]);
  }
}

/**
 * Show main results
 * @param path
 */
function showResults(path) {
  const preFormat = loadModule("formatter.common")(path);
  if (!preFormat ) return;

  const results = loadModule(options.shorthand ? "formatter.short" : "formatter.long")(preFormat);

  // Add footer
  log(results, "?pData from MDN - `npm i -g mdncomp` by epistemex?w?R");
}

/*- SYSTEM -------------------------------------------------------------------*/

/**
 * require() wrapper that incorporates error handling
 * and allow for `const`s use in parent scope.
 * @param {string} name - module name. Will be prefixed with rel. path.
 * @returns {*}
 */
function loadModule(name) {
  let module;
  try {
    module = require(_base + name);
  }
  catch(err) {
    console.error(text.missingModule);
    console.error(name);
    if ( DEBUG ) {
      console.error("ERROR OBJECT:", err);
    }
    process.exit();
  }
  return module;
}

#!/usr/bin/env node
/*! mdncomp (c) epistemex */

/*----------------------------------------------------------------------------*/

const DEBUG = false;

/*----------------------------------------------------------------------------*/

const lf = "\r\n";

const text = {
  yes              : "Y",
  basicSupport     : "Basic Support",
  desktop          : "Desktop",
  mobile           : "Mobile",
  ext              : "Extended",
  hdrNotes         : "NOTES:",
  hdrLinks         : "LINKS:",
  hdrFlags         : "FLAGS:",
  hdrFlagsHistory  : "FLAGS AND HISTORY:",
  hdrHistory       : "HISTORY:",
  hdrSpecs         : "SPECS:",
  hdrDocs          : "DOCS:",
  hdrWorkers       : "WORKER SUPPORT:",
  hdrSAB           : "SHAREDARRAYBUFFER AS PARAMETER SUPPORT:",
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
  deprecatedShort  : "DEP",
  nonStandardShort : "NOSTD",
  altName          : "Alternative name",
  usesAltName      : " uses alternative name: ",
  versionColumn    : "Version ",
  partialImpl      : "Partial implementation.",
  vendorPrefix     : "Vendor prefix: ",
  tooLimitedScope  : "Sorry, too limited scope.",
  noResult         : "Sorry, no result",
  workerHint       : "?R*) Use option ?c--workers?R to see Worker support details.",
  sabHint          : "?R*) Use option ?c--sab?R to see SharedArrayBuffer as a parameter details.",
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
  hasMergedAnother : "This has been merged in another",
  lastCallWorking  : "Last Call Working",
  specProposed     : "Proposed",
  valid            : "Valid",
  browserIds       : "browser identifiers:",
  statuses         : "statuses",
  pathRoots        : "path roots",
  addOptionIndex   : "Add option '-i <n>' to list a specific feature using the same search.",
  mdncomp          : "npm i -g mdncomp",
  gitName          : "GitLab",
  gitUrl           : "https://gitlab.com/epistemex/mdncomp/"
};

const errText = {
  indexOutOfRange : "Index out of range",
  invalidRegex    : "Invalid regular expression.",
  notFeatureObject: "Not a feature object or parent to feature(s). Also see the \"--list\" option.",
  versionWarning  : "WARNING: mdncomp is built for Node version 8 or newer. It may not work in older Node.js versions.",
  criticalDataFile: "Critical error: data file not found.\n?yTry running with option --fupdate to download latest snapshot.",
  missingModule   : String.raw`Critical: A core module seem to be missing. Use '${text.mdncomp}' to reinstall.`,
  unhandled       : String.raw`An unhandled error occurred!${lf}Please consider reporting to help us solve it via ${text.gitName}:${lf}
  ${text.gitUrl}issues${lf + lf}Try update/reinstall '${text.mdncomp}' (or --fupdate) if the issue persists.${lf}`
};

/*-----------------------------------------------------------------------------*

    System validations and error handling

*/
if ( +process.versions.node.split(".")[ 0 ] < 8 ) {
  console.log(errText.versionWarning);
}

const _errHandler = (err) => {
  console.log(errText.unhandled, err);
  process.exit(1);
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
  errText,
  loadModule,
  shortPad: 1,
  sepChar : "|",
  lang    : "en-US",
  ANSI    : loadModule("core.ansi"),
  log     : utils.log,
  err     : utils.err,
  options : {}
});

const options = global.options = loadModule("init.options");

// Use ANSI color?
if ( !options.colors ) {
  Object
    .keys(global.ANSI)
    .filter(ansi => !ansi.includes("ursor"))
    .forEach(color => ANSI[ color ] = "");
}

/*-----------------------------------------------------------------------------*

    Check for update, update patch/full if exists, or exit

*/
if ( options.update ) {
  loadModule("core.update")(false, false);
}

/*-----------------------------------------------------------------------------*

    Check if an update is available.

*/
else if ( options.cupdate ) {
  loadModule("core.update")(false, true);
}

/*-----------------------------------------------------------------------------*

    Force full update

*/
else if ( options.fupdate ) {
  loadModule("core.update")(true, false);
}

/*-----------------------------------------------------------------------------*

    Show config path

*/
else if ( options.configpath ) {
  console.log(require("path").resolve(loadModule("core.io").getConfigDataPath()));
}

/*-----------------------------------------------------------------------------*

    List browser versions and status

*/
else if ( options.browser ) {
  loadModule("option.browser")(options.browser);
}

/*-----------------------------------------------------------------------------*

    List by API paths

*/
else if ( options.list ) {
  loadModule("option.list")(options.list);
}

/*-----------------------------------------------------------------------------*

    Search APIs for features

*/
else if ( options.args.length ) {
  search();
}

/*-----------------------------------------------------------------------------*

    Random

*/
else if ( options.random ) {
  const path = loadModule("option.random")(options.random);
  if ( path.length ) {
    showResults(path);
  }
  else {
    err("Sorry, the keyword doesn't produce a scope. Try add --fuzzy.");
  }
}

/*-----------------------------------------------------------------------------*

    If no options or keywords, default to help

*/
else {
  options.help();
}

/*-----------------------------------------------------------------------------*

    SEARCH

*/
function search() {
  const keyword = options.args.shift(); // Note: secondary+ arg(s) is extracted in formatter.common module
  const result = loadModule("option.search")(keyword);

  // no result
  if ( !result.length ) {
    if ( !options.fuzzy && !keyword.includes("*") && !keyword.startsWith("/") ) {
      options.fuzzy = true;
      search();
    }
    else {
      log(`?R${text.noResult}.`);
    }
  }

  // multiple results
  else if ( result.length > 1 && options.index < 0 ) {
    let pad = ("" + result.length).length;
    let str = "";
    result.forEach((line, i) => {
      str += `?y[?g${("" + i).padStart(pad)}?y] ?w${line}\n`;
    });
    str += `?R\n` + utils.breakAnsiLine(text.addOptionIndex, options.maxLength);
    log(str);
  }

  // index out of range?
  else if ( result.length > 1 && options.index >= result.length ) {
    err(`?y${errText.indexOutOfRange}.?R`);
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
  const results = loadModule(options.shorthand ? "formatter.short" : "formatter.long")(preFormat);

  // Add footer
  log(results, lf + "?pData from MDN - `npm i -g mdncomp` by epistemex?w?R");
}

/*-----------------------------------------------------------------------------*

    SYSTEM

*/

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
    console.error(errText.missingModule);
    console.error(name);
    if ( DEBUG ) {
      console.error("ERROR OBJECT:", err);
    }
    process.exit();
  }
  return module;
}

#!/usr/bin/env node
/*! mdncomp (c) epistemex */

/*----------------------------------------------------------------------------*/

const DEBUG = __dirname.substring(__dirname.length - 3) === "src";  // for older nodes, checks below
if ( DEBUG ) console.log("DEBUG MODE");

/*----------------------------------------------------------------------------*/

const lf = "\r\n";

// Internal texts needed in case errors happens before locale files are loaded. Are merged with locale below.
const text = {
  "versionWarning"  : "WARNING: mdncomp is built for Node version 8.3 or newer. It may not work in older Node.js versions.",
  "criticalDataFile": "Critical error: data file not found.\n?yTry running with option --fupdate to download latest snapshot.",
  "missingModule"   : "Critical: A core module seem to be missing. Use 'npm i -g mdncomp' to reinstall.",
  "unhandled"       : "--- An unhandled error occurred! ---\n\nConsider reporting to help us solve it via GitLab if it persists:\nhttps:\/\/gitlab.com/epistemex/mdncomp/issues\n\nAlternatively:\nTry update/reinstall 'npm i -g mdncomp' (or --fupdate for just data).\n\n"
};

/*- SYSTEM VALIDATIONS AND ERROR HANDLING ------------------------------------*/

const nv = process.versions.node.split(".").map(n => n|0);
if ( nv[ 0 ] < 8 || (nv[ 0 ] === 8 && nv[ 1 ] < 3) ) {
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
  char     : {
    sep         : "|",
    progressBar : "#",
    yes         : "Y",
    no          : "-",
    unknown     : "?",
    feature     : "F",
    parent      : "P",
    branch      : "B",
    flags       : "F",
    notes       : "*",
    nonStd      : "?",
    experimental: "!",
    deprecated  : "x"
  },
  lang     : "en-us",
  languages: [ "en", "en-us", "es", "no" ],
  ANSI     : loadModule("core.ansi"),
  log      : utils.log,
  err      : utils.err,
  options  : {}
});

/*- PRELOAD CONFIG FILE ------------------------------------------------------*/

// preload config file, second step is executed in init.options below.
loadModule("init.config").preload();

/*- INIT LOCALES -------------------------------------------------------------*/

loadModule("core.locale");

/*- INIT OPTIONS -------------------------------------------------------------*/

const options = global[ "options" ] = loadModule("init.options");

/*- ANSI COLORS --------------------------------------------------------------*/

if ( !options.colors ) {
  Object
    .keys(global.ANSI)
    .forEach(key => {
      if ( !key.includes("ursor") ) ANSI[ key ] = "";
    });
}

/*- CHECKS FOR UPDATE, UPDATE PATCH/FULL IF EXISTS, OR EXIT -------------------*/

if ( options.update ) {
  loadModule("core.update")(false);
}

/*- FORCE FULL UPDATE --------------------------------------------------------*/

else if ( options.fupdate ) {
  loadModule("core.update")(true);
}

/*- SHOW CONFIG PATH ---------------------------------------------------------*/

else if ( options.configpath ) {
  log(`\n?w${loadModule("core.io").getConfigDataPath()}?R\n`);
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
    err(`?y\n${text.tooLimitedScope}?R\n`);
  }
}

/*- IF NO OPTIONS OR KEYWORDS, DEFAULT TO HELP -------------------------------*/

else {
  options.help();
}

/*- SEARCH -------------------------------------------------------------------*/

function search(recursive = false) {
  const keyword = options.args.shift(); // Note: secondary+ args are extracted in formatter.common module
  const result = loadModule("option.search")(keyword);

  // no result
  if ( !result.length && !recursive) {
    if ( !options.fuzzy && !options.deep && !keyword.includes("*") && !keyword.startsWith("/") ) {
      options.fuzzy = true;
      options.args.unshift(keyword);  // reinsert as we do a second call, just with fuzzy
      search(true);
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
  if ( !preFormat ) return;

  loadModule(options.shorthand ? "formatter.short" : "formatter.long")(preFormat);

  // Add footer
  log(`?p${text.dataFromMDN} - "npm i -g mdncomp" (c) epistemex?w?R${lf}`);
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
      console.error("\nERROR OBJECT:\n", err);
    }
    process.exit();
  }
  return module;
}

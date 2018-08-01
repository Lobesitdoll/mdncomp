#!/usr/bin/env node

/*----------------------------------------------------------------------------*/

const DEBUG = true;

/*----------------------------------------------------------------------------*/

const LF = "\r\n";

const text = {
  yes            : "Y",
  basicSupport   : "Basic Support",
  device         : { "desktop": "Desktop", "mobile": "Mobile", "ext": "Extended" },
  hdrNotes       : "NOTES:",
  hdrLinks       : "LINKS:",
  hdrFlags       : "FLAGS:",
  hdrFlagsHistory: "FLAGS AND HISTORY",
  hdrHistory     : "HISTORY:",
  hdrSpecs       : "SPECS:",
  hdrDocs        : "DOCS:",
  workerSupport  : "In Worker:",
  sabSupport     : "SAB as param:",
  sabInDataView  : "SAB in DataView:",
  standard       : "On Standard Track",
  experimental   : "Experimental",
  deprecated     : "Deprecated",
  tooLimitedScope: "Sorry, too limited scope.",
  noResult       : "Sorry, no result",
  addOptionIndex : "Add option '-i <n>' to list a specific feature using the same search.",
  mdncomp        : "npm i -g mdncomp",
  gitName        : "GitLab",
  gitUrl         : "https://gitlab.com/epistemex/mdncomp/"
};

const errText = {
  indexOutOfRange: "Index out of range",
  versionWarning : "WARNING: mdncomp is built for Node version 8 or newer. It may not work in older Node.js versions.",
  missingModule  : String.raw`Critical: A core module seem to be missing. Use '${text.mdncomp}' to reinstall.`,
  unhandled      : String.raw`An unhandled error occurred!${LF}Please consider reporting to help us solve it via ${text.gitName}:${LF}
  ${text.gitUrl}issues${LF+LF}Try update/reinstall '${text.mdncomp}' (or --fupdate) if the issue persists.${LF}`
};

/*-----------------------------------------------------------------------------*

    System validations and error handling

*/
if (+process.versions.node.split(".")[0] < 8) {
  console.log(errText.versionWarning);
}

const _errHandler = (err) => {
  console.log(errText.unhandled, err);
  process.exit(1)
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
  DEBUG,
  _base,
  text,
  errText,
  loadModule,
  lang      : "en-US",
  lf        : LF,
  sepChar   : "|",
  shortPad  : 1,
  ANSI      : loadModule("core.ansi"),
  options   : {}
});

Object.assign(global.options, loadModule("init.options"));

// Use ANSI color?
if (!options.colors || options.markdown || utils.getExt(options.out).toLowerCase() === ".txt") {
  Object
    .keys(global.ANSI)
    .filter(item => !item.includes("ursor"))
    .forEach(item => ANSI[item] = "");
}

/*-----------------------------------------------------------------------------*

    Check for update, update patch/full if exists, or exit

*/
if (options.update) {
  loadModule("core.update")(false, false);
}

/*-----------------------------------------------------------------------------*

    Check if an update is available.

*/
else if (options.cupdate) {
  loadModule("core.update")(false, true);
}

/*-----------------------------------------------------------------------------*

    Force full update

*/
else if (options.fupdate) {
  loadModule("core.update")(true, false);
}

/*-----------------------------------------------------------------------------*

    Show config path

*/
else if (options.configpath) {
  console.log(require("path").resolve(loadModule("core.io").getConfigDataPath()))
}

/*-----------------------------------------------------------------------------*

    List browser versions and status

*/
else if (options.browser) {
  loadModule("option.browser")(options.browser);
}

/*-----------------------------------------------------------------------------*

    List by API paths

*/
else if (options.list) {
  loadModule("option.list")(options.list);
}

/*-----------------------------------------------------------------------------*

    Search APIs for features

*/
else if (options.args.length) {
  search()
}

/*-----------------------------------------------------------------------------*

    Random

*/
else if (options.random) {
  const path = loadModule("option.random")(options.random);
  showResults(path)
}

/*-----------------------------------------------------------------------------*

    If no options or keywords, default to help

*/
else {
  options.help();
}

function search() {
  const keyword = options.args[0];
  const result = loadModule("option.search")(keyword);

  // no result
  if (!result.length) {
    if (!options.fuzzy && !keyword.includes("*") && !keyword.startsWith("/")) {
      options.fuzzy = true;
      search();
    }
    else {
      console.log(`${ANSI.reset}${text.noResult}.`)
    }
  }
  // multiple results
  else if (result.length > 1 && options.index < 0) {
    let pad = ("" + result.length).length;
    let str = "";
    result.forEach((line, i) => {
      str += `${ANSI.yellow}[${ANSI.green}${("" + i).padStart(pad)}${ANSI.yellow}] ${ANSI.white}${line}\n`
    });
    str += `${ANSI.reset}\n` + utils.breakAnsiLine(text.addOptionIndex, options.maxLength);
    console.log(str);
  }
  // index out of range
  else if (result.length > 1 && options.index >= result.length) {
    console.log(`${ANSI.red}${errText.indexOutOfRange}.${ANSI.reset}`);
  }
  // show feature
  else {
    showResults(result.length === 1 ? result[0] : result[options.index]);
  }
}
/**
 * Show main results
 * @param path
 */
function showResults(path) {
  const preFormat = loadModule("formatter.common")(path);
  // todo check format type
  const results = loadModule("formatter.long")(preFormat);
  // todo save?
  console.log(results);
}

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
    if (DEBUG) {
      console.error("ERROR OBJECT:", err);
    }
    // todo document difference between this meaning and node's own exit code 1 (uncaught/fatal)
    process.exit(1);
  }
  return module
}

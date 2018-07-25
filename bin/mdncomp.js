#!/usr/bin/env node

/*----------------------------------------------------------------------------*/

const DEBUG = true;

/*----------------------------------------------------------------------------*/

const text = {
  mdncomp: "mdncomp i -g mdncomp"
};

const errText = {
  versionWarning: "WARNING: mdncomp is built for Node version 8 or newer. It may not work in older Node.js versions.",
  missingModule: String.raw`Critical: A core module seem to be missing. Use '${text.mdncomp}' to reinstall.`,
  unhandled    : `An unhandled error occurred!\nPlease consider reporting to help us solve it via GitLab:
  https://gitlab.com/epistemex/mdncomp/issues\nTry reinstalling 'npm i -g mdncomp' (or update) if the issue persists.`
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
  DEBUG    : DEBUG,
  _base    : _base,
  lf       : "\r\n",
  sepChar  : "|",
  shortPad : 1,
  lang     : "en-US",
  ANSI     : loadModule("core.ansi"),
  options  : {}
});

// Load options from command line and config file
const options = global.options = loadModule("init.options");

// Use ANSI color?
if (!options.colors || options.markdown || utils.getExt(options.out) === ".txt") {
  Object
    .keys(global.ANSI)
    .filter(item => !item.includes("ursor"))
    .forEach(item => ANSI[item] = "");
}

/*-----------------------------------------------------------------------------*

    Check for update, update patch/full if exists or exit

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
  // DISCUSS: multiple results can cause a very long list. Merge sep. keywords into a regex instead for convenience? or search-within-result approach?
  const results = [];
  options.args.forEach(arg => {
    results.push(loadModule("option.search")(arg))
  });
  const preFormat = loadModule("formatter.common")(results);
}

/*-----------------------------------------------------------------------------*

    If no option, default to help

*/
else {
  options.help();
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
    console.log(errText.missingModule);
    if (DEBUG) {
      console.log("ERROR OBJECT:", err);
    }
    // todo document difference between this meaning and node's own exit code 1 (uncaught/fatal)
    process.exit(1);
  }
  return module
}

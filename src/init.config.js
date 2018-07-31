/*!
  Config file module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

require("json5/lib/register");

const ANSI = global.ANSI;
const fs = require("fs");
const path = require("path");
const filePath = path.resolve(global.loadModule("core.io").getConfigDataPath(), ".config.json");
const filePath5 = filePath + "5";

/**
 * The method tries to load a config file from the user area in the folder
 * .mdncomp/*. If found settings are checked against a whitelist and applied
 * to options (generated from commander) as well as global options such as
 * sepChar.
 * @param {*} options - commander options
 * @private
 */
function loadConfig(options) {

  // Migrate old config file extension
  try {
    if (fs.existsSync(filePath)) {
      fs.renameSync(filePath, filePath5);
      console.log(`${ANSI.green}NOTE: renamed config-file from '.config.json' to '.config.json5'.${ANSI.reset}`);
    }
  }
  catch(err) {
    console.log(`${ANSI.red}Unable to rename ".config.json" to ".config.json5".${ANSI.reset}\n${err}`)
  }

  // Apply settings (if any)
  try {
    let cfg = require(filePath5);
    let cfgOptions = Object.assign({}, cfg.options);
    let fmt = Object.assign({}, cfg.formatter);

    if ( isBool(cfgOptions.fuzzy) ) options.fuzzy = cfgOptions.fuzzy;
    if ( isBool(cfgOptions.colors) ) options.colors = cfgOptions.colors;
    if ( isBool(cfgOptions.notes) ) options.notes = cfgOptions.notes;
    if ( isBool(cfgOptions.noteEnd) ) options.noteEnd = cfgOptions.noteEnd;
    if ( isBool(cfgOptions.shorthand) ) options.shorthand = cfgOptions.shorthand;
    if ( isBool(cfgOptions.split) ) options.split = cfgOptions.split;
    if ( isBool(cfgOptions.caseSensitive) ) options.caseSensitive = cfgOptions.caseSensitive;
    if ( isBool(cfgOptions.desktop) ) options.desktop = cfgOptions.desktop;
    if ( isBool(cfgOptions.mobile) ) options.mobile = cfgOptions.mobile;
    if ( isBool(cfgOptions.overwrite) ) options.overwrite = cfgOptions.overwrite;
    if ( isBool(cfgOptions.markdown) ) options.markdown = cfgOptions.markdown;
    if ( isNum(cfgOptions.maxChars) ) options.maxChars = Math.max(0, cfgOptions.maxChars | 0);
    if ( isBool(cfgOptions.doc) ) options.doc = cfgOptions.doc;
    if ( isBool(cfgOptions.docforce) ) options.docforce = cfgOptions.docforce;
    if ( isBool(cfgOptions.ext) ) options.ext = cfgOptions.ext;
    if ( isBool(cfgOptions.desc) ) options.desc = cfgOptions.desc;
    if ( isBool(cfgOptions.specs) ) options.specs = cfgOptions.specs;
    if ( isBool(cfgOptions.waitkey) ) options.waitkey = cfgOptions.waitkey;
    if ( isBool(cfgOptions.workers) ) options.workers = cfgOptions.workers;
    if ( isBool(cfgOptions.sab) ) options.sab = cfgOptions.sab;

    if ( fmt.long && fmt.long.sepChar && typeof fmt.long.sepChar === "string" && fmt.long.sepChar.length === 1 && isValid(fmt.long.sepChar) ) {
      global.sepChar = fmt.long.sepChar;
    }
  }
  catch(err) {/* No config was found/loadable; we'll ignore */
  }

  function isValid(c) {
    return " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_|+*{}[];:!\"#&/()=?\\.,".includes(c);
  }

  function isBool(v) {
    return typeof v === "boolean";
  }

  function isNum(v) {
    return typeof v === "number";
  }
}

module.exports = loadConfig;
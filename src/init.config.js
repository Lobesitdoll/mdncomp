/*
  Config file module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const path = require("path");
const filePath = path.resolve(global.loadModule("core.io").getConfigDataPath(), ".config.json");

/**
 * The method tries to load a config file from the user area in the folder
 * .mdncomp/*. If found settings are checked against a whitelist and applied
 * to options (generated from commander) as well as global options such as
 * sepChar.
 * @param {*} options - commander options
 * @private
 */
function loadConfig(options) {

  // Apply settings (if any)
  try {
    const cfg = require(filePath);
    const cfgOptions = Object.assign({}, cfg.options);

    const nop = (v) => v;
    const mx = (v) => Math.max(0, v | 0);
    const isBool = (v) => typeof v === "boolean";
    const isNum = (v) => typeof v === "number";

    const keys = [
      "desktop", "mobile", "ext", "children", "caseSensitive", "fuzzy", "shorthand", "notes", "flags",
      "history", "desc", "specs", "workers", "sab", "obsoletes", "colors", "maxChars"
    ];

    const types = [
      isBool, isBool, isBool, isBool, isBool, isBool, isBool, isBool, isBool,
      isBool, isBool, isBool, isBool, isBool, isBool, isBool, isNum
    ];

    const validate = [
      nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, mx
    ];

    let fmt = Object.assign({}, cfg.formatter);

    // todo build object based on default values for booleans. To be used as NOT object for config file.
    // options[]->defaultValue, bool?

    // apply valid settings from config file
    keys.forEach((key, i) => {
      if ( types[ i ](cfgOptions[ key ]) ) options[ key ] = validate[ i ](cfgOptions[ key ]);
    });

    // sepChar
    if ( fmt.long && typeof fmt.long.sepChar === "string" ) {
      global.sepChar = fmt.long.sepChar;
    }

  }
  catch(err) {
    /* No config was found/loadable; we'll ignore */
    if ( DEBUG ) console.error(err);
  }
}

module.exports = loadConfig;
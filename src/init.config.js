/*
  Config file module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

require("json5/lib/register");

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
      log(`?g${text.renamedConfig}?R`);
    }
  }
  catch(err) {
    err(`?y${errText.unableCfgRename}?R\n${err}`)
  }

  // Apply settings (if any)
  try {
    const cfg = require(filePath5);
    const cfgOptions = Object.assign({}, cfg.options);

    const nop = (v) => v;
    const mx = (v) => Math.max(0, v | 0);
    const isValid = (c) => " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_|+*{}[];:!\"#&/()=?\\.,".includes(c);
    const isBool = (v) => typeof v === "boolean";
    const isNum = (v) => typeof v === "number";

    const keys = [
      "desktop", "mobile", "ext", "children", "caseSensitive", "fuzzy", "shorthand", "notes", "flags",
      "history", "desc", "specs", "workers", "sab", "obsoletes", "colors", "maxChars"
    ];

    const types = [
      isBool, isBool, isBool, isBool, isBool, isBool, isBool, isBool, isBool,
      isBool, isBool, isBool, isBool, isBool, isBool, isBool, isNum,
    ];

    const validate = [
      nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, nop, mx
    ];

    let fmt = Object.assign({}, cfg.formatter);

    // apply valid settings from config file
    keys.forEach((key, i) => {
      if (types[i](cfgOptions[key])) options[key] = validate[i](cfgOptions[key])
    });

    // validate sepChar
    if ( fmt.long && fmt.long.sepChar && typeof fmt.long.sepChar === "string" && fmt.long.sepChar.length === 1 && isValid(fmt.long.sepChar) ) {
      global.sepChar = fmt.long.sepChar;
    }
  }
  catch(err) {/* No config was found/loadable; we'll ignore */}
}

module.exports = loadConfig;
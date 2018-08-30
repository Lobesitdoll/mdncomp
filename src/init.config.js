/*
  Config file module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const utils = loadModule("core.utils");

let configFile = null;

/**
 * The method tries to load a config file from the user area in the folder
 * .mdncomp/*. If found settings are checked against a whitelist and applied
 * to options (generated from commander) as well as global options such as
 * sepChar.
 * @param {*} options - commander options
 * @private
 */
function initConfig(options) {

  const nop = (v) => v;
  const mx = (v) => Math.max(0, v | 0);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v | 0));
  const isBool = (v) => typeof v === "boolean";
  const isNum = (v) => typeof v === "number";
  const isStr = (v) => typeof v === "string";
  const toBool = (v) => !(v === "0" || v.toLowerCase() === "false");
  const toNum = (v) => v | 0;
  const toStr = (v) => "" + v;
  const isList = () => true;
  const valList = (v) => v;
  const valLang = (v) => global.languages.includes(v.toLowerCase()) ? v.toLowerCase() : "en-us";
  const toList = (v) => v;

  const keys = (new Map())
    .set("desktop", { type: isBool, convert: toBool, validate: nop })
    .set("mobile", { type: isBool, convert: toBool, validate: nop })
    .set("ext", { type: isBool, convert: toBool, validate: nop })
    .set("children", { type: isBool, convert: toBool, validate: nop })
    .set("caseSensitive", { type: isBool, convert: toBool, validate: nop })
    .set("fuzzy", { type: isBool, convert: toBool, validate: nop })
    .set("shorthand", { type: isBool, convert: toBool, validate: nop })
    .set("notes", { type: isBool, convert: toBool, validate: nop })
    .set("flags", { type: isBool, convert: toBool, validate: nop })
    .set("history", { type: isBool, convert: toBool, validate: nop })
    .set("desc", { type: isBool, convert: toBool, validate: nop })
    .set("specs", { type: isBool, convert: toBool, validate: nop })
    .set("worker", { type: isBool, convert: toBool, validate: nop })
    .set("sab", { type: isBool, convert: toBool, validate: nop })
    .set("obsolete", { type: isBool, convert: toBool, validate: nop })
    .set("colors", { type: isBool, convert: toBool, validate: nop })
    .set("maxChars", { type: isNum, convert: toNum, validate: mx })
    .set("columns", { type: isList, convert: toList, validate: valList })
    .set("expert", { type: isNum, convert: toNum, validate: v => clamp(v, 0, 2) })
    .set("lang", { type: isStr, convert: toStr, validate: v => valLang(v) })
    .set("unicode", { type: isBool, convert: toBool, validate: nop });

  /*- Load / Init Config file if any -------------------------------------------------------------*/

  const config = Object.assign({ options: {}, formatter: { sepChar: char.sep } }, configFile);

  // apply valid settings from config file
  Object.keys(config.options).forEach(key => {
    const valid = keys.get(key);
    if ( valid ) {
      if ( valid.type(config.options[ key ]) ) options[ key ] = valid.validate(config.options[ key ]);
    }
    else {
      if ( !options.expert ) err(`?yInvalid key in config file: "?c${key}?y"?R`);
    }
  });

  // sepChar
  if ( config.formatter && typeof config.formatter.sepChar === "string" ) {
    char.sep = config.formatter.sepChar;
  }

  /*- --set option -------------------------------------------------------------------------------*/

  if ( options.set ) {
    const kv = options.set.split("=");
    const key = kv[ 0 ].trim();
    const value = (kv[ 1 ] || "").trim();
    const valid = keys.get(key);

    if ( !valid ) {
      let msg = "";
      if ( key !== "?" ) {
        msg = `\n?yInvalid key "?c${key}?y". `;
        process.exitCode = 1;
      }
      err(`${msg}\n?gValid config keys:\n\n?w${utils.breakAnsiLine([ ...keys.keys() ].sort()
        .join("?R, ?w"), options.maxChars)}?R\n`);
      process.exit();
    }

    if ( value.length ) {
      let _value = valid.convert(value);
      if ( valid.type(_value) ) {
        config.options[ key ] = valid.validate(_value);
      }
      else {
        err("Invalid type for key.");
        process.exit(1);
      }
    }
    else {
      delete config.options[ key ];
    }

    // save back config and exit
    utils.saveConfigFile(config);
    process.exit();
  }
}

module.exports = {
  initConfig,
  config : () => configFile,
  preload: () => configFile = utils.loadConfigFile(),
  locale : () => (configFile.options && configFile.options.lang) ? configFile.options.lang : "en-us"
};
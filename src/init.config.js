/*
  Config file module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const io = require("./core.io");
const path = require("path");
const file = path.resolve(io.getConfigDataPath(), ".config.json");

function loadConfig(options) {
  try {
    let cfg = require(file);
    let co = Object.assign({}, cfg.options);
    let fmt = Object.assign({}, cfg.formatter);

    if (isBool(co.fuzzy)) options.fuzzy = co.fuzzy;
    if (isBool(co.colors)) options.colors = co.colors;
    if (isBool(co.notes)) options.notes = co.notes;
    if (isBool(co.noteEnd)) options.noteEnd = co.noteEnd;
    if (isBool(co.shorthand)) options.shorthand = co.shorthand;
    if (isBool(co.split)) options.split = co.split;
    if (isBool(co.caseSensitive)) options.caseSensitive = co.caseSensitive;
    if (isBool(co.desktop)) options.desktop = co.desktop;
    if (isBool(co.mobile)) options.mobile = co.mobile;
    if (isBool(co.overwrite)) options.overwrite = co.overwrite;
    if (isBool(co.markdown)) options.markdown = co.markdown;
    if (isNum(co.maxChars)) options.maxChars = Math.max(0, co.maxChars|0);
    if (isBool(co.doc)) options.doc = co.doc;
    if (isBool(co.docforce)) options.docforce = co.docforce;
    if (isBool(co.ext)) options.ext = co.ext;
    if (isBool(co.desc)) options.desc = co.desc;
    if (isBool(co.specs)) options.specs = co.specs;
    if (isBool(co.waitkey)) options.waitkey = co.waitkey;
    if (isBool(co.workers)) options.workers = co.workers;
    if (isBool(co.sab)) options.sab = co.sab;

    if (fmt.long && fmt.long.sepChar && typeof fmt.long.sepChar === "string" && fmt.long.sepChar.length === 1 && isValid(fmt.long.sepChar)) {
      global.sepChar = fmt.long.sepChar
    }

  }
  catch(err) {}

  function isValid(c) {return " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_|+*{}[];:!\"#&/()=?\\.,".includes(c)}
  function isBool(v) {return typeof v === "boolean"}
  function isNum(v) {return typeof v === "number"}
}

module.exports = loadConfig;
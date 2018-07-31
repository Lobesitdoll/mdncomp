/*!
  Formatter Common module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const options = global.options;
const ANSI = global.ANSI;
const utils = global.loadModule("core.utils");
const outInfo = utils.outInfo;
const out = utils.outStore;

// todo - merge dt/mob options
// todo - check random option
// todo - support multiple args:

function format(path) {

  console.log("PATH: " + path);
}


module.exports = format;
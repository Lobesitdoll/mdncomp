/*!
  Help module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const log = console.log;
const args = process.argv;
const ANSI = require("./core.ansi");

function show() {
  if (args.length === 4) {
    let option = (args[2] === "-h" || args[2] === "--help") ? args[3] : args[2];
    let text = require("./help.options").help[option];

    log();
    log(`${ANSI.green}Help for option "${option}":${ANSI.reset}`);
    log(text ? text : "Unknown option.");
  }
  else {
    log();
    log("  Examples:");
    log("    mdncomp arcTo                   show information for arcTo");
    log("    mdncomp html*toblob.            will find HTMLCanvasElement.toBlob");
    log("    mdncomp -z hctbb.               will find HTMLCanvasElement.toBlob (fuzzy)");
    log("    mdncomp --list .                list all top-level paths");
    log()
  }

  process.exit()
}

module.exports = show;
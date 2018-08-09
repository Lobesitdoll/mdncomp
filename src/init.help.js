/*
  Help module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const fs = require("fs");
const Path = require("path");
const args = process.argv;

function show() {

  if (args.length >= 4) {
    let option = (args[2] === "-h" || args[2] === "--help") ? args[3] : args[2];
    let text = require("./help.options").help[option];

    log();
    log(`?gHelp for option "${option}":?R`);
    log(text ? text : "Unknown option.");
  }
  else {
    log();
    log("  Examples:");
    log("    mdncomp arcTo         show information for arcTo");
    log("    mdncomp html*toblob   will find HTMLCanvasElement.toBlob");
    log("    mdncomp -z hctbb.     will find HTMLCanvasElement.toBlob (fuzzy)");
    log("    mdncomp --list        list all top-level paths");
    log()
  }

  // Welcome message and reminder to update data
  const frPath = Path.join(__dirname, "../data/.firstrun");
  if (!fs.existsSync(frPath)) {
    log("?g" + "-".repeat(76));
    log("  ?gWELCOME! This seem to be the first run. To get the latest data file run:\n");
    log("  ?wmdncomp --update\n");
    log("  ?gHope mdncomp will be useful! This message is only shown at the first run.");
    log("-".repeat(76), "?R");
    try {
      if (!DEBUG) fs.writeFileSync(frPath, "OK", "utf-8")
    }
    catch(err) {if (DEBUG) console.error(err)}
  }

  process.exit()
}

module.exports = show;
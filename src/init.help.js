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
    let helpText = require("./help.options").help[option];

    log();
    log(`?g${text.helpForOption} "${option}":?R`);
    log(helpText ? helpText : text.helpUnknownOption);
  }
  else {
    log(`  ${text.aboutExamples}:`);
    log(`    mdncomp arcTo            ${text.example1} arcTo`);
    log(`    mdncomp html*toblob      ${text.example2} HTMLCanvasElement.toBlob`);
    log(`    mdncomp -z hctbb.        ${text.example2} HTMLCanvasElement.toBlob (fuzzy)`);
    log(`    mdncomp --list           ${text.example3}`);
    log()
  }

  // Welcome message and reminder to update data
  const frPath = Path.join(__dirname, "../data/.firstrun");

  if (!fs.existsSync(frPath)) {
    // Not localized due to being shown before user (perhaps) know about --lang
    log("?g" + "-".repeat(76));
    log("  ?gWELCOME! This seem to be the first run. To get the latest data file run:\n");
    log("  ?wmdncomp --update\n");
    log("  ?gHope mdncomp will be useful! This message is only shown at the first run.");
    log("-".repeat(76), "?R");
    try {
      if (!DEBUG) fs.writeFileSync(frPath, "OK", "utf-8")
    }
    catch(err) {console.error(err)}
  }

  process.exit()
}

module.exports = show;
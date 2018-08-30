/*
  Help module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const args = process.argv;

function show() {

  if ( args.length >= 4 ) {
    let option = (args[ 2 ] === "-h" || args[ 2 ] === "--help") ? args[ 3 ] : args[ 2 ];
    let helpText = require("./help.options").help[ option ];

    log();
    log(`?g${text.helpForOption} "${option}":?R`);
    log(helpText ? helpText : text.helpUnknownOption);
  }
  else {
    log(`  ?w${text.aboutExamples}:?R`);
    log(`    ?ymdncomp arcTo            ?R${text.example1} arcTo`);
    log(`    ?ymdncomp html*toblob      ?R${text.example2} HTMLCanvasElement.toBlob`);
    log(`    ?ymdncomp -z hctbb.        ?R${text.example2} HTMLCanvasElement.toBlob (fuzzy)`);
    log(`    ?ymdncomp --list           ?R${text.example3}`);
    log();
  }

  process.exit();
}

module.exports = show;
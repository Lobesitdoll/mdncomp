/*
  Locales and languages module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

let lang = loadModule("init.config").locale();

// Parse options manually since we want locale for --help output as well
const args = process.argv;
const i = args.indexOf("--lang");

if (i > -1) {
  if (args.length > i + 1) {
    lang = args[i + 1].toLowerCase();
    args.splice(i, 2);
  }
}

// Show help for supported languages
if (lang === "?") {
  log("?g\nSupported languages: ?c" + global.languages.join(", ") + "\n?R");
  process.exit()
}

// Load language file or default to English
if ( global.languages.includes(lang) ) {
  let loaded = loadLang(lang);
  if ( !loaded ) {
    loaded = loadLang(lang.split(/[-_]/)[ 0 ]);
  }
  if ( !loaded ) {
    global.err(`\n?yCould not load language: ?c${lang}?R`);
    loadLang("en");
  }
}
else {
  global.err(`\n?yUnsupported language: ?c${lang}?R`);
  loadLang("en");
}

function loadLang(lang) {
  try {
    const langFile = require(`../locale/${lang}.json`);
    Object.assign(global.text, langFile.texts);
    Object.assign(global.char, langFile.chars);
    return true
  }
  catch(_err) {
    //if (DEBUG) err(_err);
  }
}

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

if ( global.languages.includes(lang) ) {
  let loaded = loadLang(lang);
  if ( !loaded ) {
    loaded = loadLang(lang.split(/[-_]/)[ 0 ]);
  }
  if ( !loaded ) {
    global.err(lf + "?y" + text.couldNotLoadLanguage + ": ?c" + lang + "?R");
    loadLang("en");
  }
}
else {
  global.err(lf + "?y" + text.unsupportedLanguage + ": ?c" + lang + "?R");
  loadLang("en");
}

function loadLang(lang) {
  try {
    const langFile = require(`../locale/${lang}.json`);
    Object.assign(global.text, langFile.texts);
    Object.assign(global.char, langFile.chars);
    return true
  }
  catch(err) {
    //if (DEBUG) console.log(err);
  }
}

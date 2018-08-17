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
  }
}

if ( global.languages.includes(lang) ) {
  let langFile = loadLang(lang);
  if ( !langFile ) {
    langFile = loadLang(lang.split("-")[ 0 ]);
  }

  if ( langFile ) {
    Object.assign(global.text, langFile.texts);
    Object.assign(global.char, langFile.chars);
  }
  else {
    global.err(lf + "?y" + text.couldNotLoadLanguage + ": ?c" + options.lang + "?R");
  }
}
else {
  global.err(lf + "?y" + text.unsupportedLanguage + ": ?c" + options.lang + "?R");
}

function loadLang(lang) {
  try {
    return require(`../locale/${lang}.json`)
  }
  catch(err) {
    //if (DEBUG) console.log(err);
    return null
  }
}

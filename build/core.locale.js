"use strict";let lang=loadModule("init.config").locale();const args=process.argv,i=args.indexOf("--lang");if(i>-1&&args.length>i+1&&(lang=args[i+1].toLowerCase(),args.splice(i,2)),global.languages.includes(lang)){let a=loadLang(lang);a||(a=loadLang(lang.split("-")[0])),a?(Object.assign(global.text,a.texts),Object.assign(global.char,a.chars)):global.err(lf+"?y"+text.couldNotLoadLanguage+": ?c"+options.lang+"?R")}else global.err(lf+"?y"+text.unsupportedLanguage+": ?c"+options.lang+"?R");function loadLang(a){try{return require(`../locale/${a}.json`)}catch(a){return null}}
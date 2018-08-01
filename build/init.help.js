/*!
  Help module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/
"use strict";const log=console.log,args=process.argv,ANSI=global.ANSI;function show(){if(args.length>=4){let o="-h"===args[2]||"--help"===args[2]?args[3]:args[2],l=require("./help.options").help[o];log(),log(`${ANSI.green}Help for option "${o}":${ANSI.reset}`),log(l||"Unknown option.")}else log(),log("  Examples:"),log("    mdncomp arcTo                   show information for arcTo"),log("    mdncomp html*toblob.            will find HTMLCanvasElement.toBlob"),log("    mdncomp -z hctbb.               will find HTMLCanvasElement.toBlob (fuzzy)"),log("    mdncomp --list .                list all top-level paths"),log();process.exit()}module.exports=show;
"use strict";const args=process.argv;function show(){if(args.length>=4){let e="-h"===args[2]||"--help"===args[2]?args[3]:args[2],o=require("./help.options").help[e];log(),log(`?g${text.helpForOption} "${e}":?R`),log(o||text.helpUnknownOption)}else log(`  ?w${text.aboutExamples}:?R`),log(`    ?ymdncomp arcTo            ?R${text.example1} arcTo`),log(`    ?ymdncomp html*toblob      ?R${text.example2} HTMLCanvasElement.toBlob`),log(`    ?ymdncomp -z hctbb.        ?R${text.example2} HTMLCanvasElement.toBlob (fuzzy)`),log(`    ?ymdncomp --list           ?R${text.example3}`),log();process.exit()}module.exports=show;
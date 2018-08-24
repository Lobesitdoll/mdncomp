#!/usr/bin/env node
/*! mdncomp (c) epistemex */
const DEBUG="src"===__dirname.substring(__dirname.length-3);DEBUG&&console.log("DEBUG MODE");const lf="\r\n",text={versionWarning:"WARNING: mdncomp is built for Node version 8.3 or newer. It may not work in older Node.js versions.",criticalDataFile:"Critical error: data file not found.\n?yTry running with option --fupdate to download latest snapshot.",missingModule:"Critical: A core module seem to be missing. Use 'npm i -g mdncomp' to reinstall.",unhandled:"--- An unhandled error occurred! ---\n\nConsider reporting to help us solve it via GitLab if it persists:\nhttps://gitlab.com/epistemex/mdncomp/issues\n\nAlternatively:\nTry update/reinstall 'npm i -g mdncomp' (or --fupdate for just data).\n\n"},nv=process.versions.node.split(".").map(o=>0|o);(nv[0]<8||8===nv[0]&&nv[1]<3)&&console.log(text.versionWarning);const _errHandler=o=>{console.log(text.unhandled,o),process.exitCode=1};process.on("error",_errHandler),process.on("uncaughtException",_errHandler);const _base=`../${DEBUG?"src":"build"}/`,utils=loadModule("core.utils");Object.assign(global,{lf:lf,DEBUG:DEBUG,_base:_base,text:text,loadModule:loadModule,char:{sep:"|",progressBar:"#",yes:"Y",no:"-",unknown:"?",feature:"F",parent:"P",branch:"B",flags:"F",notes:"*",nonStd:"?",experimental:"!",deprecated:"x"},lang:"en-us",languages:["en","en-us","es","no"],ANSI:loadModule("core.ansi"),log:utils.log,err:utils.err,options:{}}),loadModule("init.config").preload(),loadModule("core.locale");const options=global.options=loadModule("init.options");if(options.colors||Object.keys(global.ANSI).forEach(o=>{o.includes("ursor")||(ANSI[o]="")}),options.update)loadModule("core.update")(!1);else if(options.fupdate)loadModule("core.update")(!0);else if(options.configpath)log(`\n?w${loadModule("core.io").getConfigDataPath()}?R\n`);else if(options.browser)loadModule("option.browser")(options.browser);else if(options.list)loadModule("option.list")(options.list);else if(options.args.length)loadModule("option.search").search();else if(options.random){const o=loadModule("option.random")(options.random);o.length?loadModule("option.search").results(o):err(`?y\n${text.tooLimitedScope}?R\n`)}else options.help();function loadModule(o){let e;try{e=require(_base+o)}catch(e){console.error(text.missingModule),console.error(o),DEBUG&&console.error("\nERROR OBJECT:\n",e),process.exit()}return e}
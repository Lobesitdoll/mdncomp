"use strict";const options=loadModule("core.commander"),version=require("../package.json").version,args=process.argv;module.exports=(()=>{if(args.length>=4)for(let t of args)"-h"!==t&&"--help"!==t||o();function o(){loadModule("init.help")()}if(3===args.length&&"?"===args[2]&&(args[2]="-h"),options.version(version,"-v, --version").usage(`[${text.aboutOptions}] [*]`).description(`${text.aboutBCD}.${lf}  ${text.aboutVersion}: ${version+lf}  (c) 2018 epistemex.com`).option("-l, --list [api]",text.optionsList).option("-b, --browser [id]",text.optionsBrowser).option("-i, --index <index>",text.optionsIndex,-1).option("-D, --no-desktop",text.optionsNoDesktop).option("-M, --no-mobile",text.optionsNoMobile).option("-x, --ext",text.optionsExt).option("-R, --no-children",text.optionsNoChildren).option("-c, --case-sensitive",text.optionsCaseSens).option("-z, --fuzzy",text.optionsFuzzy).option("-d, --deep",text.optionsDeep).option("-s, --shorthand",text.optionsShorthand).option("--desc",text.optionsDesc).option("--specs",text.optionsSpecs).option("--sub <index>",text.optionsSub).option("-N, --no-notes",text.optionsNoNotes).option("-F, --no-flags",text.optionsNoFlags).option("-y, --history",text.optionsHistory).option("-O, --no-obsolete",text.optionsNoObsolete).option("-u, --columns <columns>",text.optionsColumns).option("--random [scope]",text.optionsRandom).option("--no-colors",text.optionsNoColors).option("--max-chars <width>",text.optionsMaxChars,84).option("-G, --no-config",text.optionsNoConfig).option("--set <kv>",text.optionsSet).option("--configpath",text.optionsConfigPath).option("--expert [level]",text.optionsExpert,0).option("--lang <isocode>",text.optionsLang,"en-us").option("--update",text.optionsUpdate).option("--fupdate",text.optionsForceUpdate).on("--help",o).parse(args),loadModule("init.config").initConfig(options),options.index<0)for(let o,t=0;o=options.args[t];t++)if(!isNaN(o)){options.args.splice(t,1),options.index=+o;break}return options})();
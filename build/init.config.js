"use strict";const utils=loadModule("core.utils");let configFile=null;function initConfig(e){const t=e=>e,o=e=>"boolean"==typeof e,i=e=>"number"==typeof e,s=e=>!("0"===e||"false"===e.toLowerCase()),a=e=>0|e,n=(new Map).set("desktop",{type:o,convert:s,validate:t}).set("mobile",{type:o,convert:s,validate:t}).set("ext",{type:o,convert:s,validate:t}).set("children",{type:o,convert:s,validate:t}).set("caseSensitive",{type:o,convert:s,validate:t}).set("fuzzy",{type:o,convert:s,validate:t}).set("shorthand",{type:o,convert:s,validate:t}).set("notes",{type:o,convert:s,validate:t}).set("flags",{type:o,convert:s,validate:t}).set("history",{type:o,convert:s,validate:t}).set("desc",{type:o,convert:s,validate:t}).set("specs",{type:o,convert:s,validate:t}).set("obsolete",{type:o,convert:s,validate:t}).set("colors",{type:o,convert:s,validate:t}).set("maxChars",{type:i,convert:a,validate:e=>Math.max(0,0|e)}).set("columns",{type:()=>!0,convert:e=>e,validate:e=>e}).set("expert",{type:i,convert:a,validate:e=>((e,t,o)=>Math.max(t,Math.min(o,0|e)))(e,0,2)}).set("lang",{type:e=>"string"==typeof e,convert:e=>""+e,validate:e=>(e=>global.languages.includes(e.toLowerCase())?e.toLowerCase():"en-us")(e)}).set("json",{type:o,convert:s,validate:t}).set("nofooter",{type:o,convert:s,validate:t}).set("unicode",{type:o,convert:s,validate:t}),l=Object.assign({options:{},formatter:{sepChar:char.sep}},configFile);if(Object.keys(l.options).forEach(t=>{const o=n.get(t);o?o.type(l.options[t])&&(e[t]=o.validate(l.options[t])):e.expert||err(`?yInvalid key in config file: "?c${t}?y"?R`)}),l.formatter&&"string"==typeof l.formatter.sepChar&&(char.sep=l.formatter.sepChar),e.set){const t=e.set.split("="),o=t[0].trim(),i=(t[1]||"").trim(),s=n.get(o);if(!s){let t="";"?"!==o&&(t=`\n?yInvalid key "?c${o}?y". `,process.exitCode=1),err(`${t}\n?gValid config keys:\n\n?w${utils.breakAnsiLine([...n.keys()].sort().join("?R, ?w"),e.maxChars)}?R\n`),process.exit()}if(i.length){let e=s.convert(i);s.type(e)?l.options[o]=s.validate(e):(err("Invalid type for key."),process.exit(1))}else delete l.options[o];utils.saveConfigFile(l),process.exit()}}module.exports={initConfig:initConfig,config:()=>configFile,preload:()=>configFile=utils.loadConfigFile(),locale:()=>configFile.options&&configFile.options.lang?configFile.options.lang:"en-us"};
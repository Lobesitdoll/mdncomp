const utils=loadModule("core.utils"),mdn=utils.loadMDN();function getRandom(t){let o,e=utils.buildTable(mdn),n=!1;if("string"==typeof t&&t.length){let o=utils.getComparer(t,options.fuzzy,options.caseSensitive);e=e.filter(t=>o.test(t))}if(!e.length)return"";for(;!n;)if(o=Math.random()*e.length|0,(n=utils.isCompat(mdn,e[o]))&&(options.doc||options.docforce||options.desc)){let t=utils.getPathAsObject(mdn,e[o]).__compat;t.mdn_url&&t.mdn_url.length||(n=!1)}return e[o]}module.exports=getRandom;
const utils=loadModule("core.utils"),mdn=utils.loadMDN();function getRandom(t){let e,n=utils.bcdToList(mdn),o=!1;if("string"==typeof t&&t.length){let e=utils.getComparer(t,options.fuzzy,options.caseSensitive);n=n.filter(t=>e.test(t))}if(!n.length)return"";for(;!o;)if(e=Math.random()*n.length|0,(o=utils.isCompat(mdn,n[e]))&&options.desc){let t=utils.getPathAsObject(mdn,n[e]).__compat;t.mdn_url&&t.mdn_url.length||(o=!1)}return n[e]}module.exports=getRandom;
"use strict";const colorCodes="rgyobmpcwGR",utils={bcdToList:e=>{const r=[];return utils.getRootList(e).forEach(t=>(function e(t,o,n){const i=t[o];"object"==typeof i&&Object.keys(i).filter(e=>"__compat"!==e&&"worker_support"!==e&&"SharedArrayBuffer_as_param"!==e).forEach(t=>{r.push(n+"."+t),e(i,t,n+"."+t)})})(e,t,t)),r},getRootList:e=>Object.keys(e).filter(e=>"browsers"!==e&&"__mdncomp"!==e),getComparer:(e,r,t)=>{let o,n,i="",s="";e.startsWith("/")?(e=(n=e.split("/"))[1],i=n[2]||""):r?e=function(e){const r=[];let t="";e.endsWith(".")&&(t="$",e=e.substr(0,e.length-1));for(let t of e)r.push("\\^$.*+?()[]{}|".includes(t)?"\\"+t:t);return r.join(".*?")+t}(t?e.toLowerCase():e):(e.endsWith(".")&&(e=e.substr(0,e.length-1),s="$"),e.endsWith("*")||s.length||(e+="*"),e=e.split("*").join(".*")+s),t&&!i.includes("i")&&(i+="i");try{o=new RegExp(e,i)}catch(e){utils.err(text.invalidRegex),process.exit(1)}return o},getPathAsObject:(e,r)=>{let t=e;return r&&r.split(".").forEach(e=>{t&&t[e]&&(t=t[e])}),t},nameFromPath:e=>{let r=utils.getExt(e);return r.length?r:e},getExt:e=>{let r=e.lastIndexOf(".")+1;return r?e.substr(r):""},prePathFromPath:(e,r)=>{const t=r.split(".");let o=e,n=[];return t.pop(),t.forEach(e=>{if(o=(o||{})[e]){let r=o.__compat?"?c":utils.hasChildren(o)?"?g":"?y";n.push(r+e)}}),n.join("?R.")+"?R."},isCompat:(e,r)=>{let t=utils.getPathAsObject(e,r);return t&&"object"==typeof t.__compat},hasChildren:e=>{const r=Object.keys(e);for(let t of r)if(e[t].__compat)return!0;return!1},getBrowserList:()=>({desktop:["chrome","edge","firefox","ie","opera","safari"],mobile:["chrome_android","edge_mobile","firefox_android","opera_android","safari_ios","webview_android"],ext:["nodejs","qq_android","samsunginternet_android","thunderbird","uc_android","uc_chinese_android"]}),getBrowserNames:()=>({chrome:{short:"C",long:"Chrome"},edge:{short:"E",long:"Edge"},firefox:{short:"F",long:"Firefox"},ie:{short:"IE",long:"IE"},opera:{short:"O",long:"Opera"},safari:{short:"S",long:"Safari"},chrome_android:{short:"C/a",long:"Chrome/A"},edge_mobile:{short:"E/m",long:"Edge/mob"},firefox_android:{short:"F/a",long:"Firefox/A"},opera_android:{short:"O/a",long:"Opera/A"},safari_ios:{short:"S/i",long:"Safari/iOS"},webview_android:{short:"W/a",long:"Webview/A"},nodejs:{short:"ND",long:"Node JS"},qq_android:{short:"QQ",long:"QQ/A"},samsunginternet_android:{short:"SM",long:"Samsung/A"},thunderbird:{short:"TB",long:"Thunderbrd"},uc_android:{short:"UC",long:"UC/A"},uc_chinese_android:{short:"UCC",long:"UC-Ch/A"}}),cleanHTML:(e,r,t,o,n)=>(o=o||ANSI.cyan,t=t||ANSI.reset,n=n||o,e=e.replace(/<code>/gi,o).replace(/<\/code>/gi,t).replace(/<a href/gi,n+"<a href").replace(/<\/a>/gi,"</a>"+t).replace(/(<([^>]+)>)/gi,""),r&&(e=e.replace(/&lt;/gi,"<").replace(/&gt;/gi,">")),e),breakAnsiLine:(e,r,t=!1)=>{const o=t?r:Math.max(72,r>>>0);let n,i=[],s=0,a=0,l=-1,c=!1,d=!1,g=0;for(;n=e[g];)c&&d&&!colorCodes.includes(n)&&(c=!1),c?("m"===n||d)&&(c=!1):""===n||"?"===n?(c=!0,d="?"===n):(" "!==n&&"\n"!==n&&"/"!==n&&"."!==n||(l=g),++s!==o&&"\n"!==n||(l<0&&(l=g),i.push(e.substring(a,l)),a=l,l=-1,s=g-a)),g++;return s&&i.push(e.substr(a)),(i=i.map(e=>e.trim())).length?i.join(lf):""},ansiLength:e=>utils.ansiFree(e).length,ansiFree:e=>{const r=new RegExp("[^m]*m|\\?[rgyobmpcwGR]","g");return e.replace(r,"")},parseColorCodes:e=>{const r={r:ANSI.red,g:ANSI.green,y:ANSI.yellow,o:ANSI.orange,b:ANSI.blue,m:ANSI.magenta,p:ANSI.purple,c:ANSI.cyan,w:ANSI.white,G:ANSI.gray,R:ANSI.reset};let t="",o=0,n=0;do{if((o=e.indexOf("?",o))>=0){t+=e.substring(n,o);let i=r[e[o+1]];"string"==typeof i?(t+=i,o++):t+=e[o],n=++o}else t+=e.substr(n)}while(o>=0);return t},entities:e=>{const r={"&nbsp;":" ","&quot;":'"',"&amp;":"&","&lt;":"<","&gt;":">"},t=new RegExp(Object.keys(r).join("|"),"gi");return e.replace(t,e=>r[e])},versionAddRem:(e,r,t=!1,o=!1)=>{let n="";return null===e&&null===r?n="?G"+char.unknown:null===e||void 0===e?n="?r"+char.no:"boolean"==typeof e?n=e?(t?"?y":"?g")+char.yes:"?r"+char.no:"string"==typeof e&&(n=(r?"?r":t?"?y":"?g")+e,r&&(n+="?R-?r"+("boolean"==typeof r?char.unknown:r),o&&"boolean"!=typeof r&&(n="["+n+">"))),n},testFilters:(e,r)=>{for(let t of e)if(t.test(r))return!0;return!1},loadMDN:function(){let e;try{e=require("../data/data.json")}catch(e){utils.err(`?r${text.criticalDataFile}?R`),process.exit(1)}return e},loadConfigFile:()=>{const e=loadModule("core.io").getConfigFilePath();try{return require(e)}catch(e){return{}}},saveConfigFile:e=>{const r=loadModule("core.io").getConfigFilePath();try{require("fs").writeFileSync(r,JSON.stringify(e),"utf-8")}catch(e){err(`?rCould not write config file.${DEBUG?lf+e:""}?R`),process.exitCode=1}},log:function(...e){1===e.length&&Array.isArray(e[0])&&(e[0]=e[0].join(lf)),console.log(utils.parseColorCodes(e.join(" ")))},err:function(...e){console.error(utils.parseColorCodes(e.join(" ")))}};module.exports=utils;
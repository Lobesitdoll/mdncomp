"use strict";const colorCodes="rgyobmpcwGR",utils={bcdToList:e=>{const r=[];return utils.getRootList(e).forEach(o=>(function e(o,t,n){const i=o[t];"object"==typeof i&&Object.keys(i).filter(e=>"__compat"!==e&&"worker_support"!==e&&"SharedArrayBuffer_as_param"!==e).forEach(o=>{r.push(n+"."+o),e(i,o,n+"."+o)})})(e,o,o)),r},getRootList:e=>Object.keys(e).filter(e=>"browsers"!==e&&"__mdncomp"!==e),getComparer:(e,r,o)=>{let t,n,i="",s="";e.startsWith("/")?(e=(n=e.split("/"))[1],i=n[2]||""):r?e=function(e){const r=[];let o="";e.endsWith(".")&&(o="$",e=e.substr(0,e.length-1));for(let o of e)r.push("\\^$.*+?()[]{}|".includes(o)?"\\"+o:o);return r.join(".*?")+o}(o?e.toLowerCase():e):(e.endsWith(".")&&(e=e.substr(0,e.length-1),s="$"),e.endsWith("*")||s.length||(e+="*"),e=e.split("*").join(".*")+s),o&&!i.includes("i")&&(i+="i");try{t=new RegExp(e,i)}catch(e){utils.err(text.invalidRegex),process.exit(1)}return t},getPathAsObject:(e,r)=>{let o=e;return r.split(".").forEach(e=>{o&&o[e]&&(o=o[e])}),o},nameFromPath:e=>{let r=utils.getExt(e);return r.length?r:e},getExt:e=>{let r=e.lastIndexOf(".")+1;return r?e.substr(r):""},prePathFromPath:(e,r)=>{const o=r.split(".");let t=e,n=[];return o.pop(),o.forEach(e=>{if(t=(t||{})[e]){let r=t.__compat?"?c":utils.hasChildren(t)?"?g":"?y";n.push(r+e)}}),n.join("?R.")+"?R."},isCompat:(e,r)=>{let o=utils.getPathAsObject(e,r);return o&&"object"==typeof o.__compat},hasChildren:e=>{const r=Object.keys(e);for(let o of r)if(e[o].__compat)return!0;return!1},getBrowserList:()=>({desktop:["chrome","edge","firefox","ie","opera","safari"],mobile:["chrome_android","edge_mobile","firefox_android","opera_android","safari_ios","webview_android"],ext:["nodejs","qq_android","samsunginternet_android","uc_android","uc_chinese_android"]}),getBrowserNames:()=>({chrome:{short:"C",long:"Chrome"},edge:{short:"E",long:"Edge"},firefox:{short:"F",long:"Firefox"},ie:{short:"IE",long:"IE"},opera:{short:"O",long:"Opera"},safari:{short:"S",long:"Safari"},chrome_android:{short:"C/a",long:"Chrome/A"},edge_mobile:{short:"E/m",long:"Edge/mob"},firefox_android:{short:"F/a",long:"Firefox/A"},opera_android:{short:"O/a",long:"Opera/A"},safari_ios:{short:"S/i",long:"Safari/iOS"},webview_android:{short:"W/a",long:"Webview/A"},nodejs:{short:"ND",long:"Node JS"},qq_android:{short:"QQ",long:"QQ/A"},samsunginternet_android:{short:"SM",long:"Samsung/A"},uc_android:{short:"UC",long:"UC/A"},uc_chinese_android:{short:"UCC",long:"UC-Ch/A"}}),cleanHTML:(e,r,o,t,n)=>(t=t||ANSI.cyan,o=o||ANSI.reset,n=n||t,e=e.replace(/<code>/gi,t).replace(/<\/code>/gi,o).replace(/<a href/gi,n+"<a href").replace(/<\/a>/gi,"</a>"+o).replace(/(<([^>]+)>)/gi,""),r&&(e=e.replace(/&lt;/gi,"<").replace(/&gt;/gi,">")),e),breakAnsiLine:(e,r,o=!1)=>{const t=o?r:Math.max(72,r>>>0);let n,i=[],s=0,a=0,l=-1,c=!1,g=!1,d=0;for(;n=e[d];)c&&g&&!colorCodes.includes(n)&&(c=!1),c?("m"===n||g)&&(c=!1):""===n||"?"===n?(c=!0,g="?"===n):(" "!==n&&"\n"!==n&&"/"!==n&&"."!==n||(l=d),++s!==t&&"\n"!==n||(l<0&&(l=d),i.push(e.substring(a,l)),a=l,l=-1,s=d-a)),d++;return s&&i.push(e.substr(a)),(i=i.map(e=>e.trim())).length?i.join(lf):""},ansiLength:e=>utils.ansiFree(e).length,ansiFree:e=>{const r=new RegExp("[^m]*m|\\?[rgyobmpcwGR]","g");return e.replace(r,"")},parseColorCodes:e=>{const r={r:ANSI.red,g:ANSI.green,y:ANSI.yellow,o:ANSI.orange,b:ANSI.blue,m:ANSI.magenta,p:ANSI.purple,c:ANSI.cyan,w:ANSI.white,G:ANSI.gray,R:ANSI.reset};let o="",t=0,n=0;do{if((t=e.indexOf("?",t))>=0){o+=e.substring(n,t);let i=r[e[t+1]];"string"==typeof i?(o+=i,t++):o+=e[t],n=++t}else o+=e.substr(n)}while(t>=0);return o},entities:e=>{const r={"&nbsp;":" ","&quot;":'"',"&amp;":"&","&lt;":"<","&gt;":">"},o=new RegExp(Object.keys(r).join("|"),"gi");return e.replace(o,e=>r[e])},versionAddRem:(e,r,o=!1,t=!1)=>{let n="";return null===e&&null===r?n="?G"+char.unknown:null===e||void 0===e?n="?r"+char.no:"boolean"==typeof e?n=e?(o?"?y":"?g")+char.yes:"?r"+char.no:"string"==typeof e&&(n=(r?"?r":o?"?y":"?g")+e,r&&(n+="?R-?r"+("boolean"==typeof r?char.unknown:r),t&&"boolean"!=typeof r&&(n="["+n+">"))),n},testFilters:(e,r)=>{for(let o of e)if(o.test(r))return!0;return!1},loadMDN:function(){let e;try{e=require("../data/data.json")}catch(e){utils.err(`?r${text.criticalDataFile}?R`),process.exit(1)}return e},loadConfigFile:()=>{const e=loadModule("core.io").getConfigFilePath();try{return require(e)}catch(e){return{}}},saveConfigFile:e=>{const r=loadModule("core.io").getConfigFilePath();try{require("fs").writeFileSync(r,JSON.stringify(e),"utf-8")}catch(e){err(`?rCould not write config file.${DEBUG?lf+e:""}?R`),process.exitCode=1}},log:function(...e){1===e.length&&Array.isArray(e[0])&&(e[0]=e[0].join(lf)),console.log(utils.parseColorCodes(e.join(" ")))},err:function(...e){console.error(utils.parseColorCodes(e.join(" ")))}};module.exports=utils;
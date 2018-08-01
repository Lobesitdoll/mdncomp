/*!
  Formatter Common module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/
"use strict";const options=global.options,ANSI=global.ANSI,utils=global.loadModule("core.utils"),mdn=utils.loadMDN(),errText=global.errText;function format(e,t){utils.isCompat(mdn,e)||(console.log(`Error: path "${e}" not a "__compat" object.`),process.exit());const o=/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/,r=utils.getBrowserList(),s=utils.getPathAsObject(mdn,e),n=s.__compat,a=n.support,l=n.status,i=n.mdn_url&&n.mdn_url.length?("https://developer.mozilla.org/docs/"+n.mdn_url).replace(".org/docs/Mozilla/Add-ons/",".org/Add-ons/"):null,p=options.specs&&n.specs||[],d={path:e,prePath:utils.prePathFromPath(mdn,e),name:utils.nameFromPath(e),description:n.description||"",short:(n.short||"").replace("→","-&gt;"),url:i,specs:p,experimental:l.experimental,standard:l.standard_track,deprecated:l.deprecated,browsers:{desktop:[],mobile:[],ext:[]},notes:[],links:[],children:[],sab:s.SharedArrayBuffer_as_param&&!t?format(e+".SharedArrayBuffer_as_param",!0):null,workers:s.worker_support&&!t?format(e+".worker_support",!0):null};function u(e,t){const r=[],s=[];return t=t[e]||{},(Array.isArray(t)?t:[t]).forEach(e=>{const t=[];if(options.notes&&e.notes){(Array.isArray(e.notes)?e.notes:[e.notes]).forEach(e=>{let r=function(e){for(let t=0;t<d.notes.length;t++)if(d.notes[t].note===e)return d.notes[t].index;return-1}(e);if(r<0){r=d.notes.length,d.notes.push({index:r,note:e});let t=e.match(o);t&&d.links.push({index:r,url:t[t.length-1]})}s.push(r),t.push(r)})}(options.history||!options.history&&!r.length)&&r.push({add:e.version_added,removed:e.version_removed,prefix:e.prefix||null,altName:e.alternative_name||null,flags:e.flags||[],partial:e.partial_implementation||!1,notes:t})}),{[e]:r,noteIndex:s}}return r.desktop.forEach(e=>{d.browsers.desktop.push(u(e,a))}),r.mobile.forEach(e=>{d.browsers.mobile.push(u(e,a))}),r.ext.forEach(e=>{d.browsers.ext.push(u(e,a))}),options.children&&!t&&(options.history=!1,options.notes=!1,Object.keys(s).forEach(t=>{s[t].__compat&&d.children.push(format(e+"."+t,!0))})),d}module.exports=format;
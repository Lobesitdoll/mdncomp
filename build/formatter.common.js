"use strict";const utils=loadModule("core.utils"),mdn=utils.loadMDN();function format(e,t=!1,s,o){const n=utils.getPathAsObject(mdn,e);if(!n.__compat&&!utils.hasChildren(n))return err(utils.breakAnsiLine(`?y${text.notFeatureObject}?R`,options.maxChars)),process.exitCode=1,null;const i=utils.getBrowserList();if(options.columns){const e=options.columns.split(/[ ,;:]/g),s=Object.keys(utils.getBrowserNames()),o=e.filter(e=>s.includes(e));if(o.length&&o.length===e.length)i.desktop=i.desktop.filter(e=>o.includes(e)),i.mobile=i.mobile.filter(e=>o.includes(e)),i.ext=i.ext.filter(e=>o.includes(e)),options.ext=i.ext.length>0;else if(!t)return err(`\n?y${text.invalidColumnIds}?R`),process.exitCode=1,null}const r=/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi,l=n.__compat||{},a=l.support||{},p=l.status||{},d=e.startsWith("webextensions"),c=e.startsWith("javascript"),u=l.mdn_url&&l.mdn_url.length?("https://developer.mozilla.org/docs/"+l.mdn_url).replace(".org/docs/Mozilla/Add-ons/",".org/Add-ons/"):null;let h=l.title?l.title.replace("→","-&gt;"):null;const m={isCompat:"object"==typeof n.__compat,path:e,prePath:utils.prePathFromPath(mdn,e),name:utils.nameFromPath(e),title:h,description:l.description,url:u,specs:l.specs||[],experimental:p.experimental,standard:p.standard_track||t&&d,deprecated:p.deprecated,browsers:{desktop:[],mobile:[],ext:[]},notes:[],links:[],children:[],isFiltered:!1};if(options.desktop&&i.desktop.length&&i.desktop.forEach(e=>{m.browsers.desktop.push(f(e,a))}),options.mobile&&i.mobile.length&&i.mobile.forEach(e=>{m.browsers.mobile.push(f(e,a))}),options.ext&&i.ext.length&&i.ext.filter(e=>(c||"nodejs"!==e)&&(d||"thunderbird"!==e)).forEach(e=>{m.browsers.ext.push(f(e,a))}),options.children&&!t){const t=options.args.length?options.args.map(e=>utils.getComparer(e,!(e.includes("*")||e.startsWith("/")),!0)):null;m.isFiltered=!!t;const s=options.history;options.history=!1,Object.keys(n).forEach(s=>{const o=n[s].__compat;if(o){const n=o.status||{};if(options.obsolete||d||(n.experimental||n.standard_track||n.deprecated)&&!n.deprecated){const o=e+"."+s;t&&!utils.testFilters(t,s)||m.children.push(format(o,!0,m.notes,m.links))}}}),options.history=s}function f(e,t){const n=[],i=[],l=t[e]||{};let a=Array.isArray(l)?l:[l];options.history||(a=[a[0]]);const p=s||m.notes,d=o||m.links;return a.forEach(e=>{const t=[];if(options.notes&&(e.notes||e.prefix||e.alternative_name||e.partial_implementation)){const s=Array.isArray(e.notes)?e.notes:e.notes?[e.notes]:[];if(e.prefix&&s.push(text.vendorPrefix+": "+e.prefix),e.alternative_name){let t=utils.ansiFree(utils.versionAddRem(e.version_added,e.version_removed));t=t===char.yes?"":t+" ",s.push(`${text.versionColumn} ${t}${text.usesAltName}: ?w${e.alternative_name}?R`)}e.partial_implementation&&s.push(text.partialImpl),s.forEach(e=>{let s=function(e,t){for(let s=0;s<t.length;s++)if(t[s].note===e)return t[s].index;return-1}(e,p);s<0&&(s=p.length,p.push({index:s,note:e}),e.replace(r,(e,t,o)=>{d.push({index:s,url:o})})),i.includes(s)||i.push(s),t.includes(s)||t.push(s)})}(options.history||!options.history&&!n.length)&&n.push(Object.assign(e,{version_removed:e.version_removed||null===e.version_added&&null,flags:e.flags||[],notes:t}))}),{browser:e,history:n,noteIndex:i.sort()}}return function(){let e=-1,t=-1;m.links.forEach(s=>{s.index!==t&&(t=s.index,e++),s.linkIndex=e})}(),m}module.exports=format;
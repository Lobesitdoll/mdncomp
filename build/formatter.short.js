const utils=loadModule("core.utils"),table=loadModule("core.table"),maxNameLen=40,browserNames=utils.getBrowserNames(),tblOptions={align:["l"],delimiter:char.sep,stringLength:utils.ansiLength};function formatterShort(e){const t=[];let s=!1,n=!1;log(`${lf}?c${e.prePath}?w${e.name}  ${function(){if(e.path.startsWith("webextensions"))return"";const t=[];e.standard&&t.push(`?g${text.standardShort}?R`);e.experimental&&t.push(`?y${text.experimentalShort}?R`);e.deprecated&&t.push(`?r${text.deprecatedShort}?R`);t.length||t.push(`?r${text.nonStandardShort}?R`);return t.length?`?G[${t.join(", ")}?G]?R`:"?R"}()}?R`),e.url&&log(`?G${e.url}?R`);const o=["?y"+text.hdrBrowsers];if(options.desktop&&e.browsers.desktop.length&&o.push(...r("desktop","?w")),options.mobile&&e.browsers.mobile.length&&o.push(...r("mobile","?c")),options.ext&&e.browsers.ext.length&&o.push(...r("ext","?y")),o[o.length-1]+="?G",t.push(o),t.push(...function(){const t=[];t.push(l(e.name,e.browsers,"?w")),options.children&&e.children.length&&e.children.forEach(s=>{let n=utils.entities("?w"+utils.breakAnsiLine(utils.cleanHTML(s.title||s.name,!0,"?w"),-1));utils.ansiFree(n).length>maxNameLen?(n=utils.breakAnsiLine(n,maxNameLen-2,!0).split(lf)[0].trim()).length<maxNameLen&&(n+=".."):s.name===e.name&&(n+="()"),s.standard||s.experimental||s.deprecated||(n="?G"+char.deprecated+n),t.push(l(n+"?w",s.browsers,"?R"))});return t}()),log(lf+table(t,tblOptions)),options.expert<2){const e=[];s&&e.push(`?c${char.notes}?R) ${text.someNotesHint}`),n&&e.push(`?c${char.flags}?R) ${text.someFlagsHint}`),e.length&&(log(e.join(", ")),log(text.someHints+lf))}function r(t,s="?w"){const n=e.browsers[t];return n.map((e,t)=>s+browserNames[e.browser].short.padEnd(3)+(t===n.length-1?"?w":"?G"))}function l(e,t,s="?R"){const n=[s+e];return options.desktop&&n.push(...i(t.desktop)),options.mobile&&n.push(...i(t.mobile)),options.ext&&n.push(...i(t.ext)),n}function i(e){const t=[];return e.forEach((o,r)=>{const l=o.history[0];let i=utils.versionAddRem(l.version_added,l.version_removed,o.noteIndex.length>0);o.noteIndex.length&&(s=!0,i+="?c"+char.notes),i+=r===e.length-1?"?w":"?G",l.flags&&l.flags.length&&(n=!0,i+="?m"+char.flags+"?G"),t.push(i)}),t}}module.exports=formatterShort;
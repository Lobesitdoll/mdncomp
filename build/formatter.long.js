"use strict";const utils=loadModule("core.utils"),table=loadModule("core.table"),browserNames=utils.getBrowserNames(),refs=global.char.refs.split(""),tblOptions={align:["l"],delimiter:char.sep,stringLength:utils.ansiLength,start:"?G",end:"?R"};function formatterLong(t,e=!1){const s=t.path.startsWith("webextensions"),n=[],o=[],i={exp:!1,dep:!1,nonStd:!1,parent:!1,any:!1};if(e?d(text.subFeature.toUpperCase()):log(),log(utils.breakAnsiLine(`?R${t.prePath}?w${t.name}?R`,options.maxChars)),s||log(function(){let e=[];t.standard&&e.push(`?g${text.standard}?R`);t.experimental&&e.push(`?y${text.experimental}?R`);t.deprecated&&e.push(`?r${text.deprecated}?R`);e.length||e.push(`?r${text.nonStandard}?R`);return e.join(", ")}()),t.url&&log((t.url?"?G"+t.url:"-")+"?R"),!e&&options.desc)if(t.description){let e=utils.entities("?w"+utils.breakAnsiLine(utils.cleanHTML(t.description,!0,"?w"),options.maxChars));log(lf+e)}else log(lf+"?R"+text.noDescription);if(log("?R"),options.desktop&&t.browsers.desktop.length&&l("desktop"),options.mobile&&t.browsers.mobile.length&&l("mobile"),options.ext&&t.browsers.ext.length&&l("ext"),options.expert<2&&(i.dep||i.nonStd||i.exp||i.parent)){let t=[];i.exp&&t.push(`?y${char.experimental}?R = ${text.experimental}`),i.dep&&t.push(`?b${char.deprecated}?R = ${text.deprecated}`),i.nonStd&&t.push(`?r${char.nonStd}?R = ${text.nonStandard}`),i.parent&&t.push(`?g${char.parent}?R = ${text.listParent}`),log("?R"+t.join(", ")+lf)}if(n.length)if(e||void 0===options.sub||+options.sub<0||+options.sub>=n.length)e||d(text.subFeatures.toUpperCase()),n.forEach((t,s)=>log(`?g${e?"*":s}?R) ?w${utils.breakAnsiLine(utils.cleanHTML(t,!0,"?w"),options.maxChars)}?R`)),e||log();else{const e=Object.assign({},options),s=0|options.sub;options.history=options.desc=options.children=!1,options.flags=!0,options.expert=2,options.sub=void 0;let n=0;for(let e of t.children)if(e.title&&++n===s){log(formatterLong(e,!0));break}options=Object.assign(options,e)}if((options.flags||options.history)&&(options.desktop&&h("desktop"),options.mobile&&h("mobile"),options.ext&&h("ext"),o.length&&(d((options.history?text.hdrFlagsHistory:text.hdrFlags)+" (?m"+char.flags+"?b)"),log(o.join(lf)),log("?R"))),options.notes&&t.notes.length&&(d(text.hdrNotes),t.notes.forEach(e=>{let s=`?c${refs[e.index%refs.length]}?R: `;s+=`?R${utils.cleanHTML(e.note,!0,"?R","?c","?y")}`,s+=e.note.includes("<a")?`?R ${text.refLink} ${function(e){for(let s of t.links)if(s.index===e.index)return s;return{linkIndex:"-"}}(e).linkIndex}.?R`:"?R",log(utils.breakAnsiLine(s,options.maxChars))}),log("?R"),options.notes&&t.links.length)){d(text.hdrLinks);let e="";t.links.forEach(s=>{let n;s.index===e?n="".padStart(Math.log10(t.links.length)+1)+"  ":(e=s.index,n=`?c${s.linkIndex}?R: `),log(`${n}?G${s.url}?R`)}),log("?R")}var r;function a(t){log(t),i.any=!0}function l(e){const s=[],n=t.browsers[e],o=t.name,r=[`?b${text[e].toUpperCase()} >`.padEnd(Math.max(0,options.maxChars-65))+"?G"],a=n.map(t=>`?w${browserNames[t.browser].long.padEnd(10)}?G`);s.push(r.concat(a));let l=o;t.isCompat||(l=char.parent+" "+o,i.parent=!0),l=p(l,t),s.push(c(l,n,t,!1)),options.children&&t.children.length&&t.children.forEach(t=>{let n=t.name;n===o&&(n+="()"),n=p(n,t),s.push(c(n,t.browsers[e],t,!0))}),log("?G"+table(s,tblOptions))}function p(t,s){if(s.title){const o=n.indexOf(s.title);t=`${e?"?g* ?w":"?y"}${text.subFeature} ?g${e?"":o<0?n.length:o}`,o<0&&n.push(s.title)}return t}function c(t,e,n,o){const r=o?"?R":n.isCompat?"?w":"?g";let a=" ";s||(n.deprecated&&(a+="?b"+char.deprecated,i.dep=!0),n.standard||n.experimental||(a+="?r"+char.nonStd,i.nonStd=!0),n.experimental&&(a+="?y"+char.experimental,i.exp=!0)),a.length&&(a=a.trimRight());const l=[r+t+a+"?G"];return e.sort(x).forEach(t=>{const e=t.history[0];let s=utils.versionAddRem(e.version_added,e.version_removed,t.noteIndex.length>0);t.noteIndex.length&&(s+="?c",t.noteIndex.forEach(t=>{s+=refs[t%refs.length]})),options.flags&&e.flags&&e.flags.length&&(s+="?m"+char.flags),s+="?G",l.push(s)}),l}function h(e){t.browsers[e].forEach(t=>{const e=browserNames[t.browser].long;if(t.history.length){let s=options.history?t.history.length:1;for(let n=0;n<s;n++){const s=t.history[n];let i=utils.ansiFree(utils.versionAddRem(s.version_added,s.version_removed,!1,!0));if(i=i===char.yes||i===char.no?"":" "+i,options.history&&(s.alternative_name&&o.push(`?y${e}${i}?R: ${text.altName}: ?c${s.alternative_name}`),s.prefix&&o.push(`?y${e}${i}?R: ${text.vendorPrefix}: ?c${s.prefix}`),s.partial_implementation&&o.push(`?y${e}${i}?R: ${text.partialImpl}.`),s.notes.length)){const t=s.notes.map(t=>refs[t%refs.length]).join("?R,?c");o.push(`?y${e}${i}?R: ${text.seeNote} ?c${t}?w`)}if(options.flags&&s.flags.length){let t="?y"+e+i+":?w ";s.flags.forEach(e=>{switch(e.type){case"preference":t+=`${text.thisFeatBehind} ?c${e.name}?w ${text.preference}`,e.value_to_set&&(t+=` (${text.setTo} ?c${e.value_to_set}?w)`),t+=".";break;case"compile_flag":t+=`${text.compileWith} ?c${e.name}?w ${text.setTo} ?c${e.value_to_set}?w.`;break;case"runtime_flag":t+=`${text.startWith} ?c${e.name}?w.`}}),o.push(utils.breakAnsiLine(t,options.maxChars))}}}})}function d(t){log(`?b${t}?R`)}function x(t,e){return t<e?-1:t>e?1:0}options.specs&&t.specs.length&&(d(text.hdrSpecs),t.specs.forEach(t=>{log(`?w${utils.entities(t.name)} ?R[${r=t.status,"?"+({RFC:"yIETF RFC",STANDARD:`g${text.specStandard}`,REC:`g${text.specRec}`,CR:`c${text.candidate} ${text.specRec}`,LIVING:`c${text.specLiving} ${text.specStandard}`,DRAFT:`y${text.specDraft}`,PR:`y${text.specProposed} ${text.specRec}`,RC:`c${text.specRelease} ${text.specCandidate}`,WD:`b${text.specWorking} ${text.specDraft}`,ED:`g${text.specEditors} ${text.specDraft}`,OBSOLETE:`r${text.obsolete}`,LC:`y${text.lastCallWorking} ${text.specDraft}`,"OLD-TRANSFORMS":`o${text.hasMergedAnother} ${text.specDraft.toLowerCase()}`}[r.toUpperCase()]||`y${text.status}`)+"?R"}?R]${lf}?G${t.url}?R`)}),log("?R")),options.expert<1&&(!options.desc&&t.description&&a(text.useOptionHint+" ?c--desc?R "+text.descHint),!options.specs&&t.specs.length&&a(text.useOptionHint+" ?c--specs?R "+text.specsHint),!options.history&&t.notes.length&&a(text.useOptionHint+" ?c-y, --history?R "+text.historyHint),!t.isFiltered&&t.children.length>9&&a("?R"+text.filterHint),i.any&&log("?R"))}module.exports=formatterLong;
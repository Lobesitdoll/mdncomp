"use strict";const utils=loadModule("core.utils"),Output=loadModule("core.output"),table=loadModule("core.table"),out=new Output(0,lf),browserNames=utils.getBrowserLongNames(),refs=["°","¹","²","³","a","b","c","d","e","f","g","h","i","j","k","l","m","n","^","ª","º","'",'"',"`"],tblOptions={align:["l"],delimiter:global.sepChar,stringLength:utils.ansiLength,start:"?G",end:"?R"};function formatterLong(t,e=!1){const s=t.path.startsWith("webextensions");let o=!1,n=!1,r=!1,i=!1,a=!1;if("worker_support"===t.name)out.addLine(lf,"?c",text.hdrWorkers,"?w").addLine("%0",h());else if("SharedArrayBuffer_as_param"===t.name)out.addLine(lf,"?c",text.hdrSAB,"?w").addLine("%0",h());else{if(out.addLine("\n?c%0?w%1?R",t.prePath,t.name),s||out.addLine("%0",h()),t.url&&out.addLine(t.url?"?G"+t.url:"-","?R"),t.short&&t.short.length){let e=utils.entities("?R"+utils.breakAnsiLine(utils.cleanHTML(t.short),options.maxChars));out.addLine(e,lf)}if(options.desc&&t.description&&t.description!==t.short){let e=utils.entities("?R"+utils.breakAnsiLine(utils.cleanHTML(t.description),options.maxChars));out.addLine(lf,e,lf)}}if(options.desktop&&p("desktop"),options.mobile&&p("mobile"),options.ext&&p("ext"),(i||a||r)&&(options.workers&&e||!options.workers&&!e||options.sab&&e||!options.sab&&!e)){let t=[];r&&t.push(`?o!?R = ${text.experimental}`),i&&t.push(`?r-?R = ${text.deprecated}`),a&&t.push(`?rX?R = ${text.nonStandard}`),out.addLine(lf,"?R",t.join(", "))}var l;function p(e){const s=t.browsers[e],r=t.name,i=[],a=["?y"+text[e].toUpperCase()+"?G"],l=s.map(t=>`?w${browserNames[t.browser].padEnd(10)}?G`);i.push(a.concat(l)),i.push(d(t.isCompat?r:"P "+r,s,t,!1)),options.children&&t.children.length&&t.children.forEach(t=>{let s=t.name;o||options.workers||"worker_support"!==s||(o=!0),n||options.sab||"SharedArrayBuffer_as_param"!==s||(n=!0),s===r&&(s+="()"),i.push(d(s,t.browsers[e],t,!0))}),out.add(lf,"?G",table(i,tblOptions))}function d(t,e,o,n){const l=n?"?R":o.isCompat?"?w":"?g";let p=" ";s||(o.standard||o.experimental||(p+="?rX",a=!0),o.experimental&&(p+="?o!",r=!0),o.deprecated&&(p+="?r-",i=!0)),p=p.trimRight();const d=[l+utils.getFeatureName(t)+p+"?G"];return e.sort(f).forEach(t=>{const e=t.history[0];let s=utils.versionAddRem(e.add,e.removed);t.noteIndex.length&&(s+="?c",n&&options.shorthand?s+="*":t.noteIndex.forEach(t=>{s+=refs[t%refs.length]})),options.flags&&e.flags&&e.flags.length&&(s+=n?"?mF":"?bF"),s+="?G",d.push(s)}),d}function u(e){const s=[];t.browsers[e].forEach(t=>{const e=browserNames[t.browser];if(t.history.length){let o=options.history?t.history.length:1;for(let n=0;n<o;n++){let o=t.history[n],r=utils.ansiFree(utils.versionAddRem(o.add,o.removed));if(options.history){let t=isNaN(r)?"":" "+r;o.altName&&s.push(`?y${e}${t}?w: ${text.altName}: ?c${o.altName}?w`),o.prefix&&s.push(`?y${e}${t}?w: ${text.vendorPrefix}: ?c${o.prefix}?w`),o.partial&&s.push(`?y${e}${t}?w: ${text.partialImpl}.?w`),o.notes.length&&s.push(`?y${e}${t}?w: ${text.seeNote} ?c${o.notes.map(t=>refs[t%refs.length]).join(", ")}?w`)}if(options.flags&&o.flags.length){let t="?y"+e+(r=isNaN(r)?"":" "+r)+":?w ";o.flags.forEach(e=>{switch(e.type){case"preference":t+=`${text.thisFeatBehind} ?c${e.name}?w ${text.preference}.`,e.value_to_set&&(t+=` (${text.setTo} ?c${e.value_to_set}?w).`);break;case"compile_flag":t+=`${text.compileWith} ?c${e.name}?w ${text.setTo} ?c${e.value_to_set}?w.`;break;case"runtime_flag":t+=`${text.startWith} ?c${e.name}?w. `}}),s.push(utils.breakAnsiLine(t,options.maxChars)+lf)}}}}),out.add(s.join(lf))}function h(){let e=[];return t.standard&&e.push(`?g${text.standard}?R`),t.experimental&&e.push(`?y${text.experimental}?R`),t.deprecated&&e.push(`?r${text.deprecated}?R`),e.length||e.push(`?r${text.nonStandard}?R`),e.join(", ")}function c(t){out.addLine(`${lf}?c${ANSI.underline}${t}`)}function f(t,e){return t<e?-1:t>e?1:0}return o&&out.addLine(lf,utils.breakAnsiLine(text.workerHint,options.maxChars)),n&&out.addLine(lf,utils.breakAnsiLine(text.sabHint,options.maxChars)),options.workers&&t.workers&&formatterLong(t.workers,!0),options.sab&&t.sab&&formatterLong(t.sab,!0),options.notes&&t.notes.length&&(c(text.hdrNotes),t.notes.forEach(t=>{let e=`?c${refs[t.index%refs.length]}?R: `;e+=`?R${utils.cleanHTML(t.note,!0,"?R","?c","?y")}`,e+=t.note.includes("<a href")?`?R ${text.refLink} ${t.index}.?R`:"?R",out.addLine(utils.breakAnsiLine(e,options.maxChars))}),options.notes&&t.links.length&&(c(text.hdrLinks),t.links.forEach(t=>{out.addLine(`?c${t.index}?R: ?y${t.url}?R`)}))),options.flags&&function(){const e=[];options.desktop&&e.push("desktop");options.mobile&&e.push("mobile");options.ext&&e.push("ext");for(let s of e)for(let e of t.browsers[s])if(e.history.length){if(options.history)return!0;let t=options.history?e.history.length:1;for(let s=0;s<t;s++)if(e.history[s].flags.length)return!0}return!1}()||options.history&&function(){const e=[];options.desktop&&e.push("desktop");options.mobile&&e.push("mobile");options.ext&&e.push("ext");for(let s of e)for(let e of t.browsers[s])if(e.history.length)return!0;return!1}()?(c(text.hdrFlagsHistory),options.desktop&&u("desktop"),options.mobile&&u("mobile"),options.ext&&u("ext"),out.addLine()):out.addLine(options.history?"":"?R\nYou can use option ?c-y, --history?R to see historical data."),options.specs&&t.specs.length&&(c(text.hdrSpecs),t.specs.forEach(t=>{out.addLine("?w"+`${utils.entities(t.name)} ?R[${l=t.status,"?"+({RFC:"yIETF RFC",STANDARD:`g${text.specStandard}`,REC:`g${text.specRec}`,CR:`c${text.candidate} ${text.specRec}`,LIVING:`c${text.specLiving} ${text.specStandard}`,DRAFT:`y${text.specDraft}`,PR:`y${text.specProposed} ${text.specRec}`,RC:`c${text.specRelease} ${text.specCandidate}`,WD:`b${text.specWorking} ${text.specDraft}`,ED:`g${text.specEditors} ${text.specDraft}`,OBSOLETE:`r${text.obsolete}`,LC:`y${text.lastCallWorking} ${text.specDraft}`,"OLD-TRANSFORMS":`o${text.hasMergedAnother} ${text.specDraft.toLowerCase()}`}[l.toUpperCase()]||`y${text.status}`)+"?R"}?R]${lf}${t.url}`)})),out.toString()}module.exports=formatterLong;
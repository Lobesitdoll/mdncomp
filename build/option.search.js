const utils=loadModule("core.utils");function search(t){const e=utils.loadMDN(),r=utils.getComparer(t,options.fuzzy,!options.caseSensitive),s=[];return utils.getRootList(e).forEach(t=>(function t(e,o,i){const n=e[o];if("object"==typeof n){let e=Object.keys(n);options.deep||(e=e.filter(t=>"__compat"!==t)),e.forEach(e=>{if("__compat"!==e||s.includes(i)){const f=i+"."+e;r.test(f)&&(e!==o&&s.length||!s.length)?s.push(f):t(n,e,f)}else{const t=n[e];("string"==typeof t.description&&r.test(t.description)||"string"==typeof(t.title||t.short)&&r.test(t.title||t.short)||function(t){for(let e of Object.keys(t)){const s=t[e],o=Array.isArray(s)?s:[s];for(let t of o){const e=t.notes;if("string"==typeof e&&r.test(e))return!0;if(Array.isArray(e))for(let t of e)if(r.test(t))return!0;if("string"==typeof t.alternative_name&&r.test(t.alternative_name))return!0;if("string"==typeof t.prefix&&r.test(t.prefix))return!0;if(Array.isArray(t.flags))for(let e of t.flags)if("string"==typeof e.type&&r.test(e.type)||"string"==typeof e.name&&r.test(e.name))return!0}}return!1}(t.support))&&s.push(i)}})}})(e,t,t)),s}module.exports=search;
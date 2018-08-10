/*!
  Search module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/
const utils=require("./core.utils"),mdn=utils.loadMDN();function search(t,r){const e=utils.getComparer(t,options.fuzzy,!r),o=[];return utils.getRootList(mdn).filter(t=>"browsers"!==t).forEach(t=>(function t(r,s,u){const a=r[s];"object"==typeof a&&Object.keys(a).forEach(r=>{if("__compat"!==r&&"worker_support"!==r&&"sharedarraybuffer_support"!==r&&"SharedArrayBuffer_as_param"!==r){let n=u+"."+r;e.test(n)&&(r!==s&&o.length||!o.length)?o.push(n):t(a,r,u+"."+r)}})})(mdn,t,t)),o}module.exports=search;
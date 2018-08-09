/*!
  Search module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/
const utils=require("./core.utils"),mdn=utils.loadMDN();function search(r,e){const t=utils.getComparer(r,options.fuzzy,!e),s=[];return utils.listTopLevels(mdn).filter(r=>"browsers"!==r).forEach(r=>(function r(e,o,u){const a=e[o];"object"==typeof a&&Object.keys(a).forEach(e=>{if("__compat"!==e&&"worker_support"!==e&&"sharedarraybuffer_support"!==e&&"SharedArrayBuffer_as_param"!==e){let n=u+"."+e;t.test(n)&&(e!==o&&s.length||!s.length)?s.push(n):r(a,e,u+"."+e)}})})(mdn,r,r)),s}module.exports=search;
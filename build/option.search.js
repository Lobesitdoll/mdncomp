/*!
  Search module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/
const utils=require("./core.utils"),mdn=utils.loadMDN();function search(t,e){const r=utils.getComparer(t,options.fuzzy,!e),o=[];return utils.listTopLevels(mdn).filter(t=>"browsers"!==t).forEach(t=>(function t(e,s,u){const c=e[s];"object"==typeof c&&Object.keys(c).forEach(e=>{if("__compat"!==e&&"worker_support"!==e&&"SharedArrayBuffer_as_param"!==e){let a=u+"."+e;r.test(a)&&e!==s?o.push(a):t(c,e,u+"."+e)}})})(mdn,t,t)),o}module.exports=search;
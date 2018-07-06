const fs=require("fs"),path=require("path"),zlib=require("zlib"),io=require("./io"),ANSI=require("./ansi"),rfc6902=require("rfc6902"),log=console.log.bind(console),urlPrefix="https://raw.githubusercontent.com/epistemex/mdncomp-data/master/",filePrefix=path.normalize(path.dirname(process.mainModule.filename)+"/../data/"),clr=ANSI.clrToCursor+ANSI.cursorUp,PWIDTH=40;function clrLine(){log(clr+"".padStart(72," "))}function compareMD5(e){let t;try{t=fs.readFileSync(filePrefix+"data.md5","utf-8")}catch(e){}io.request(urlPrefix+"data.md5",null,null,r=>{e({local:t,remote:r})},e=>{log("An error occurred:",e.statusCode,e.error)})}function getPatch(e,t){let r=urlPrefix+"patches/"+e.remote+"_"+e.local;io.request(r,null,null,e=>{t(null,zlib.gunzipSync(e))},e=>{t(e)},!0)}function getRemoteData(e){let t,r,a=0;function l(){log(clr+ANSI.white+"Downloading data "+ANSI.white+"["+ANSI.blue+"#".repeat(r)+" ".repeat(PWIDTH-r)+ANSI.white+"]"+ANSI.reset)}io.request(urlPrefix+"data.gz",()=>!clrLine(),e=>{r=Math.ceil(PWIDTH*e),(t=Date.now())-a>250&&(a=t,l())},t=>{l(),e(null,zlib.gunzipSync(t))},t=>{e(t)},!0)}function getCurrentData(){let e={};try{e=JSON.parse(fs.readFileSync(filePrefix+"data.json","utf-8"))}catch(e){}return e}module.exports=function(e,t){compareMD5(r=>{function a(){getRemoteData((e,t)=>{e?log(e):l(t,r.remote)})}function l(e,t){try{fs.writeFileSync(filePrefix+"data.json",e,"utf-8"),fs.writeFileSync(filePrefix+"data.md5",t,"utf-8")}catch(e){log(e)}clrLine(),log("Data updated!")}e?a():r.local===r.remote?log("No new data available."):t?log("New data is available."):getPatch(r,(e,t)=>{if(e)log("No patch available - Loading full dataset..."),a();else{let e=getCurrentData(),o=!1;log("Applying patch...");let i=JSON.parse(t);rfc6902.applyPatch(e,i).forEach(e=>{e&&(log(`Error with "${e.name}": ${e.message}`),o=!0)}),o?(log(`Error during patching ${r.local} -> ${r.remote}.\nDownloading full dataset...`),a()):(!function(e){let t=0,r=0,a=0;e.forEach(e=>{"add"===e.op?t++:"remove"===e.op?r++:"replace"===e.op&&a++}),log(`Diff: ${t} adds, ${a} replacements, ${r} removes`)}(i),l(JSON.stringify(e),r.remote))}})})};
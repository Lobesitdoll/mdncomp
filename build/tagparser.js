function tagParser(r,t,a){const e=0,s=1,g=2;let n,o=0,i=-1,P=e,l=!1,p="",k="";for(;o<r.length;)n=r[o],l?(P?(P===s&&'"'===n||P===g&&"'"===n)&&(P=e):'"'===n?P=s:"'"===n&&(P=g),P||((" "===n&&!p.length||">"===n&&!p.length)&&(p=r.substring(i+1,o)),">"===n&&(l=!1,k+=t({tagStart:i,tagEnd:o+1,name:p.toLowerCase()})))):"<"===n?(l=!0,i=o,p=""):(!tagParser.skipLF||"\n"!==n&&"\r"!==n||(n=""),tagParser.skip||(k+=a(n))),o++;return k}tagParser.skip=!1,tagParser.skipLF=!1,module.exports=tagParser;
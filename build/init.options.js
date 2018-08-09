"use strict";const options=require("commander"),version=require("../package.json").version,args=process.argv;module.exports=(()=>{if(args.length>=4)for(let e of args)"-h"!==e&&"--help"!==e||o();function o(){loadModule("init.help")()}if(options.version(version,"-v, --version").usage("[options] [*]").description(`Get MDN Browser Compatibility Data, docs and specs.${lf}  Version: ${version+lf}  (c) 2018 epistemex.com`).option("-l, --list [api]","List paths starting with given branch(es), or none for root list").option("-b, --browser [id]","Show information about this browser, or list if none").option("-i, --index <index>","Show this index from a multiple result list",-1).option("-D, --no-desktop","Don't show for desktop devices").option("-M, --no-mobile","Don't show for mobile devices").option("-x, --ext","Show extended table of browsers/servers").option("-R, --no-children","Don't show object children in the table listing.").option("-c, --case-sensitive","Search in case-sensitive mode").option("-z, --fuzzy","Use path as a fuzzy search term").option("-s, --shorthand","Show compatibility as shorthand with multiple results").option("-N, --no-notes","Don't show notes").option("-F, --no-flags","Don't show flags").option("-y, --history","List version history entries per browser.").option("--desc","Show Short description of the feature").option("--specs","Show specification links").option("-w, --workers","Show detailed workers information.").option("--sab","Show detailed SharedArrayBuffer as param information.").option("--obsolete","Show obsolete, non-standard and deprecated child features.").option("--update","Update data from remote if available").option("--fupdate","Force update data from remote").option("--cupdate","Check if update is available").option("--random [scope]",'Show a random entry within "scope" (use . for any)').option("--no-colors","Don't use colors in output").option("--max-chars <width>","Max number of chars per line before wrap",84).option("-G, --no-config","Ignore config file (mdncomp.json) in config folder").option("--read","Mark notifications in the current update as read").option("--configpath","Show path to where config file and cache is stored").on("--help",o).parse(args),loadModule("init.config")(options),options.index<0)for(let o,e=0;o=options.args[e];e++)if(!isNaN(o)){options.args.splice(e,1),options.index=+o;break}return options})();
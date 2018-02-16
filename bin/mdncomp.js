#!/usr/bin/env node

/*
  mdncomp
  By K3N / epistemex.com
  MIT license
 */
"use strict";

/*
  NOTE This is an ALPHA release (and initially experimental
  to familiarize with the MDN API). The code is messy as heck
  and in dire need of refactoring.

  There are some notes/flags quirks that need to ironed out.
  Works as-is for the main purpose though. Use at own risk.
 */
var
  bcd = require("mdn-browser-compat-data"),
  options = require("commander"),
  fs = require("fs"),
  version = require('../package.json').version,
  args = process.argv,
  log = console.log.bind(console);

options
  .version(version, "-v, --version")
  .usage('[options] <apipath>')
  .description("Get MDN Browser Compatibility data.\n  (c) 2018 K3N / epistemex.com")
  .option("-l, --list", "List objects at to this level. * allowed at end", false)
  .option("-o, --out <path>", "Save information to file")
  .option("-N, --no-notes", "Don't show notes", false)
  .option("-e, --noteend", "Show notes (-n) at end instead of in sections", false)
  .option("-f, --markdown", "Format output as markdown code-block", false)
  .option("-d, --desktop", "Show desktop only", false)
  .option("-m, --mobile", "Show mobile devices only", false)
  .option("-s, --search", "Search and list all path containing the keyword", "")
  .option("-S, --searchcs", "Search case-sensitive", "")
  .option("--max-chars <width>", "Max number of chars per line before wrap (min. 62)", 72)
  //.option("-t, --type <type>", "Used with -o, file type [txt, md, png, jpeg, svg, pdf]", "txt")
  //.option("-w, --width <width>", "Used with -o, Set width of image", 640)
  .action(getInfo)
  .on("--help", function() {
    log();
    log("  Default output is a formatted code block.");
    log();
    log("  Examples:");
    log("    $ mdncomp api.Blob");
    log("    $ mdncomp --notes api.Blob");
    log("    $ mdncomp css.properties.background-color");
    log("    $ mdncomp --list api.HTML*");
    //log("    $ mdncomp -i CanvasPattern.png api.CanvasPattern");
    log()
  })
  .parse(args);

if (args.length < 3) options.help();

function search(keyword, ignoreCase) {
  keyword = sans(keyword);
  if (ignoreCase) keyword = keyword.toLowerCase();

  log("Searching: \"" + keyword + "\":");

  var o = bcd, results = [], keys = Object.keys(bcd);

  // 3 levels - todo make recursive?
  keys.forEach(function(key1) {
    var key = ignoreCase ? key1.toLowerCase() : key1;
    if (key.includes(keyword)) results.push(key1);
    var keys = Object.keys(o[key1]);
    keys.forEach(function(key2) {
      var key = ignoreCase ? key2.toLowerCase() : key2;
      if (key.includes(keyword)) results.push(key1 + "." + key2);
      var keys = Object.keys(o[key1][key2]);
      keys.forEach(function(key3) {
        var key = ignoreCase ? key3.toLowerCase() : key3;
        if (key.includes(keyword)) results.push(key1 + "." + key2 + "." + key3);
      });
    });
  });

  results.sort();

  if (results.length) {
    log("  " + results.join("\n  "));
    log("Results: " + results.length + "\n");
  }
  else
    log("Keyword not found.");

}

function getInfo(path) {

  // ignore these if both are set
  if (options.mobile && options.desktop) options.mobile = options.desktop = false;

  // do a search ?
  if (options.search) {
    search(path, true);
    return;
  }

  if (options.searchcs) {
    search(path, false);
    return;
  }

  // get path
  var parts = path.trim().split("."),
      o = bcd,
      isPattern = false,
      pattern = "";

  parts.forEach(function(part) {
    if (part.endsWith("*")) {
      isPattern = true;
      pattern = sans(part);
    }
    part = sans(part);
    if (o && !isPattern) o = o[part];
  });

  if (!o) log("Unknown path.", path);
  else {

    // List properties to output
    if (options.list) {
      log(list(o, isPattern, pattern));
    }

    // Get information
    else {
      if (!o.__compat) {
        //log("Need to be a property. Alternatively use the --list option.")
        log(list(o, isPattern, pattern))
      }
      else {
        if (options.out) {
          fs.writeFile(options.out, format(o, parts[parts.length - 2] + "." + parts[parts.length - 1]), function(err) {
            if(err) return log("An error occurred:\n" + err);
            log("Saved output to file '" + options.out + "'!");
          })
        }
        else {
          log();
          log(format(o, parts[parts.length - 2] + "." + parts[parts.length - 1]));
        }

      }
    }
  }

}

function list(o, isPattern, pattern) {
  var keys = Object.keys(o), out = [];
  if (isPattern) {
    keys.forEach(function(key) {
      if (key.startsWith(pattern)) out.push(key);
    });
    keys = out;
  }

  keys.sort();

  // remove special properties
  if (keys[0].startsWith("__")) keys.splice(0, 1);
  return keys.join("\n")
}

function format(o, oName) {
  o = o.__compat;
  var
    currentSup = 0, notes = [],
    lf = "\n", dl = lf + lf, s = "|", ss = options.markdown ? "" : "  ",
    txt = "";

  if (options.markdown) txt += "```text\n";

  if (options.markdown && o.mdn_url) {
    txt += "[\"`" + oName.split(".")[1] + "`\"](" + o.mdn_url + ")";
  }
  else
    txt += "\"" + oName + "\"";

  if (o.status) {
    txt += " (";
    if (o.status.experimental) txt += "NOTE: EXPERIMENTAL, ";
    if (o.status.deprecated) txt += "NOTE: DEPRECATED!, ";
    if (o.status.standard_track) txt += "on standard track ";
    txt = ss + txt.trim();
    if (txt.endsWith(",")) txt = txt.substr(-1);
    txt += ")\n";
  }
  else txt = ss + txt + lf;

  if (!options.markdown && o.mdn_url) txt += "  See: " + o.mdn_url + dl;
  else txt += lf;

  //if (!o.mdn_url) txt += ss + "-no link available-\n\n";

  if (!options.mobile) {
    txt += ss + "DESKTOP:\n";
    txt += ss + "Chrome  | Firefox | Edge    | IE      | Opera   | Safari\n";
    txt += ss + "--------+---------+---------+---------+---------+----------\n";
    txt += ss + (ver("chrome") + s + ver("firefox") + s + ver("edge") + s + ver("ie") + s
      + ver("opera") + s + ver("safari")).substr(1) + dl;

    if (currentSup && !options.noteend) {
      notes.forEach(function(note) {txt += note + lf});
      txt += lf;
      currentSup = 0;
      notes = [];
    }
  }

  if (!options.desktop) {
    txt += ss + "MOBILE:\n";
    txt += ss + "Android | Chrome  | Edge    | Firefox | Opera   | Safari\n";
    txt += ss + "--------+---------+---------+---------+---------+----------\n";
    txt += ss + (ver("webview_android") + s + ver("chrome_android") + s + ver("edge_mobile") + s
      + ver("firefox_android") + s + ver("opera_android") + s + ver("safari_ios")).substr(1) + dl;

    if (currentSup) {
      notes.forEach(function(note) {txt += note + lf});
      txt += lf;
    }
  }

  txt += "Data from MDN - 'npm i -g mdncomp' by K3N / epistemex.com (c) 2018.\n";

  if (options.markdown) txt += "```\n";

  function ver(browser) {
    var brDetails, details = o.support[browser], parse = false, result = "", sups = ["¹", "²", "³", "ª", "º", "*", "*", "*", "*", "*", "*"], ver;

    //if (Array.isArray(be)) log(be);

    if (Array.isArray(details)) {
      brDetails = details[0];
      parse = true;
    }
    else brDetails = details;

    if (brDetails && brDetails.version_added) {
      ver = brDetails.version_added.toString();
      if (brDetails.notes && options.notes) {
        notes.push(filter(sups[currentSup] + ") " + brDetails.notes, options.maxChars));
        ver += "(" + sups[currentSup++] + ")";
      }
    }
    else {
      ver = "-"
    }

    if (parse && options.notes) {
      for(var i = 1, verAdd, verRem; i < details.length; i++) {
        brDetails = details[i];
        if (brDetails && brDetails.version_added) {

          if (brDetails.notes) {
            notes.push(filter(pretty(browser) + " " + brDetails.version_added.toString() + ": " + brDetails.notes, options.maxChars));
          }
          else if (brDetails.flags) {
            brDetails.flags.forEach(function(flag) {
              if (flag.type === "preference") {
                verAdd = brDetails.version_added.toString();
                verRem = brDetails.version_added ? brDetails.version_removed.toString() : null;
                notes.push(filter("*) " + pretty(browser) + ": From " + verAdd + (verRem ? " until " + verRem : "") + " behind flag '" + flag.name + "'"));
              }
            });
          }
        }
      }
    }

    result += ver;
    result += brDetails && brDetails.version_removed ? "-" + cBool(brDetails.version_removed.toString()) : "";
    return (cBool(result) + "   ").padStart(9);
  }

  function cBool(o) {
    if (typeof o === "string" && o === "true") return "Yes";
    return o
  }

  function pretty(n) {
    var p = n.split("_"), s = "";
    p.forEach(function(p) {s += p.substr(0, 1).toUpperCase() + p.substr(1) + " "});
    return s.trim();
  }

  function filter(s, max) {
    if (Array.isArray(s)) s = s[0]; // fixme should not be arrays in here...

    // remove simple tags (a links)
    s = s.replace(/(<([^>]+)>)/ig,"");

    // break lines
    var out = "", i, _max = Math.max(62, (max>>>0 || 72)), line = s.substr(0, _max);
    while(line.length === _max) {
      i = line.lastIndexOf(" ");
      if (i < 0) i = _max;
      out += line.substr(0, i).trim() + "\n";
      s = s.substr(i);
      line = s.substr(0, _max)
    }
    out += line;

    return out
  }

  return txt
}

/*------------------------------------------------------------------------------------------------------------------*

    HELPERS

*------------------------------------------------------------------------------------------------------------------*/

function sans(txt) {
  var allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-", clean = "", ch, i = 0;
  while(ch = txt[i++]) {
    if (allowed.indexOf(ch) >= 0) clean += ch;
  }
  return clean
}

/*
  Utils module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const io = require("./core.io");
const colorCodes = "rgyobmpcwCGR";

const utils = {

  /**
   * Flattens the object tree into array (each item = one line):
   * f.ex: mdn["api"]["Blob"]["slice"] => "api.Blob.slice"
   * @returns {Array}
   */
  bcdToList: (mdn) => {
    const result = [];

    utils
      .getRootList(mdn)
      .forEach(key => _iterateNode(mdn, key, key));

    function _iterateNode(node, inKey, branch) {
      const subNode = node[ inKey ];

      if ( typeof subNode === "object" ) {
        Object
          .keys(subNode)
          .filter(key => key !== "__compat" && key !== "worker_support" && key !== "SharedArrayBuffer_as_param")
          .forEach(key => {
            result.push(branch + "." + key);
            _iterateNode(subNode, key, branch + "." + key);
          });
      }
    }

    return result;
  },

  /**
   * List only the top level start entries for the
   * various branches of the tree.
   * @returns {string[]}
   */
  getRootList: (mdn) => {
    return Object.keys(mdn).filter(key => key !== "browsers" && key !== "__mdncomp");
  },

  /**
   * Creates an RegEx tester from wildcard strings.
   * F.ex. input can be: `*html*toblob*`. `toBlob` is
   * automatically considered to be `*toBlob*` while
   * `to*blob` is: starts with "to" and ends with "blob".
   * @param str
   * @param fuzzy
   * @param insensitive
   * @returns {RegExp}
   */
  getComparer: (str, fuzzy, insensitive) => {
    let options = "";
    let endLine = "";
    let regex;
    let parts;

    if ( str.startsWith("/") ) {
      parts = str.split("/");
      str = parts[ 1 ];
      options = parts[ 2 ] || "";
    }
    else {
      if ( fuzzy ) {
        str = getFuzzy(insensitive ? str.toLowerCase() : str);
      }
      else {
        if ( str.endsWith(".") ) {
          str = str.substr(0, str.length - 1);
          endLine = "$";
        }
        if ( !str.endsWith("*") && !endLine.length ) str += "*";
        str = str.split("*").join(".*") + endLine;
      }
    }

    // insensitive search
    if ( insensitive && !options.includes("i") ) options += "i";

    try {
      regex = new RegExp(str, options);
    }
    catch(err) {
      utils.err(text.invalidRegex);
      process.exit(1);
    }

    function getFuzzy(q) {
      const spec = "\\^$.*+?()[]{}|";
      const chars = [];
      let endLine = "";

      if ( q.endsWith(".") ) {
        endLine = "$";
        q = q.substr(0, q.length - 1);
      }

      // push and prepend special chars
      for(let ch of q) chars.push(spec.includes(ch) ? "\\" + ch : ch);

      return chars.join(".*?") + endLine;
    }

    return regex;
  },

  /**
   * Converts a line path (api.Blob.slice) to the object,
   * in this case for slice.
   * @param mdn
   * @param path
   * @returns {*}
   */
  getPathAsObject: (mdn, path) => {
    let obj = mdn;
    if ( path ) {
      path.split(".").forEach(part => {
        if ( obj && obj[ part ] ) obj = obj[ part ];
      });
    }
    return obj;
  },

  nameFromPath: (path) => {
    let last = utils.getExt(path);
    return last.length ? last : path;
  },

  getExt: (path) => {
    let i = path.lastIndexOf(".") + 1;
    return i ? path.substr(i) : "";
  },

  prePathFromPath: (mdn, path) => {
    const parts = path.split(".");
    let o = mdn;
    let result = [];

    // remove last part since that's the feature we check
    parts.pop();

    parts.forEach(part => {
      o = (o || {})[ part ];
      if ( o ) {
        // colors: feature > hasChildren = cyan, hasChildren, no feature = green, just branch = yellow
        let color = o.__compat ? "?C" : (utils.hasChildren(o) ? "?g" : "?y");
        result.push(color + part);
      }
    });

    return result.join("?R.") + "?R.";
  },

  /**
   * Check if path points to an object with compatibility
   * information or not.
   * @param mdn
   * @param path
   * @returns {boolean}
   */
  isCompat: (mdn, path) => {
    let obj = utils.getPathAsObject(mdn, path);
    return obj && typeof obj.__compat === "object";
  },

  hasChildren: (pathObj) => {
    const keys = Object.keys(pathObj);
    for(let key of keys) {
      if ( pathObj[ key ].__compat ) return true;
    }
    return false;
  },

  getBrowserList: () => {
    return {
      desktop: [ "chrome", "edge", "firefox", "ie", "opera", "safari" ],
      mobile : [ "chrome_android", "edge_mobile", "firefox_android", "opera_android", "safari_ios", "webview_android" ],
      ext    : [ "nodejs", "qq_android", "samsunginternet_android", "thunderbird", "uc_android", "uc_chinese_android" ]
    };
  },

  getBrowserNames: () => {
    return {
      "chrome" : { short: "C", long: "Chrome" },
      "edge"   : { short: "E", long: "Edge" },
      "firefox": { short: "F", long: "Firefox" },
      "ie"     : { short: "IE", long: "IE" },
      "opera"  : { short: "O", long: "Opera" },
      "safari" : { short: "S", long: "Safari" },

      "chrome_android" : { short: "C/a", long: "Chrome/A" },
      "edge_mobile"    : { short: "E/m", long: "Edge/mob" },
      "firefox_android": { short: "F/a", long: "Firefox/A" },
      "opera_android"  : { short: "O/a", long: "Opera/A" },
      "safari_ios"     : { short: "S/i", long: "Safari/iOS" },
      "webview_android": { short: "W/a", long: "Webview/A" },

      "nodejs"                 : { short: "ND", long: "Node JS" },
      "qq_android"             : { short: "QQ", long: "QQ/A" },
      "samsunginternet_android": { short: "SM", long: "Samsung/A" },
      "thunderbird"            : { short: "TB", long: "Thunderbrd" },
      "uc_android"             : { short: "UC", long: "UC/A" },
      "uc_chinese_android"     : { short: "UCC", long: "UC-Ch/A" }
    };
  },

  uncompactURL: (url) => {
    return url.startsWith("https://") ? url : ("https://developer.mozilla.org/docs/" + url).replace(".org/docs/Mozilla/Add-ons/", ".org/Add-ons/")
  },

  /**
   * Removes any HTML tags from a string. <code> tags are replaced
   * with ANSI colored text.
   * @param str
   * @param convTags - convert entities for < and > to original form.
   * @param [resetColor=ANSI.reset] - ANSI def. to reset to, if not given "reset" will be used
   * @param htmlColor
   * @param linkColor
   * @returns {string}
   */
  cleanHTML: (str, convTags, resetColor, htmlColor, linkColor) => {
    htmlColor = htmlColor || ANSI.cyan;
    resetColor = resetColor || ANSI.reset;
    linkColor = linkColor || htmlColor;

    str = str
      .replace(/<code>/gi, htmlColor)
      .replace(/<\/code>/gi, resetColor)
      .replace(/<a href/gi, linkColor + "<a href")
      .replace(/<\/a>/gi, "</a>" + resetColor)
      .replace(/(<([^>]+)>)/gi, "");

    if ( convTags ) str = str.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
    return str;
  },

  breakAnsiLine: (s, max, overrideMin = false) => {
    const _max = overrideMin ? max : Math.max(72, max >>> 0);
    const _lf = "\n";
    let lines = [];
    let len = 0;
    let lineStart = 0;
    let lastBreak = -1;
    let inAnsi = false;
    let isShort = false;
    let i = 0;
    let ch;

    while( ch = s[ i ] ) {
      if ( inAnsi && isShort && !colorCodes.includes(ch) ) inAnsi = false;

      if ( !inAnsi ) {
        if ( ch === "\x1b" || ch === "?" ) {
          inAnsi = true;
          isShort = ch === "?";
        }
        else {
          if ( ch === " " || ch === _lf || ch === "/" || ch === "." ) lastBreak = i;

          len++;
          if ( len === _max || ch === _lf ) {
            if ( lastBreak < 0 ) lastBreak = i;

            lines.push(s.substring(lineStart, lastBreak));
            lineStart = lastBreak;
            lastBreak = -1;
            len = i - lineStart;
          }
        }
      }
      else {
        if ( ch === "m" || isShort ) inAnsi = false;
      }

      i++;
    }

    if ( len ) {
      lines.push(s.substr(lineStart));
    }

    // A little clean-up
    lines = lines.map(line => line.trim());

    return lines.length ? lines.join(lf) : "";
  },

  ansiLength: (str) => {
    return utils.ansiFree(str).length;
  },

  ansiFree: (str) => {
    const rx = new RegExp("\x1b[^m]*m|\\?[" + colorCodes + "]", "g");
    return str.replace(rx, "");
  },

  parseColorCodes: (str) => {
    const code = {
      "r": ANSI.red,
      "g": ANSI.green,
      "y": ANSI.yellow,
      "o": ANSI.orange,
      "b": ANSI.blue,
      "m": ANSI.magenta,
      "p": ANSI.purple,
      "c": ANSI.cyan,
      "w": ANSI.white,
      "C": ANSI.cyanDark,
      "G": ANSI.gray,
      "R": ANSI.reset
    };

    let result = "";
    let i = 0;
    let last = 0;

    do {
      i = str.indexOf("?", i);
      if ( i >= 0 ) {
        result += str.substring(last, i);
        let ch = str[ i + 1 ];
        let color = code[ ch ];
        if ( typeof color === "string" ) {
          result += color;
          i++;
        }
        else result += str[ i ];
        last = ++i;
      }
      else result += str.substr(last);
    } while( i >= 0 );

    return result;
  },

  entities: (txt) => {
    const ent = {
      "&nbsp;": " ",
      "&quot;": "\"",
      "&amp;" : "&",
      "&lt;"  : "<",
      "&gt;"  : ">"
    };

    const rx = new RegExp(Object.keys(ent).join("|"), "gi");
    return txt.replace(rx, m => ent[ m ]);
  },

  versionAddRem: (add, rem, hasNotes = false, interval = false) => {
    let v = "";

    if ( add === null && rem === null ) {
      v = "?G" + char.unknown;
    }
    else if ( add === null || typeof add === "undefined" ) {
      v = "?r" + char.no;
    }
    else if ( typeof add === "boolean" ) {
      if ( typeof rem === "string" ) {
        v = "?R-?r" + rem;
      }
      else {
        if ( add ) v = (hasNotes ? "?y" : "?g") + char.yes;
        else v = "?r" + char.no;
      }
    }
    else if ( typeof add === "string" ) {
      v = (rem ? "?r" : (hasNotes ? "?y" : "?g")) + add;
      if ( rem ) {
        v += "?R-?r" + (typeof rem === "boolean" ? char.unknown : rem);
        if ( interval && typeof rem !== "boolean" ) v = "[" + v + ">";
      }
    }

    return v;
  },

  testFilters: (filters, str) => {
    for(let filter of filters) if ( filter.test(str) ) return true;
    return false;
  },

  loadMDN: function() {
    let mdn;
    try {
      mdn = require("../data/" + filenameData);
    }
    catch(err) {
      utils.err(`?y${text.criticalDataFile}?R`);
      process.exit(1);
    }

    if ( typeof mdn.api === "undefined" ) {
      utils.log(`?g\n*** ${text.downloadDataset} "mdncomp --update" ***\n?R`);
      process.exit(1);
    }

    return mdn;
  },

  loadConfigFile: () => {
    const fileName = io.getConfigFilePath(false);
    try {
      return require(fileName);
    }
    catch(err) {
      return {};
    }
  },

  saveConfigFile: (config) => {
    const fileName = io.getConfigFilePath(true);
    try {
      require("fs").writeFileSync(fileName, JSON.stringify(config), "utf-8");
    }
    catch(_err) {
      // don't localize this
      err(`?rCould not write config file.${DEBUG ? lf + _err : ""}?R`);
      if ( process.platform === "darwin" || process.platform === "linux" ) {
        err(`Try using "sudo mdncomp --set <kv>" to write config.`);
      }
      process.exitCode = 1;
    }
  },

  log: function(...args) {
    if ( args.length === 1 && Array.isArray(args[ 0 ]) ) args[ 0 ] = args[ 0 ].join(lf);
    console.log(utils.parseColorCodes(args.join(" ")));
  },

  err: function(...args) {
    console.error(utils.parseColorCodes(args.join(" ")));
  }

};

module.exports = utils;
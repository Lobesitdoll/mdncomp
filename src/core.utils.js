/*
  Utils module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

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
      .filter(key => key !== "browsers")
      .forEach(key => _iterateNode(mdn, key, key));

    function _iterateNode(node, inKey, branch) {
      const subNode = node[ inKey ];

      if ( typeof subNode === "object" ) {
        Object.keys(subNode).forEach(key => {
          if ( key !== "__compat" && key !== "worker_support" && key !== "SharedArrayBuffer_as_param" ) {
            result.push(branch + "." + key);
            _iterateNode(subNode, key, branch + "." + key);
          }
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
    return Object.keys(mdn).filter(key => key !== "browsers")
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
        str = getFuzzy(str.toLowerCase());
      }
      else {
        if ( str.endsWith(".") ) {
          str = str.substr(0, str.length - 1);
          endLine = "$";
        }
        if ( !str.startsWith("*") ) str = "*" + str;
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
      process.exit();
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
    path.split(".").forEach(part => {
      if ( obj && obj[ part ] ) obj = obj[ part ];
    });
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
    let parts = path.split("."), o = mdn, res = "";
    parts.pop();
    parts.forEach(part => {
      if ( o ) {
        if ( o[ part ].__compat ) res += part + ".";
        o = o[ part ];
      }
    });

    if ( res.length < 2 ) {
      parts = path.split(".");
      parts.pop();
      res = parts.join(".") + ".";
    }

    return res.length > 1 ? res : "";
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
      ext    : [ "nodejs", "qq_android", "samsunginternet_android", "uc_android", "uc_chinese_android" ]
    };
  },

  getBrowserLongNames: () => {
    return {
      "chrome"                 : "Chrome",
      "edge"                   : "Edge",
      "firefox"                : "Firefox",
      "ie"                     : "IE",
      "opera"                  : "Opera",
      "safari"                 : "Safari",
      "chrome_android"         : "Chrome/A",
      "edge_mobile"            : "Edge/mob",
      "firefox_android"        : "Firefox/A",
      "opera_android"          : "Opera/A",
      "safari_ios"             : "Safari/iOS",
      "webview_android"        : "Webview/A",
      "nodejs"                 : "Node JS",
      "qq_android"             : "QQ/A",
      "samsunginternet_android": "Samsung/A",
      "uc_android"             : "UC/A",
      "uc_chinese_android"     : "UC-Ch/A"
    };
  },

  getBrowserShortNames: () => {
    return {
      "chrome"                 : "C",
      "edge"                   : "E",
      "firefox"                : "F",
      "ie"                     : "IE",
      "opera"                  : "O",
      "safari"                 : "S",

      "chrome_android"         : "Ca",
      "edge_mobile"            : "Em",
      "firefox_android"        : "Fa",
      "opera_android"          : "Oa",
      "safari_ios"             : "Si",
      "webview_android"        : "Wa",

      "nodejs"                 : "ND",
      "qq_android"             : "QQ",
      "samsunginternet_android": "SM",
      "uc_android"             : "UC",
      "uc_chinese_android"     : "UCC"
    };
  },

  /**
   * Format a feature name (formatters).
   * Choose special name over ordinary name.
   * Replace underscores with space
   * @param {string} name
   * @returns {string}
   */
  getFeatureName: (name) => {
    if ( name === "worker_support" )
      name = text.workerSupport;
//    else if ( name === "sab_in_dataview" )
//      name = text.sabInDataView;
    else if ( name === "SharedArrayBuffer_as_param" )
      name = text.sabSupport;

    return name; //.replace(/_/g, " ")
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
      .replace(/(<([^>]+)>)/ig, "");

    if ( convTags ) str = str.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
    return str;
  },

  breakAnsiLine: (s, max) => {
    const _max = Math.max(72, max >>> 0);
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
      if ( inAnsi && isShort && !"rgyobmpcwGR".includes(ch) ) inAnsi = false;

      if ( !inAnsi ) {
        if ( ch === "\x1b" || ch === "?" ) {
          inAnsi = true;
          isShort = ch === "?";
        }
        else {
          if ( ch === " " || ch === _lf ) lastBreak = i;

          len++;
          if ( len === _max || ch === _lf ) {
            if ( lastBreak < 0 ) lastBreak = i;

            lines.push(s.substring(lineStart, lastBreak).trim());
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

  //  getMaxLength: list => {
  //    let max = 0;
  //    list.forEach(e => {
  //      let len = (utils.prePathFromPath(e) + utils.nameFromPath(e)).length;
  //      if (len > max) max = len;
  //    });
  //    return max
  //  },

  ansiLength: (str) => {
    return utils.ansiFree(str).length;
  },

  ansiFree: (str) => {
    return str.replace(/\x1b[^m]*m/g, "").replace(/\?[rgyobmpcwGR]/g, "");
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
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
    };

    const rx = new RegExp(Object.keys(ent).join("|"), "gi");
    return txt.replace(rx, m => ent[m])
  },

  versionAddRem: (add, rem, hasNotes) => {
    let v = "";

    if ( add === null && rem === null ) {
      v = "?r" + char.unknown;
    }
    else if ( add === null || typeof add === "undefined" ) {
      v = "?r" + char.no;
    }
    else if ( typeof add === "boolean" ) {
      if ( add ) v = (hasNotes ? "?y" : "?g") + char.yes;
      else v = "?r" + char.no;
    }
    else if ( typeof add === "string" ) {
      v = (rem ? "?r" : (hasNotes ? "?y" : "?g")) + add;
      if ( rem ) v += typeof rem === "boolean" ? "-" + char.unknown : "-" + rem;
    }

    return v;
  },

  loadMDN: function() {
    let mdn;
    try {
      mdn = require("../data/data.json");
    }
    catch(err) {
      utils.err(`?r${text.criticalDataFile}?R`);
      process.exit(1);
    }

    return mdn;
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
/*!
  Utils module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const _outBuffer = [];

const utils = {

  /**
   * Flattens the object tree into array (each item = one line):
   * f.ex: mdn["api"]["Blob"]["slice"] => "api.Blob.slice"
   * @returns {Array}
   */
  buildTable: (mdn) => {
    const result = [];

    utils
      .listTopLevels(mdn)
      .filter(key => key !== "browsers")
      .forEach(key => _iterateNode(mdn, key, key));

    function _iterateNode(node, inKey, branch) {
      const subNode = node[inKey];

      if (typeof subNode === "object") {
        Object.keys(subNode).forEach(key => {
          if (key !== "__compat" && key !== "worker_support" && key !== "SharedArrayBuffer_as_param") {
            result.push(branch + "." + key);
            _iterateNode(subNode, key, branch + "." + key); // -> async if stack-overflow problems
          }
        });
      }
    }

    return result
  },

  /**
   * List only the top level start entries for the
   * various branches of the tree.
   * @returns {string[]}
   */
  listTopLevels: (mdn) => {
    let keys = Object.keys(mdn), i = keys.indexOf("browsers");
    if (i >= 0) keys.splice(i, 1);
    return keys
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
    let regex, parts, options = "", endLine = "";
    if (str.startsWith("/")) {
      str = str.substr(1);
      parts = str.split("/");
      str = parts[0];
      options = parts[1]
    }
    else {
      if (fuzzy) {
        str = getFuzzy(str.toLowerCase());
      }
      else {
        if (str.endsWith(".")) {
          str = str.substr(0, str.length - 1);
          endLine = "$"
        }
        if (!str.startsWith("*")) str = "*" + str;
        if (!str.endsWith("*") && !endLine.length) str += "*";
        str = str.split("*").join(".*") + endLine;
      }
    }

    // insensitive search
    if (insensitive && !options.includes("i")) options += "i";

    try {
      regex = new RegExp(str, options);
    }
    catch(err) {
      log("Invalid regular expression:", err.message);
      process.exit(-1);
    }

    function getFuzzy(q) {
      const spec = "\\^$.*+?()[]{}|";
      let chars = [], endLine = "";

      if (q.endsWith(".")) {
        endLine = "$";
        q = q.substr(0, q.length - 1);
      }

      for(let ch of q) chars.push(spec.includes(ch) ? "\\" + ch : ch);

      return chars.join(".*?") + endLine
    }

    return regex
  },

  /**
   * Converts a line path (api.Blob.slice) to the object,
   * in this case for slice.
   * @param mdn
   * @param path
   * @param noChildren - remove child __compat objects
   * @returns {*}
   */
  getPathAsObject: (mdn, path, noChildren) => {
    let parts = path.split("."), obj = mdn;
    parts.forEach(part => {if (obj && obj[part]) obj = obj[part]});

    if (noChildren) {
      Object
        .keys(obj)
        .forEach(key => {
          // todo if interactive mode we'll need a different approach here (copy/reload)
          if (obj && obj[key].__compat) delete obj[key];
        })
    }

    return obj
  },

  nameFromPath: (path) => {
    let last = utils.getExt(path);
    return last.length ? last : path
  },

  getExt: (path) => {
    if (typeof path !== "string") return "";
    let i = path.lastIndexOf(".");
    return i < 0 ? "" : path.substr(++i)
  },

  prePathFromPath: (mdn, path) => {
    let parts = path.split("."), o = mdn, res = "";
    parts.pop();
    parts.forEach(part => {
      if (o) {
        if (o[part].__compat) res += part + ".";
        o = o[part];
      }
    });

    if (res.length < 2) {
      parts = path.split(".");
      parts.pop();
      res = parts.join(".") + "."
    }

    return res.length > 1 ? res : ""
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
    return obj && typeof obj.__compat === "object"
  },

  getBrowserList: () => {
    return  {
      desktop: ["chrome", "edge", "firefox", "ie", "opera", "safari"],
      mobile: ["chrome_android", "edge_mobile", "firefox_android", "opera_android", "safari_ios", "webview_android"],
      ext: ["nodejs", "qq_android", "samsunginternet_android", "uc_android", "uc_chinese_android"]
    }
  },

  getBrowserShortNames: () => {
    return {
      "chrome": "Chrome",
      "edge": "Edge",
      "firefox": "Firefox",
      "ie": "IE",
      "opera": "Opera",
      "safari": "Safari",
      "chrome_android": "Chrome/A",
      "edge_mobile": "Edge/mob",
      "firefox_android": "Firefox/A",
      "opera_android": "Opera/A",
      "safari_ios": "Safari/iOS",
      "webview_android": "Webview/A",
      "nodejs": "Node JS",
      "qq_android": "QQ/A",
      "samsunginternet_android": "Samsung/A",
      "uc_android": "UC/A",
      "uc_chinese_android": "UC-Ch/A"
    }
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
    if (convTags) str = str.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
    return str
  },

  breakAnsiLine: (s, max) => {
    const _max = Math.max(72, max>>>0);
    const _lf = "\n";
    let lines = [];
    let len = 0;
    let lineStart = 0;
    let lastBreak = -1;
    let inAnsi = false;
    let isShort = false;
    let i = 0;
    let ch;

    while(ch = s[i]) {
      if (inAnsi && isShort && !"rgyobmcwGR".includes(ch)) inAnsi = false;

      if (!inAnsi) {
        if (ch === "\x1b" || ch === "?") {
          inAnsi = true;
          isShort = ch === "?"
        }
        else {
          if (ch === " " || ch === _lf) lastBreak = i;

          len++;
          if (len === _max || ch === _lf) {
            if (lastBreak < 0) lastBreak = i;

            lines.push(s.substring(lineStart, lastBreak).trim());
            lineStart = lastBreak;
            lastBreak = -1;
            len = i - lineStart;
          }
        }
      }
      else {
        if (ch === "m" || isShort) inAnsi = false;
      }

      i++
    }

    if (len) {
      lines.push(s.substr(lineStart));
    }

    // A little clean-up
    //lines.forEach((line, i) => {lines[i] = line.trim()});
    lines = lines.filter(line => line.trim());

    return lines.length ? lines.join(lf) : "";
  },

  getMaxLength: list => {
    let max = 0;
    list.forEach(e => {
      let len = (utils.prePathFromPath(e) + utils.nameFromPath(e)).length;
      if (len > max) max = len;
    });
    return max
  },

  ansiLength: (str) => {
    return utils.ansiFree(str).length
  },

  ansiFree: (str) => {
    return str.replace(/\x1b[^m]*m/g, "").replace(/\?[rgyobmcwGR]/g, "")
  },

  entities: (txt) => {
    return txt
      .replace(/&nbsp;/gmi, " ")
      .replace(/&quot;/gmi, "\"")
      .replace(/&amp;/gmi, "&")
      .replace(/&lt;/gmi, "<")
      .replace(/&gt;/gmi, ">");
  },

  versionAddRem: (add, rem) => {
    let v = "";

    if (add === null && rem === null) {
      v = "?r?"
    }
    else if (add === null || typeof add === "undefined") {
      v = "?r-"
    }
    else if (typeof add === "boolean") {
      if (add) v = "?g" + text.yes;
      else v = "?r-";
    }
    else if (typeof add === "string") {
      v = (rem ? "?r" : "?g") + add;
      if (rem) v += typeof rem === "boolean" ? "-?" : "-" + rem;
    }

    return v
  },

  loadMDN: function() {
    let mdn;
    try {
      mdn = require("../data/data.json");
    }
    catch(err) {
      log("Critical error: data file not found. Try running with option --fupdate to download latest snapshot.");
      process.exit(1);
    }

    return mdn
  },

  outInfo: function (txt) {
    if (Array.isArray(txt)) {
      txt = txt.join(lf);
    }
    console.log(txt + ANSI.reset);
  },

  outStore: function (txt, noFile) {
    if (Array.isArray(txt)) txt = txt.join(lf);
    if (noFile || !options.out) {
      console.log(txt);
    }
    else {
      _outBuffer.push(txt);
    }
  }

};

module.exports = utils;
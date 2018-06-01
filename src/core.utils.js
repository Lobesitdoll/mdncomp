/*
  Utils module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const mdn = require("../data/data.json");

const utils = module.exports = {
  /**
   * Flattens the object tree into array (each item = one line):
   * f.ex: mdn["api"]["Blob"]["slice"] => "api.Blob.slice"
   * @returns {Array}
   */
  buildTable: data => {
    const result = [];

    utils
      .listTopLevels()
      .forEach(key => {if (key !== "browsers") _iterateNode(data || mdn, key, key)});

    function _iterateNode(node, inKey, branch) {
      const subNode = node[inKey];
      if (typeof subNode === "object") {
        Object.keys(subNode).forEach(key => {
          if (key !== "__compat") {
            result.push(branch + "." + key);
            _iterateNode(subNode, key, branch + "." + key);
          }
        });
      }
    }

    return result; //.sort()
  },

  /**
   * List only the top level start entries for the
   * various branches of the tree.
   * @returns {string[]}
   */
  listTopLevels: data => {
    let keys = Object.keys(data || mdn), i = keys.indexOf("browsers");
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
   * @param path
   * @param noChildren - remove child __compat objects
   * @returns {*}
   */
  getPathAsObject: (path, noChildren) => {
    let parts = path.split("."), obj = mdn;
    parts.forEach(part => {if (obj && obj[part]) obj = obj[part]});

    if (noChildren) {
      Object.keys(obj).forEach(key => {
        if (obj && obj[key].__compat) delete obj[key];
      })
    }

    return obj
  },

  nameFromPath: path => {
    let last = utils.getExt(path);
    return last.length ? last : path
  },

  getExt: path => {
    if (typeof path !== "string") return "";
    let i = path.lastIndexOf(".");
    return i < 0 ? "" : path.substr(++i)
  },

  prePathFromPath: path => {
    let parts = path.split("."), o = mdn, res = "";
    parts.pop();
    parts.forEach(part => {
      if (o) {
        if (o[part].__compat) res += part + ".";
        o = o[part];
      }
    });

    return res.length > 1 ? res : ""
  },

  /**
   * Check if path points to an object with compatibility
   * information or not.
   * @param path
   * @returns {boolean}
   */
  isCompat: path => {
    let obj = utils.getPathAsObject(path);
    return obj ? typeof obj.__compat === "object" : false
  },

  /**
   * Removes any HTML tags from a string. <code> tags are replaced
   * with ANSI colored text.
   * @param str
   * @param convTags - convert entities for < and > to original form.
   * @param [resetColor=ANSI.reset] - ANSI def. to reset to, if not given "reset" will be used
   * @returns {string}
   */
  cleanHTML: (str, convTags, resetColor) => {
    str = str
      .replace(/<code>/gi, ANSI.cyan)
      .replace(/<\/code>/gi, resetColor || ANSI.reset)
      .replace(/(<([^>]+)>)/ig, "");
    if (convTags) str = str.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
    return str
  },

  breakAnsiLine: (s, max) => {
    let
      lines = [],
      i = 0, len = 0, ch,
      lineStart = 0, lastBreak = -1,
      inAnsi = false,
      _lf = "\n",
      _max = Math.max(72, max>>>0);

    while(ch = s[i]) {
      if (!inAnsi) {
        if (ch === "\x1b") inAnsi = true;
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
        if (ch === "m") inAnsi = false;
      }
      i++
    }

    if (len) lines.push(s.substr(lineStart));

    // A little clean-up
    lines.forEach((line, i) => {lines[i] = line.trim()});

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

  entities: txt => {
    return txt
      .replace(/&nbsp;/gmi, " ")
      .replace(/&quot;/gmi, "\"")
      .replace(/&amp;/gmi, "&")
      .replace(/&lt;/gmi, "<")
      .replace(/&gt;/gmi, ">");
  }


};
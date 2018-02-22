
const ANSI = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    //italic: "\x1b[3m",
    //underline: "\x1b[4m",
    //blink: "\x1b[5m",
    //reverse: "\x1b[7m",
    //hidden: "\x1b[8m",

    //save: "\x1b7",        // doesn't work in PowerShell..
    //restore: "\x1b8",
    clrToCursor: "\x1b[1K", // so clear to cursor, cursor to next line,
    cursorUp: "\x1b[1A",    //   then cursor up..

    black  : "\x1b[30m",
    red    : "\x1b[31m",
    green  : "\x1b[32m",
    yellow : "\x1b[33m",
    blue   : "\x1b[34m",
    magenta: "\x1b[35m",
    cyan   : "\x1b[36m",
    white  : "\x1b[37m"

    //bgBlack: "\x1b[40m",
    //bgRed: "\x1b[41m",
    //bgGreen: "\x1b[42m",
    //bgYellow: "\x1b[43m",
    //bgBlue: "\x1b[44m",
    //bgMagenta: "\x1b[45m",
    //bgCyan: "\x1b[46m",
    //bgWhite: "\x1b[47m"
  },

  lf = "\r\n", yes = "Y", no = "-", yes16 = "✔", no16 = "✘", px8 = "·×·",

  // for update()
  urlPrefix = "https://raw.githubusercontent.com/epistemex/data-for-mdncomp/master/";


/**
 * Center string containing ANSI codes.
 * @param length
 * @returns {string}
 */
String.prototype.centerAnsi = function(length) {
  let
    aLen = this.ansiLength(),
    pad = (length - aLen)>>>1,
    str = (" ".repeat(pad) + this + " ".repeat(pad));
  return " ".substr(0, length - str.ansiLength()) + str
};

/**
 * Get length of string containing ANSI codes
 * @returns {number}
 */
String.prototype.ansiLength = function() {
  return this.replace(/\x1b[^m]*m/g, "").length;
};

/**
 * Flattens the object tree into array (each item = one line):
 * f.ex: api.Blob.slice
 * @returns {Array}
 */
function buildTable() {
  const
    result = [],
    keys = listTopLevels();

  // Iterates over every level in the mdn object
  keys.forEach(key1 => {
    if (key1 !== "__compat") result.push(key1);
    Object.keys(mdn[key1]).forEach(key2 => {
      if (key2 !== "__compat") result.push(key1 + "." + key2);
      Object.keys(mdn[key1][key2]).forEach(key3 => {
        if (key3 !== "__compat") result.push(key1 + "." + key2 + "." + key3);
      });
    });
  });

  return result.sort();
}

/**
 * List only the top level start entries for the
 * various branches of the tree.
 * @returns {string[]}
 */
function listTopLevels() {
  return Object.keys(mdn);
}

/**
 * Creates an RegEx tester from wildcard strings.
 * F.ex. input can be: `*html*toblob*`. `toBlob` is
 * automatically considered to be `*toBlob*` while
 * `to*blob` is: starts with "to" and ends with "blob".
 * @param str
 * @returns {RegExp}
 */
function getComparer(str) {
  if (!str.startsWith("*")) str = "*" + str;
  if (!str.endsWith("*")) str += "*";
  return new RegExp("^" + str.split("*").join(".*") + "$")
}

/**
 * Converts a line path (api.Blob.slice) to the object,
 * in this case for slice.
 * @param path
 * @param noChildren - remove child __compat objects
 * @returns {*}
 */
function getPathAsObject(path, noChildren) {
  let parts = path.split("."), obj = mdn;
  parts.forEach(part => {if (obj && obj[part]) obj = obj[part]});

  if (noChildren) {
    Object.keys(obj).forEach(key => {
      if (obj && obj[key].__compat) delete obj[key];
    })
  }

  return obj
}

function nameFromPath(path) {
  let last = getExt(path);
  return last.length ? last : path
}

function getExt(path) {
  let i = path.lastIndexOf(".");
  return i < 0 ? "" : path.substr(++i)
}

function prePathFromPath(path) {
  let parts = path.split("."), o = mdn, res = "";
  parts.pop();
  parts.forEach(part => {
    if (o) {
      if (o[part].__compat) res += part + ".";
      o = o[part];
    }
  });

  return res.length > 1 ? res : ""
}

/**
 * Check if path points to an object with compatibility
 * information or not.
 * @param path
 * @returns {boolean}
 */
function isCompat(path) {
  let obj = getPathAsObject(path);
  return obj ? typeof obj.__compat !== "undefined" : false
}

/**
 * Removes any HTML tags from a string.
 * @param str
 * @returns {string}
 */
function cleanHTML(str) {
  return str.replace(/(<([^>]+)>)/ig, "")
}

/**
 * Format a long line into several lines based
 * on max char width.
 * @param s
 * @param max
 * @returns {string}
 */
function breakLine(s, max) {
  let
    out = new Output(0),
    _max = Math.max(62, (max>>>0 || 72)),
    line = s.substr(0, _max), i;

  while(line.length === _max) {
    i = line.lastIndexOf(" ");
    if (i < 0) i = _max;
    out.addLine(line.substr(0, i).trim());
    s = s.substr(i);
    line = s.substr(1, _max)
  }
  out.add(line.trim());

  return out.toString()
}

// we'll go char-by-char here, regex can't be used for this afaik..
function indent(txt) {
  let out = "", level = 0;
  for (let ch of txt) {
    if (ch === "," || ch === "{") {
      if (ch === "{") level++;
      out += ch + _nextIndent();
    }
    else if (ch === "}") {
      level--;
      out += _nextIndent() + ch;
    }
    else if (ch === ":") {
      out += ch + " ";
    }
    else out += ch;
  }

  function _nextIndent() {
    return lf + "  ".repeat(level)
  }

  return out
}

function getMaxLength(list) {
  let max = 0;
  list.forEach(e => {
    let len = (prePathFromPath(e) + nameFromPath(e)).length;
    if (len > max) max = len;
  });
  return max
}

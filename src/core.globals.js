
const
  ANSI = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",

    clrToCursor: "\x1b[1K",
    cursorUp: "\x1b[1A",

    black  : "\x1b[30m",
    red    : "\x1b[31m",
    green  : "\x1b[32m",
    yellow : "\x1b[33m",
    blue   : "\x1b[34m",
    magenta: "\x1b[35m",
    cyan   : "\x1b[36m",
    white  : "\x1b[37m"
  },

  lf = "\r\n", yes = "Y", no = "-", yes16 = "✔", no16 = "✘", px8 = "·×·",

  saves = [],
  version = require("../package.json").version,
  args = process.argv,
  log = console.log.bind(console),

  // for update()
  urlPrefix = "https://raw.githubusercontent.com/epistemex/data-for-mdncomp/master/";

let
  mdn,
  options,
  shortPad = 1;

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
 * f.ex: mdn["api"]["Blob"]["slice"] => "api.Blob.slice"
 * @returns {Array}
 */
function buildTable() {
  const result = [];

  listTopLevels()
    .forEach(key => {_iterateNode(mdn, key, key)});

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
}

/**
 * List only the top level start entries for the
 * various branches of the tree.
 * @returns {string[]}
 */
function listTopLevels() {
  return Object.keys(mdn)
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
  let regex, parts, options = "";
  if (str.startsWith("/")) {
    str = str.substr(1);
    parts = str.split("/");
    str = parts[0];
    options = parts[1]
  }
  else {
    if (!str.startsWith("*")) str = "*" + str;
    if (!str.endsWith("*")) str += "*";
    str = "^" + str.split("*").join(".*") + "$";
  }

  try {
    regex = new RegExp(str, options);
  }
  catch(err) {
    log("Invalid regular expression:", err.message);
    process.exit(-1);
  }

  return regex
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
  return obj ? typeof obj.__compat === "object" : false
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

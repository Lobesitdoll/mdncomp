/*
  Browser option module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
 */

const utils = require("./core.utils");
const mdn = utils.loadMDN();

/**
 * List available browser names
 * @returns {string[]}
 */
function listBrowsers() {
  return Object.keys(mdn.browsers)
}

/**
 * This will list release and status information for a *browser* based on the given ID.
 * Using `.` (a single dot) will list all the currently valid IDs:
 * @param {string} browserId
 * @returns {*}
 */
function listBrowser(browserId) {
  const browser = mdn.browsers[browserId];
  const result = [];

  if (!browser) {
    return getBrowserStatusList().includes(browserId)
      ? listBrowserOnStatus(browserId)
      : [`${text.unknownBrowser}: "${browserId}" - ${text.noArgListsId}.`];
  }

  // Get padding width
  let vPad = 0;
  let vPad2 = 0;

  Object
    .keys(browser.releases)
    .forEach(version => {
      let verArr = version.split(".");
      if (verArr[0].length > vPad) {
        vPad = verArr[0].length;
      }
      if (version.length - verArr[0].length > vPad2) {
        vPad2 = version.length - verArr[0].length;
      }
    });

  // Get status padding
  let sList = getBrowserStatusList();
  let sPad = 0;
  sList.forEach(status => {
    if (status.length > sPad) sPad = status.length
  });

  // Show information
  Object
    .keys(browser.releases)
    .sort(_cmp)
    .forEach(version => {
      let
        txt = ANSI.white + (browser.name || browserId) + "  " + ANSI.green + _fBrowserVersion(version, vPad, vPad2),
        date = browser.releases[version].release_date,
        notes = browser.releases[version].release_notes,
        status = browser.releases[version].status;

      txt += "  " + (date ? ANSI.cyan + date : ANSI.gray + "-         ");
      txt += "  " + (status ? _browserStatusColor(status) + status.padEnd(sPad) +
        (options.notes && notes ? "  " + ANSI.reset + notes : "") +
        ANSI.reset + ANSI.white : "-");

      result.push(txt + ANSI.white);
    });

  // to sort complex version numbers using semver, or not.
  function _cmp(a, b) {
    let
      aArr = a.split("."), bArr = b.split("."),
      aNum = (aArr[0]|0) + (aArr[1]|0) * 1e-3 + (aArr[2]|0) * 1e-6 + (aArr[3]|0) * 1e-9,
      bNum = (bArr[0]|0) + (bArr[1]|0) * 1e-3 + (bArr[2]|0) * 1e-6 + (bArr[3]|0) * 1e-9;

    return aNum > bNum ? 1 : (aNum < bNum ? -1 : 0)
  }

  return result
}

function listBrowserOnStatus(status) {
  let
    result = [],
    col = _browserStatusColor(status),
    temp = _iterateBrowsers((o, browser, release, nil, name) => {
      let date = o.release_date;
      return (o.status && o.status === status) ? {
        browser: name || browser,
        version: release,
        notes: o.release_notes,
        date: date ? date : "-"
      } : null;
    });

  // paddings
  let bPad = 0, vPad = 0, vPad2 = 0;
  temp.forEach(o => {
    let verArr = o.version.split(".");
    if (o.browser.length > bPad) bPad = o.browser.length;
    if (verArr[0].length > vPad) vPad = verArr[0].length;
    if (o.version.length - verArr[0].length > vPad2) vPad2 = o.version.length - verArr[0].length;
  });

  // output
  result.push(ANSI.reset + `${text.status.toUpperCase()}: ` + ANSI.reset + ANSI.white + col + status.toUpperCase() + ANSI.reset);
  temp.forEach(o => {
    result.push(
      ANSI.white + o.browser.padEnd(bPad) + ANSI.white +
      "  " + col + _fBrowserVersion(o.version, vPad, vPad2) + ANSI.white + ANSI.dim +
      "  " + (o.date === "-" ? ANSI.gray : ANSI.reset + ANSI.bright + ANSI.cyan) + o.date +
      (options.notes && o.notes && o.notes.length ? "  " + ANSI.reset + o.notes : "") + ANSI.reset
    );
  });

  return result
}

/**
 * List dynamically all unique statuses used by the browser objects.
 * @returns {*} Array (object here due to jsdoc bug in ide).
 */
function getBrowserStatusList() {
  return _iterateBrowsers((o, a, b, result) => result.includes(o.status) ? null : o.status).sort()
}

function _browserStatusColor(txt) {
  switch(txt) {
    case "retired":
      return ANSI.red;
    case "beta":
    case "alpha":
      return ANSI.yellow;
    case "nightly":
      return ANSI.blue;
    case "current":
    case "esr":
      return ANSI.green;
    case "planned":
      return ANSI.magenta;
    default:
      return ANSI.white
  }
}

function _iterateBrowsers(callback) {
  const browsers = mdn.browsers, result = [];

  Object.keys(browsers).forEach(key => {
    let name = browsers[key].name;
    Object
      .keys(browsers[key].releases)
      .forEach(release => {
        let ret = callback(browsers[key].releases[release], key, release, result, name);
        if (ret) result.push(ret);
      })
  });

  return result
}

function _fBrowserVersion(version, padStart, padEnd) {
  let verArr = version.split(".");
  return verArr[0].padStart(padStart) + verArr.join(".").substr(verArr[0].length).padEnd(padEnd)
}

function browsers(_path) {
   let path = typeof _path === "boolean" ? "." : _path;
  if (path === ".") {
    log(ANSI.reset + `${text.valid} ${text.browserIds}:`);
    log(ANSI.green + listBrowsers().join(lf) + ANSI.reset);
    log(lf + `${text.valid} ${text.statuses}:`);
    log(ANSI.green + getBrowserStatusList().join(", "));
  }
  else {
    log(listBrowser(path.toLowerCase()).join(lf));
  }
}

module.exports = browsers;

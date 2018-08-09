/*
  Browser option module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
 */

const utils = require("./core.utils");
const mdn = utils.loadMDN();
const table = loadModule("core.table");

const tblOptions = {
  alignDefault:  "l" ,
  delimiter   : "  ",
  header      : false,
  start       : "?w",
  end         : "?R",
  stringLength: utils.ansiLength
};

function browsers(_path) {
  let path = typeof _path === "boolean" ? "." : _path;
  if (path === ".") {
    log(`?R${text.valid} ${text.browserIds}:`);
    log(`?g${browserKeys().join(lf)}?R`);
    log(lf + `${text.valid} ${text.statuses}:`);
    log(ANSI.green + getBrowserStatusList().join(", "));
  }
  else {
    log(listBrowsers(path.toLowerCase()))
  }
}

/**
 * List available browser names
 * @returns {string[]}
 */
function browserKeys() {
  return Object.keys(mdn.browsers)
}

/**
 * This will list release and status information for a *browser* based on the given ID.
 * Using `.` (a single dot) will list all the currently valid IDs:
 * @param {string} browserId
 * @returns {*}
 */
function listBrowsers(browserId) {
  const browser = mdn.browsers[browserId];
  const tbl = [];

  if (!browser) {
    return getBrowserStatusList().includes(browserId)
      ? listBrowserOnStatus(browserId)
      : [`${text.unknownBrowser}: "${browserId}" - ${text.noArgListsId}.`];
  }

  // version padding
  let vPad = 0;
  Object
    .keys(browser.releases)
    .forEach(version => {
      let verArr = version.split(".");
      if (verArr[0].length > vPad) vPad = verArr[0].length;
    });

  // sort and render
  Object
    .keys(browser.releases)
    .sort(_cmp)
    .forEach(version => {
      const _browser = browser.releases[version];
      const date = _browser.release_date || "-";
      const notes = _browser.release_notes || "";
      const status = _browser.status;

      tbl.push([
        /* name    */  browser.name || browserId,
        /* version */  `?g${padVersion(version, vPad)}`,
        /* date    */  `?c${date}`,
        /* status  */  `${statusColor(status)}${status}`,
        /* notes   */  `?R${options.notes ? notes : ""}`
      ]);
    });

  // sort complex version numbers using semver (or not).
  function _cmp(a, b) {
    const aArr = a.split(".");
    const bArr = b.split(".");
    const aNum = (aArr[0]|0) + (aArr[1]|0) * 1e-3 + (aArr[2]|0) * 1e-6 + (aArr[3]|0) * 1e-9;
    const bNum = (bArr[0]|0) + (bArr[1]|0) * 1e-3 + (bArr[2]|0) * 1e-6 + (bArr[3]|0) * 1e-9;

    return aNum > bNum ? 1 : (aNum < bNum ? -1 : 0)
  }

  return table(tbl, tblOptions)
}

function listBrowserOnStatus(status) {
  const tbl = [];
  const col = statusColor(status);
  const browsers = iterateBrowsers((o, browser, release, nil, name) => {
    return (o.status && o.status === status) ? {
      browser: name || browser,
      version: release,
      notes  : o.release_notes,
      date   : o.release_date || "-"
    } : null;
  });

  // version padding
  let vPad = 0;
  browsers.forEach(o => {
    const major = o.version.split(".", 1)[0] || "";
    vPad = Math.max(vPad, major.length);
  });

  // render
  tbl.push([`?R${text.status.toUpperCase()}?R: ${col}${status.toUpperCase()}?R`]);
  browsers.forEach(o => {
    tbl.push([
      /* browser */  `?w${o.browser}`,
      /* version */  `${col}${padVersion(o.version, vPad)}`,
      /* date    */  `?c${o.date}`,
      /* notes   */  `?R${options.notes && o.notes ? o.notes : ""}`
    ]);
  });

  return table(tbl, tblOptions)
}

/**
 * List dynamically all unique statuses used by the browser objects.
 * @returns {*} Array (object here due to jsdoc bug in ide).
 */
function getBrowserStatusList() {
  return iterateBrowsers((o, a, b, result) => result.includes(o.status) ? null : o.status).sort()
}

function statusColor(status) {
  return {
    "beta"   : "?y",
    "current": "?g",
    "esr"    : "?w",
    "nightly": "?b",
    "planned": "?m",
    "retired": "?G"
  }[ status ] || "?R";
}

function iterateBrowsers(callback) {
  const browsers = mdn.browsers;
  const result = [];

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

function padVersion(version, pad) {
  const arr = version.split(".");
  return arr[0].padStart(pad) + arr.join(".").substr(arr[0].length)
}

module.exports = browsers;

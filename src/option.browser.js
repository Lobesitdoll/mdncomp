/**
 * This will list release and status information for a *browser* based on the given ID.
 * Using `.` (a single dot) will list all the currently valid IDs:
 * @param {string} browserId
 * @returns {*}
 */
function listBrowser(browserId) {
  const
    browser = mdn.browsers[browserId],
    result = [];

  if (!browser) {
    return getBrowserStatusList().includes(browserId)
      ? listBrowserOnStatus(browserId)
      : "Unknown browser-id: '" + browserId + "' - Use '.' to list all valid IDs.";
  }

  // Get padding width
  let vPad = 0, vPad2 = 0;
  Object.keys(browser.releases).forEach(version => {
    let verArr = version.split(".");
    if (verArr[0].length > vPad) vPad = verArr[0].length;
    if (version.length - verArr[0].length > vPad2) vPad2 = version.length - verArr[0].length;
  });

  // Show information
  Object.keys(browser.releases).sort(_cmp).forEach(version => {
    let
      txt = ANSI.white + browserId + "  " + ANSI.green + _fBrowserVersion(version, vPad, vPad2),
      date = browser.releases[version].release_date,
      status = browser.releases[version].status;

    txt += ANSI.white + "  Rel: " + (date ? ANSI.cyan + date : ANSI.gray + "-         ");
    txt += "  " + (status ? _browserStatusColor(status) + status + ANSI.white : "-");

    result.push(txt + ANSI.white);
  });

  // to sort complex version numbers using semver, or not.
  function _cmp(a, b) {
    let
      aArr = a.split("."), bArr = b.split("."),
      aNum = (aArr[0]|0) + (aArr[1]|0) * 0.0001 + (aArr[2]|0) * 0.000001 + (aArr[3]|0) * 0.000000001,
      bNum = (bArr[0]|0) + (bArr[1]|0) * 0.0001 + (bArr[2]|0) * 0.000001 + (bArr[3]|0) * 0.000000001;

    return aNum > bNum ? 1 : (aNum < bNum ? -1 : 0)
  }

  return result
}

function listBrowserOnStatus(status) {
  let
    result = [],
    col = _browserStatusColor(status),
    temp = _iterateBrowsers((o, browser, release) => {
      let date = o.release_date;
      return (o.status && o.status === status) ? {browser: browser, version: release, date: date ? date : "-"} : null;
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
  result.push(ANSI.magenta + "STATUS: " + ANSI.reset + ANSI.white + col + status.toUpperCase() + ANSI.reset);
  temp.forEach(o => {
    result.push(
      ANSI.white + o.browser.padEnd(bPad) + ANSI.white +
      "  " + col + _fBrowserVersion(o.version, vPad, vPad2) + ANSI.white + ANSI.dim +
      "  Rel: " + (o.date === "-" ? ANSI.gray : ANSI.reset + ANSI.bright + ANSI.cyan) + o.date + ANSI.reset
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
  if (txt === "retired")
    return ANSI.red;
  else if (txt === "beta" || txt === "nightly" || txt === "alpha")
    return ANSI.yellow;
  else if (txt === "current" || txt === "esr")
    return ANSI.green;
  else if (txt === "planned")
    return ANSI.magenta;
  return ANSI.white
}

function _iterateBrowsers(callback) {
  const browsers = mdn.browsers, result = [];

  Object.keys(browsers).forEach(key => {
    Object.keys(browsers[key].releases).forEach(release => {
      let ret = callback(browsers[key].releases[release], key, release, result);
      if (ret) result.push(ret);
    })
  });

  return result
}

function _fBrowserVersion(version, padStart, padEnd) {
  let verArr = version.split(".");
  return verArr[0].padStart(padStart) + verArr.join(".").substr(verArr[0].length).padEnd(padEnd)
}
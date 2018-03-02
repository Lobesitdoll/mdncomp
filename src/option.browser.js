/**
 * This will list release and status information for a *browser* based on the given ID.
 * Using `.` (a single dot) will list all the currently valid IDs:
 * @param {string} browserId
 * @returns {*}
 */
function listBrowser(browserId) {
  const
    browser = mdn.browsers[browserId.toLowerCase()],
    result = [];

  if (!browser) {
    return getBrowserStatusList().indexOf(browserId) >= 0
      ? listBrowserOnStatus(browserId)
      : "Unknown browser-id: '" + browserId + "' - Use '.' to list all valid IDs.";
  }

  // Get padding width
  let padding = 0;
  Object.keys(browser.releases).forEach(key => {if (key.length > padding) padding = key.length});

  // Show information
  result.push(ANSI.white + "Browser: " + ANSI.green + browserId);

  Object.keys(browser.releases).sort(_cmp).forEach(key => {
    let
      txt = ANSI.white + "Version: " + ANSI.cyan + key.padStart(padding),
      date = browser.releases[key].release_date,
      status = browser.releases[key].status;

    txt += ANSI.white + "  Released: " + (date ? ANSI.cyan + date : ANSI.gray + "-         ");
    txt += ANSI.white + "  Status: " + (status ? _browserStatusColor(status) : "-");

    result.push(txt + ANSI.white);
  });

  // to sort complex version numbers using semver, or not.
  function _cmp(a, b) {
    let
      aArr = a.split("."), bArr = b.split("."),
      aNum = (aArr[0]|0) + ((aArr[1]|0) * 0.0001) + ((aArr[2]|0) * 0.000001) + ((aArr[3]|0) * 0.000000001),
      bNum = (bArr[0]|0) + ((bArr[1]|0) * 0.0001) + ((bArr[2]|0) * 0.000001) + ((bArr[3]|0) * 0.000000001);

    return aNum > bNum ? 1 : (aNum < bNum ? -1 : 0)
  }

  return result
}

/**
 * List dynamically all unique statuses used by the browser objects.
 * @returns {*} Array (object here due to jsdoc bug in ide).
 */
function getBrowserStatusList() {
  return _iterateBrowsers((o, a, b, result) => {
    return result.indexOf(o.status) < 0 ? o.status : null
  }).sort()
}

function listBrowserOnStatus(status) {
  const result = [];

  status = status.toLowerCase();

  let temp = _iterateBrowsers((o, browser, release) => {
    let date = o.release_date;
    return (o.status && o.status === status) ? {browser: browser, version: release, date: date ? date : "-"} : null;
  });

  // paddings
  let bPad = 0, vPad = 0;
  temp.forEach(o => {
    if (o.browser.length > bPad) bPad = o.browser.length;
    if (o.version.length > vPad) vPad = o.version.length;
  });

  // output
  result.push(ANSI.white + "Status: " + ANSI.green + _browserStatusColor(status));
  temp.forEach(o => {
    result.push(
      ANSI.cyan + o.browser.padEnd(bPad) + ANSI.white +
      "  Version: " + ANSI.yellow + o.version.padStart(vPad) + ANSI.white +
      "  Released: " + (o.date === "-" ? ANSI.gray : ANSI.cyan) + o.date + ANSI.white
    );
  });

  return result
}

function _browserStatusColor(txt) {
  let col = "";
  txt = txt.toUpperCase();
  if (txt === "RETIRED")
    col = ANSI.red;
  else if (txt === "BETA" || txt === "NIGHTLY" || txt === "ALPHA")
    col = ANSI.yellow;
  else if (txt === "CURRENT" || txt === "ESR")
    col = ANSI.green;
  else if (txt === "PLANNED")
    col = ANSI.magenta;
  return col + txt + ANSI.white
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

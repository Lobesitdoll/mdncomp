/**
 * This will list release and status information for a *browser* based on the given ID.
 * Using `.` (a single dot) will list all the currently valid IDs:
 * @returns {Array}
 * @param {string} browserId
 */
function listBrowser(browserId) {
  const
    browser = mdn.browsers[browserId.toLowerCase()],
    result = [];

  if (!browser) {
    log("Unknown browser-id: '" + browserId + "' - Use '.' to list all valid IDs.");
    process.exit(0)
  }

  // Get padding width
  let padding = 0;
  Object.keys(browser.releases).forEach(key => {if (key.length > padding) padding = key.length});

  // Show information
  Object.keys(browser.releases).sort(_cmp).forEach(key => {
    let
      txt = "Version: " + ANSI.cyan + key.padStart(padding),
      date = browser.releases[key].release_date,
      status = browser.releases[key].status;

    txt += ANSI.white + "   Released: " + (date ? ANSI.cyan + date : ANSI.gray + "-         ");
    txt += ANSI.white + "   Status: " + (status ? _status(status) : "-");

    result.push(txt + ANSI.white);
  });

  function _status(txt) {
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

  // to sort complex version numbers using semver, or not.
  function _cmp(a, b) {
    let
      aArr = a.split("."), bArr = b.split("."),
      aNum = (aArr[0]|0) + ((aArr[1]|0) * 0.0001) + ((aArr[2]|0) * 0.000001),
      bNum = (bArr[0]|0) + ((bArr[1]|0) * 0.0001) + ((bArr[2]|0) * 0.000001);

    return aNum > bNum ? 1 : (aNum < bNum ? -1 : 0)
  }

  return result
}

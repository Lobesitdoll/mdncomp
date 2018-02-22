/**
 * Key formatter for ASCII output short-hand format (one line)
 * @param {MDNComp} mdnComp
 * @param shortPad - pad path to equal length
 * @returns {string}
 */
function compatToShort(mdnComp, shortPad) {
  let
    prePath = mdnComp.prePath + mdnComp.name,
    out = new Output(0),
    desktopList = ["chrome", "edge", "firefox", "ie", "opera", "safari"],
    mobileList = ["android", "chrome_android", "firefox_android", "edge_mobile", "opera_android", "safari_ios"],
    desktopShort = ["C:", "E:", "F:", "IE:", "O:", "S:"],
    mobileShort = ["WA:", "CA:", "FA:", "EM:", "OA:", "Si:"];

  if (options.shorthandSplit)
    out.add(prePath, ":", lf);
  else
    out.add((prePath).padEnd(shortPad), ":");

  if (!options.mobile) {
    out.add("%0  DT: ", ANSI.yellow);
    versions(desktopList, desktopShort);
  }

  if (!options.desktop) {
    out.add("%0 MOB: ", ANSI.yellow);
    versions(mobileList, mobileShort);
  }

  function versions(list, shortList) {
    list.forEach((browserId, index) => {
      let browser = mdnComp.getBrowser(browserId), status;
      if (browser) {
        status = browser.info[0].getVersion();
        if (browser.hasNotes()) status += ANSI.white + "*";
      }
      else {
        status = ANSI.red + no;
      }

      out.add(ANSI.green, ANSI.bright, shortList[index], ANSI.white, status, " ");
    });
  }

  // remove last LF
  out.trimEnd(1);

  return out.toString()
}

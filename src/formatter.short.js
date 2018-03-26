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
    mobileList = ["chrome_android", "firefox_android", "edge_mobile", "opera_android", "safari_ios", "android"],
    extList = ["nodejs", "qq_android", "samsunginternet_android", "uc_android", "uc_chinese_android"],
    desktopShort = ["C:", "E:", "F:", "IE:", "O:", "S:"],
    mobileShort = ["CA:", "FA:", "EM:", "OA:", "Si:", "WA:"],
    extShort = ["ND:", "QQ:", "SM:", "UC:", "UCC:"];

  out.add(ANSI.white);

  if (options.shorthandSplit)
    out.add(prePath, ":", lf);
  else
    out.add((prePath).padEnd(shortPad), ":");

  if (!options.mobile) {
    out.add(ANSI.cyan + "  D: ");
    versions(desktopList, desktopShort);
  }

  if (!options.desktop) {
    out.add(ANSI.cyan + "  M: ");
    versions(mobileList, mobileShort);
  }

  if (options.ext) {
    out.add(ANSI.cyan + "  X: ");
    versions(extList, extShort);
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

      out.add(ANSI.green, shortList[index], ANSI.white, status, " ");
    });
  }

  // remove last LF
  out.trimEnd(1);

  return out.toString()
}

/**
 * Key formatter for ASCII output short-hand format (one line)
 * @param {MDNComp} mdnComp
 * @returns {string}
 */
function compatToShort(mdnComp) {
  let
    topLevel = mdnComp.path.indexOf(".") + 1,
    prePath = mdnComp.path.substr(topLevel, mdnComp.path.length - mdnComp.name.length - topLevel) + mdnComp.name,
    out = new Output(0),
    desktopList = ["chrome", "firefox", "edge", "ie", "opera", "safari"],
    mobileList = ["android", "chrome_android", "firefox_android", "edge_mobile", "opera_android", "safari_ios"],
    desktopShort = ["C:", "F:", "E:", "IE:", "O:", "S:"],
    mobileShort = ["A:", "CA:", "FA:", "EM:", "OA:", "SI:"],
    opts = {
      markdown: options.markdown,
      showDesktop: !options.mobile,
      showMobile: !options.desktop,
      showNotes: !options.noNotes,
      notesEnd: !!options.noteend
    };

  out.add(prePath, ":");

  if (opts.showDesktop) {
    out.add("%0  DT: %1", ANSI.fgYellow, ANSI.reset);
    versions(desktopList, desktopShort);
  }

  if (opts.showMobile) {
    out.add("%0  MOB: %1", ANSI.fgYellow, ANSI.reset);
    versions(mobileList, mobileShort);
  }

  function versions(list, shortList) {
    list.forEach((browserId, index) => {
      let browser = mdnComp.getBrowser(browserId), status;
      if (browser) {
        status = browser.info[0].getVersion();
        if (browser.hasNotes()) status += ANSI.fgWhite + "*" + ANSI.reset;
      }
      else {
        status = ANSI.fgRed + no + ANSI.reset;
      }

      out.add(ANSI.fgGreen, ANSI.bright, shortList[index], ANSI.reset, status, " ");
    });
  }

  // remove last LF
  out.trimEnd(1);

  return out.toString()
}

/**
 * Key formatter for ASCII output long format
 * @param {MDNComp} mdnComp
 * @returns {string}
 */
function compatToLong(mdnComp) {
  let
    out = new Output(0),
    desktopList = ["chrome", "edge", "firefox", "ie", "opera", "safari"],
    mobileList = ["chrome_android", "edge_mobile", "firefox_android", "opera_android", "safari_ios", "webview_android"],
    refs = ["°", "¹", "²", "³", "ª", "^", "`", "'", "\"", "'\"", "\"\"", "\"\"'", "º"],
    ref = 0,
    notes = [],
    line = " %0----------+-----------+-----------+-----------+-----------+-----------";

  out.addLine(ANSI.reset);

  // url
  if (options.markdown && mdnComp.url.length) {
    out.addLine(" [`%0%1`](%2) %3" + lf, mdnComp.prePath, mdnComp.name, mdnComp.url, mdnComp.getStatus());
  }
  else {
    out.addLine(" %0%1%2%3%4 %5", ANSI.yellow, mdnComp.prePath, ANSI.cyan, mdnComp.name, ANSI.white, mdnComp.getStatus());
    out.addLine(" ", mdnComp.url ? ANSI.white + mdnComp.url : "-", lf);
  }

  // description TODO We'll let this field mature more before activating.
//  if (mdnComp.description) {
//    out.addLine(breakLine(cleanHTML(mdnComp.description), options.maxWidth), lf)
//  }

  // Show desktop info?
  if (!options.mobile) {
    out.addLine(" %0DESKTOP:", ANSI.yellow);
    out.addLine(" %0Chrome    %1|%0 Edge      %1|%0 Firefox   %1|%0 IE        %1|%0 Opera     %1|%0 Safari%1", ANSI.green, ANSI.white);
    out.addLine(line, ANSI.white);

    //out.add(" ");
    versions(desktopList);
    out.addLine(lf);

    // insert notes
    if (!options.noteend && options.notes && notes.length)
      out.addLine(notes.join(""));

    // reset for next section
    if (!options.noteend) {
      notes = [];
      ref = 0;
    }
  } // :desktop

  // Show mobile info?
  if (!options.desktop) {
    out.addLine(" %0MOBILE:", ANSI.yellow);
    out.addLine(" %0Chrome/A  %1|%0 Edge/mob  %1|%0 Firefox/A %1|%0 Opera/A   %1|%0Safari/iOS | %0Webview/A%1", ANSI.green , ANSI.white);
    out.addLine(line, ANSI.white);

    //out.add(" ");
    versions(mobileList);
    out.addLine(lf);

    if (options.notes && notes.length) out.addLine(notes.join(""));
  } // :mobile

  function versions(list) {
    list.forEach(browserId => {
      let browser = mdnComp.getBrowser(browserId), status;

      if (browser) {
        status = browser.info[0].getVersion();

        if (browser.hasNotes()) {
          status += ANSI.white + (options.notes ? refs[ref] : "*");
          notes.push(browser.getNotes(refs[ref]));
          ref = ++ref % refs.length; // cuz, running out of super chars in UTF8 single bytes...
        }

        if (status === "?")
          status = ANSI.yellow + "?";
      }
      else {
        status = ANSI.red + no;
      } // :if browser

      out.add("%0" + status.centerAnsi(11) + ANSI.white + "|", status.indexOf(no) >= 0 ? ANSI.red : ANSI.cyan);
    }); // :list.feach

    out.trimEnd(1);
  }

  // remove last LF
  out.trimEnd(lf.length);

  return out.toString()
}

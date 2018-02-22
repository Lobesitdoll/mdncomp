/**
 * Key formatter for ASCII output long format
 * @param {MDNComp} mdnComp
 * @returns {string}
 */
function compatToLong(mdnComp) {
  let
    out = new Output(0),
    desktopList = ["chrome", "edge", "firefox", "ie", "opera", "safari"],
    mobileList = ["webview_android", "chrome_android", "edge_mobile", "firefox_android", "opera_android", "safari_ios"],
    refs = ["¹", "²", "³", "ª", "º", "^", "`"],
    ref = 0,
    notes = [],
    opts = {
      desktop: !options.mobile,
      mobile: !options.desktop
    };

  out.addLine(ANSI.reset);
  if (options.markdown && mdnComp.url.length) {
    out.addLine(" [`%0%1`](%2) %3" + lf, mdnComp.prePath, mdnComp.name, mdnComp.url, mdnComp.getStatus());
  }
  else {
    out.addLine(" %0%1%2%3%4 %5", ANSI.yellow, mdnComp.prePath, ANSI.cyan, mdnComp.name, ANSI.white, mdnComp.getStatus());
    out.addLine(" ", mdnComp.url ? mdnComp.url : "-", lf);
  }

  if (opts.desktop) {
    out.addLine(" %0DESKTOP:", ANSI.yellow);
    out.addLine(" %0Chrome    %1|%0 Edge      %1|%0 Firefox   %1|%0 IE        %1|%0 Opera     %1|%0 Safari%1", ANSI.green, ANSI.white);
    out.addLine(" %0----------+-----------+-----------+-----------+-----------+-----------", ANSI.white);

    //out.add(" ");
    versions(desktopList);
    out.addLine(lf);

    // insert notes
    if (!options.noteend && options.notes && notes.length) out.addLine(notes.join(""));

    // reset for next section
    if (!options.noteend) {
      notes = [];
      ref = 0;
    }

  }

  if (opts.mobile) {
    out.addLine(" %0MOBILE:", ANSI.yellow);
    out.addLine(" %0Webview/A %1|%0 Chrome/A  %1|%0 Edge/mob  %1|%0 Firefox/A %1|%0 Opera/A   %1|%0 Safari/iOS", ANSI.green , ANSI.white);
    out.addLine(" %0----------+-----------+-----------+-----------+-----------+-----------", ANSI.white);

    //out.add(" ");
    versions(mobileList);
    out.addLine(lf);

    if (options.notes && notes.length) out.addLine(notes.join(""));
  }

  function versions(list) {
    let prefixList = "";

    list.forEach(browserId => {
      let browser = mdnComp.getBrowser(browserId), status, prefix;

      if (browser) {
        status = browser.info[0].getVersion();
        prefix = browser.hasPrefix();

        if (prefix) {
          if (prefixList.length) prefixList += ", " + browser.info[0].prefix;
          else prefixList = px8 + ") Prefix: " + browser.info[0].prefix;
        }

        if (browser.hasNotes()) {
          status += ANSI.white + (options.notes ? refs[ref] : "*");
          notes.push(browser.getNotes(refs[ref]));
          ref = ++ref % refs.length; // cuz, running out of super chars in UTF8 single bytes...
        }
        else if (browser.hasPrefix())
          status += ANSI.white + px8;

        if (status === "?")
          status = ANSI.yellow + "?";
      }
      else {
        status = ANSI.red + no;
      } // :if browser

      out.add("%0" + status.centerAnsi(11) + ANSI.white + "|", status.indexOf(no) >= 0 ? ANSI.red : ANSI.cyan);
    }); // :list.feach

    if (prefixList.length) notes.unshift(prefixList + lf);

    out.trimEnd(1);
  }

  // remove last LF
  out.trimEnd(lf.length);

  return out.toString()
}

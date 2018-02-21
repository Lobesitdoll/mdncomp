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
    refs = ["¹", "²", "³", "ª", "º", "*", "^", "`", "1", "2", "3", "4", "5"],
    ref = 0,
    notes = [],
    opts = {
      markdown: options.markdown,
      showDesktop: !options.mobile,
      showMobile: !options.desktop,
      showNotes: !options.noNotes,
      notesEnd: !!options.noteend
    };

  out.addLine(ANSI.reset);
  if (options.markdown && mdnComp.url.length) {
    out.addLine(" [`%0%1`](%2) %3" + lf, mdnComp.prePath, mdnComp.name, mdnComp.url, mdnComp.getStatus());
  }
  else {
    out.addLine(" %0%1%2%3%4 %5", ANSI.fgYellow, mdnComp.prePath, ANSI.fgCyan, mdnComp.name, ANSI.reset, mdnComp.getStatus());
    out.addLine(" ", mdnComp.url ? mdnComp.url : "-", lf);
  }

  if (opts.showDesktop) {
    out.addLine(" %0DESKTOP:", ANSI.fgYellow);
    out.addLine(" %0Chrome    %1|%0 Edge      %1|%0 Firefox   %1|%0 IE        %1|%0 Opera     %1|%0 Safari%1", ANSI.fgGreen + ANSI.bright, ANSI.reset);
    out.addLine(" %0----------+-----------+-----------+-----------+-----------+-----------%1", ANSI.fgWhite + ANSI.dim, ANSI.reset);

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

  if (opts.showMobile) {
    out.addLine(" %0MOBILE:", ANSI.fgYellow);
    out.addLine(" %0Webview/A %1|%0 Chrome/A  %1|%0 Edge/mob  %1|%0 Firefox/A %1|%0 Opera/A   %1|%0 Safari/iOS%1", ANSI.fgGreen + ANSI.bright, ANSI.reset);
    out.addLine(" %0----------+-----------+-----------+-----------+-----------+-----------%1", ANSI.fgWhite + ANSI.dim, ANSI.reset);

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
          status += ANSI.fgWhite + (options.notes ? refs[ref] : "*") + ANSI.reset;
          notes.push(browser.getNotes(refs[ref]));
          ref++;
        }
        else if (browser.hasPrefix()) {
          status += ANSI.fgWhite + px8 + ANSI.reset;
        }

        if (status === "?") {
          status = ANSI.fgYellow + "?" + ANSI.reset;
        }
      }
      else {
        status = ANSI.fgRed + no + ANSI.reset;
      }
      out.add("%0" + status.center(11) + "%1" + "|", status.indexOf(no) >= 0 ? ANSI.fgRed : ANSI.fgCyan, ANSI.reset);
    });

    if (prefixList.length) notes.unshift(prefixList + lf);

    out.trimEnd(1);
  }

  // remove last LF
  out.trimEnd(1);

  return out.toString()
}

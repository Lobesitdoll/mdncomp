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
    extList = ["nodejs", "qq_android", "samsunginternet_android", "uc_android", "uc_chinese_android"],
    refs = ["°", "¹", "²", "³", "ª", "^", "`", "'", "\"", "'\"", "\"\"", "\"\"'", "º"],
    line = " %0----------+-----------+-----------+-----------+-----------+-----------",
    ref = 0,
    notes = [];

  out.addLine(ANSI.reset);

  // url
  if (options.markdown && mdnComp.url) {
    out.addLine(" [`%0%1`](%2) %3" + lf, mdnComp.prePath, mdnComp.name, mdnComp.url, mdnComp.getStatus());
  }
  else {
    out.addLine(" %0%1%2%3%4 %5", ANSI.cyan, mdnComp.prePath, ANSI.white, mdnComp.name, ANSI.white, mdnComp.getStatus());
    out.addLine(" ", mdnComp.url ? ANSI.gray + mdnComp.url : "-", lf);
  }

  // description
  if (options.desc && mdnComp.description && mdnComp.description.length) {
    let desc = ANSI.reset + breakAnsiLine(cleanHTML(mdnComp.description), options.maxWidth);
    desc = desc.replace(/&nbsp;/gmi, " ");
    desc = desc.replace(/&quot;/gmi, "\"");
    desc = desc.replace(/&amp;/gmi, "&");
    desc = desc.replace(/&lt;/gmi, "<");
    desc = desc.replace(/&gt;/gmi, ">");
    out.addLine(desc, lf)
  }

  // Show desktop info?
  if (!options.mobile) {
    //out.addLine(" %0DESKTOP:%1", ANSI.reset + ANSI.orange, ANSI.reset);
    out.addLine(" %0Chrome    %1|%0 Edge      %1|%0 Firefox   %1|%0 IE        %1|%0 Opera     %1|%0 Safari%1", ANSI.green, ANSI.gray);
    out.addLine(line, ANSI.gray);

    versions(desktopList);
    out.addLine(lf);

    // insert notes
    if (!options.noteend && options.notes && notes.length)
      out.addLine(ANSI.reset + notes.join(""));

    // reset for next section
    if (!options.noteend) {
      notes = [];
      ref = 0;
    }
  } // :desktop

  // Show mobile info?
  if (!options.desktop) {
    //out.addLine(" %0MOBILE:%1", ANSI.reset + ANSI.orange, ANSI.reset);
    out.addLine(" %0Chrome/A  %1|%0 Edge/mob  %1|%0 Firefox/A %1|%0 Opera/A   %1|%0Safari/iOS %1|%0 %0Webview/A%1", ANSI.green , ANSI.gray);
    out.addLine(line, ANSI.gray);

    versions(mobileList);
    out.addLine(lf);

    if (!options.noteend && options.notes && notes.length)
      out.addLine(ANSI.reset + notes.join(""));
  } // :mobile

  // Show extended info?
  if (options.ext) {
    //out.addLine(" %0OTHERS:%1", ANSI.reset + ANSI.orange, ANSI.reset);
    out.addLine(" %0Node JS   %1|%0 QQ/A      %1|%0 Samsung/A %1|%0 UC/A      %1|%0 UC-Ch/A%1", ANSI.green , ANSI.gray);
    out.addLine(line.substr(0, line.length - 12), ANSI.gray);

    versions(extList);
    out.addLine(lf);

    if (options.notes && notes.length) out.addLine(ANSI.reset + notes.join(""));
  } // :ext

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

      out.add("%0" + status.centerAnsi(11) + ANSI.gray + "|", status.indexOf(no) >= 0 ? ANSI.red : ANSI.cyan);
    }); // :list.feach

    out.trimEnd(1);
  }

  // remove last LF
  out.trimEnd(lf.length);

  return out.toString()
}

/**
 * Key formatter for ASCII output long format
 * @param {MDNComp} mdnComp
 * @param noHeader
 * @param sepChar
 * @returns {string}
 */
function compatToLong(mdnComp, noHeader, sepChar = "|") {
  let
    out = new Output(0),
    desktopList = ["chrome", "edge", "firefox", "ie", "opera", "safari"],
    mobileList = ["chrome_android", "edge_mobile", "firefox_android", "opera_android", "safari_ios", "webview_android"],
    extList = ["nodejs", "qq_android", "samsunginternet_android", "uc_android", "uc_chinese_android"],
    refs = ["°", "¹", "²", "³", "ª", "^", "`", "'", "\"", "'\"", "\"\"", "\"\"'", "º"],
    line = " %0----------+-----------+-----------+-----------+-----------+-----------".replace(/\+/g, sepChar),
    ref = 0,
    notes = [];

  out.addLine(ANSI.reset);

  // url
  if (!noHeader) {
    if (options.markdown && mdnComp.url) {
      out.addLine(" [`%0%1`](%2) %3", mdnComp.prePath, mdnComp.name, mdnComp.url, mdnComp.getStatus());
    }
    else {
      out.addLine(" %0%1%2%3%4 %5", ANSI.cyan, mdnComp.prePath, ANSI.white, mdnComp.name, ANSI.white, mdnComp.getStatus());
      out.addLine(" ", mdnComp.url ? ANSI.gray + mdnComp.url : "-");
    }

    // short title
    if (mdnComp.short && mdnComp.short.length) {
      let short = entities(ANSI.reset + " " + breakAnsiLine(cleanHTML(mdnComp.short), options.maxWidth));
      out.addLine(short, lf)
    }
    else out.addLine();

    // description
    if (options.desc && mdnComp.description && mdnComp.description.length) {
      let desc = entities(ANSI.reset + breakAnsiLine(cleanHTML(mdnComp.description), options.maxWidth));
      out.addLine(desc, lf)
    }
  }
  else {
    // workers' status
    let wStat = mdnComp.getStatus();
    if (wStat.length) out.addLine(wStat.substring(1, wStat.length - 1) + lf);
  }

  // Show desktop info?
  if (!options.mobile) {
    //out.addLine(" %0DESKTOP:%1", ANSI.reset + ANSI.orange, ANSI.reset);
    out.addLine(" %0Chrome    %1|%0 Edge      %1|%0 Firefox   %1|%0 IE        %1|%0 Opera     %1|%0 Safari%1", ANSI.white, ANSI.gray);
    out.addLine(line, ANSI.gray);

    versions(desktopList);
    out.addLine(lf);

    // insert notes
    if (!options.noteend && options.notes && notes.length)
      out.addLine(ANSI.yellow + notes.join(""));

    // reset for next section
    if (!options.noteend) {
      notes = [];
      ref = 0;
    }
  } // :desktop

  // Show mobile info?
  if (!options.desktop) {
    //out.addLine(" %0MOBILE:%1", ANSI.reset + ANSI.orange, ANSI.reset);
    out.addLine(" %0Chrome/A  %1|%0 Edge/mob  %1|%0 Firefox/A %1|%0 Opera/A   %1|%0Safari/iOS %1|%0 %0Webview/A%1", ANSI.white , ANSI.gray);
    out.addLine(line, ANSI.gray);

    versions(mobileList);
    out.addLine(lf);

    if (!options.noteend && options.notes && notes.length)
      out.addLine(ANSI.yellow + notes.join(""));
  } // :mobile

  // Show extended info?
  if (options.ext) {
    //out.addLine(" %0OTHERS:%1", ANSI.reset + ANSI.orange, ANSI.reset);
    out.addLine(" %0Node JS   %1|%0 QQ/A      %1|%0 Samsung/A %1|%0 UC/A      %1|%0 UC-Ch/A%1", ANSI.white , ANSI.gray);
    out.addLine(line.substr(0, line.length - 12), ANSI.gray);

    versions(extList);
    out.addLine(lf);

    if (options.notes && notes.length) out.addLine(ANSI.yellow + notes.join(""));
  } // :ext

  // worker support ?
  if (options.workers && mdnComp.workers) {
    out.addLine(ANSI.cyan + "WEB WORKER SUPPORT:");
    out.add(compatToLong(mdnComp.workers, true) + lf)
  }

  // SharedArrayBuffer as param support ?
  if (options.sab && mdnComp.sharedAB) {
    out.addLine(ANSI.cyan + "SHAREDARRAYBUFFER AS PARAM SUPPORT:");
    out.add(compatToLong(mdnComp.sharedAB, true) + lf)
  }

  // Show specifications?
  if (options.specs && mdnComp.specs && mdnComp.specs.length) {
    out.addLine(ANSI.cyan + "SPECIFICATIONS:" + lf);
    mdnComp.specs.forEach(spec => {
      out.addLine(ANSI.white + `${entities(spec.name)}${lf}  ${getSpecStatus(spec.status)}  ${spec.url}`);
    });
    out.addLine();
  } // :specs

  function getSpecStatus(status) {
    switch(status.toUpperCase()) {
      case "REC":
        return ANSI.green + "Recommendation" + ANSI.reset + lf;
      case "PR":
        return ANSI.yellow + "Proposed Recommendation" + ANSI.reset + lf;
      case "CR":
        return ANSI.cyan + "Candidate Recommendation" + ANSI.reset + lf;
      case "RC":
        return ANSI.cyan + "Release Candidate" + ANSI.reset + lf;
      case "WD":
        return ANSI.blue + "Working Draft" + ANSI.reset + lf;
      case "ED":
        return ANSI.green + "Editor's Draft" + ANSI.reset + lf;
      case "OLD-TRANSFORMS":
        return ANSI.orange + "This has been merged in another draft." + ANSI.reset + lf;
      case "LIVING":
        return ANSI.cyan + "Living Standard" + ANSI.reset + lf;
      case "RFC":
        return ANSI.yellow + "IETF RFC" + ANSI.reset + lf;
      case "STANDARD":
        return ANSI.green + "Standard" + ANSI.reset + lf;
      case "DRAFT":
        return ANSI.yellow + "Draft" + ANSI.reset + lf;
      case "OBSOLETE":
        return ANSI.red + "Obsolete" + ANSI.reset + lf;
      case "LC":
        return ANSI.yellow + "Last Call Working Draft" + ANSI.reset + lf;
      default:
        return ANSI.yellow + status + ANSI.reset + lf
    }
  }

  function versions(list) {
    list.forEach(browserId => {
      let browser = mdnComp.getBrowser(browserId), status;

      if (browser) {
        status = browser.info[0].getVersion();

        if (browser.hasNotes()) {
          status += ANSI.yellow + (options.notes ? refs[ref] : "*");
          notes.push(browser.getNotes(refs[ref]));
          ref = ++ref % refs.length; // cuz, running out of super chars in UTF8 single bytes...
        }

        if (status === "?")
          status = ANSI.yellow + "?";
      }
      else {
        status = ANSI.red + no;
      } // :if browser

      out.add("%0" + status.centerAnsi(11) + ANSI.gray + "|", status.indexOf(no) >= 0 ? ANSI.red : ANSI.green);
    }); // :list.feach

    out.trimEnd(1);
  }

  // remove last LF
  out.trimEnd(lf.length);

  return out.toString()
}

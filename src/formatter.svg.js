/**
 *
 * @param mdnComp
 */
function compatToSVG(mdnComp) {
  // todo refactoring...
  const
    svgDefs = require("./svgdefs"),
    out = new Output(),
    desktopList = ["chrome", "edge", "firefox", "ie", "opera", "safari"],
    mobileListIcons = ["android", "chrome,android", "edge", "firefox,android", "opera,android", "safari"],

    desktopDesc = ["Chrome", "Edge", "Firefox", "IE", "Opera", "Safari"],
    mobileDesc = ["Webview for Android", "Chrome for Android", "Edge for mobile", "Firefox for Android", "Opera for Android", "Safari for iOS"],

    mobileList = ["webview_android", "chrome_android", "edge_mobile", "firefox_android", "opera_android", "safari_ios"],
    opts = {
      desktop: !options.mobile,
      mobile: !options.desktop,
      showNotes: !options.noNotes
    },
    col1 = 0, //200,
    w = options.width,
    isMob = opts.mobile,
    isDesk = opts.desktop,
    col2w = w - col1,
    colM = isMob && isDesk ? col2w / 2 + col1 : col1,
    cols = isMob && isDesk ? 12 : 6,
    step = col2w / cols,
    indent = 20,
    iconSize = 20,
    colIcon = "#676769",
    colYes = "#E4F7E1",
    colNo = "#FBE3E3",
    col1h = 50, col2h = 45;

  let
    notes = [],
    ref = 0,
    statusX = 1,
    h = col1h + col2h * 2,
    i, x;

  out.add("<svg xmlns=\"http://www.w3.org/2000/svg\" %1width=\"%0\">", options.width, mdnComp.url.length ? "xmlns:xlink=\"http://www.w3.org/1999/xlink\" " : "");

  out.add("<!-- Made by mdncomp v. " + version + " -->");

  if (opts.desktop || opts.mobile) {
    addSymbol("chrome", svgDefs.chrome);
    addSymbol("firefox", svgDefs.firefox);
    addSymbol("edge", svgDefs.edge);
    addSymbol("opera", svgDefs.opera1, svgDefs.opera2);
    addSymbol("ie", svgDefs.ie);
    addSymbol("safari", svgDefs.safari);
  }

  if (opts.desktop) {
    addSymbol("desktop", svgDefs.desktop);
  }

  if (opts.mobile) {
    addSymbol("mobile", svgDefs.mobile);
    addSymbol("android", svgDefs.android1, svgDefs.android2);
  }

  if (mdnComp.hasFlags())
    addSymbol("flag", svgDefs.flag1, svgDefs.flag2, svgDefs.flag3);

  if (mdnComp.standard)
    addSymbol("html5", svgDefs.html5);

  if (mdnComp.deprecated)
    addSymbol("thumb", svgDefs.thumb);

  if (mdnComp.experimental)
    addSymbol("lab", svgDefs.lab);

  if (mdnComp.url.length)
    addSymbol("link", svgDefs.link1, svgDefs.link2);

  /*------------------------------------------------------------------------------------------------------------------*

      CONTENT

  *------------------------------------------------------------------------------------------------------------------*/

  // Header
  if (mdnComp.url.length) {
    out.add("<a xlink:href=\"%0\" style=\"cursor:pointer\" target=\"_blank\">", mdnComp.url);
    text2(mdnComp.prePath, mdnComp.name, 1, 46, 26);
    use("link", w - 28, 26, 24, 24, "#777");
    out.add("</a>");
  }
  else {
    text2(mdnComp.prePath, mdnComp.name, indent, 50, 32);
  }

  // status
  if (mdnComp.deprecated) status("thumb", "Deprecated", 24, "#a00");
  if (mdnComp.experimental) status("lab", "Experimental", 0, "#c70");
  if (mdnComp.standard) status("html5", "On standard track", 0, "#070");

  // link
  //if (mdnComp.url.length) link(mdnComp.url, mdnComp.url, indent + 2, 92, mdnComp.url.length > 90 ? 16 : 18);

  // Content
  out.add("<g transform=\"translate(0, 104)\">");

  // Draw background
  rect(0, 0, w, h, "#eaedf2");

  // Draw status boxes
  if (opts.desktop) {
    versions(desktopList, desktopDesc, col1, col1h + col2h)
  }

  if (opts.mobile) {
    versions(mobileList, mobileDesc, colM, col1h + col2h)
  }

  // Draw grid
  for(x = col1; x < w; x += step) {
    line(x|0, col1h, x|0, h, 1, "#999");
  }

  if (col1) line(col1, 0, col1, h, 2);
  if (isMob) line(colM, 0, colM, h, 2);

  line(col1, col1h, w, col1h, 2);
  line(0, col1h + col2h, w, col1h + col2h, 1);
  line(0, h, w, h, 2);


  // text
  //text(mdnComp.name, 7, col1h + col2h + 28);

  // Fill in icons
  if (isDesk) {
    use("desktop", ((isMob ? col2w / 2 : col2w) - iconSize) / 2 + col1,
                   ((col1h - iconSize) / 2),
                   iconSize, iconSize);
    for(i = 0, x = col1; i < desktopList.length; i++) {
      use(desktopList[i],
          x + step * i + (step- iconSize) / 2,
          col1h + (col2h - iconSize) / 2, iconSize, iconSize, colIcon, desktopDesc[i]);
    }
  }

  if (isMob) {
    use("mobile", ((isDesk ? col2w / 2 : col2w) - iconSize) / 2 + colM,
                  (col1h - iconSize) / 2,
                  iconSize, iconSize);

    for(i = 0, x = colM; i < mobileListIcons.length; i++) {
      let lst = mobileListIcons[i].split(",");
      lst.forEach((icon, t) => {
        use(icon, (lst.length === 2 ? (t ? 1.5 : -1.5) : 0) + x + t * iconSize + step * i + (step - iconSize * lst.length) / 2,
                   col1h + (col2h - iconSize) / 2,
                   iconSize, iconSize, colIcon, mobileDesc[i]);
      })
    }
  }

  // insert notes
  if (options.notes && notes.length) {
    h += 16;
    notes.forEach((note) => {
      textFmt(note, w - indent * 2)
    });
  }

  h += 45;
  text("Data from MDN - \"npm i -g mdncomp\" by epistemex © 2018.", 1, h, 14, true, "#777");

  // close
  out.add("</g></svg>");

  /*------------------------------------------------------------------------------------------------------------------*

      Helpers

  *------------------------------------------------------------------------------------------------------------------*/

  function versions(list, desc, offset, y) {
    options.maxWidth = (w - 60) / 8;
    list.forEach((browserId, index) => {
      let
        browser = mdnComp.getBrowser(browserId), status, refMark, flags, prefix,
        x = offset + step * index,
        tx = x + step * 0.5;

      if (browser) {
        flags = browser.hasFlags();
        prefix = browser.hasPrefix();
        status = browser.info[0].getVersion().replace("Y", yes16);
        if (browser.hasNotes()) {
          refMark = options.notes ? ++ref : "*";
          let txt = browser.getNotes(ref);
          txt = (txt+"").ansiFree().replace(/</g, "&lt;").replace(/>/g, "&gt;");
          notes.push(txt);
        }
      }
      else {
        status = no;
      }

      rect(x, y, step, col2h, status.indexOf("-") >= 0 ? colNo : (status === "?" ? "#eaedf2" : colYes));

      if (status === "-")
        text(no16, tx, y + 28, 0, 0, "#c55", "middle");
      else
        text(status, tx, y + 28, w < 800 ? 12 : 0, 0, status.indexOf("-") < 0 && status.indexOf("?") < 0 ? "#070" : "#000", "middle");

      if (refMark)
        text(refMark, x + step - 12, y + 13, 10, "#000", "end");

      if(flags)
        use("flag", x + 5, y + 5, 10, 10, "#555");

      if (prefix)
        text(browser.prefix, x + 5, y + 41, 12, false, "#334"); // w < 640 ? y + 40 : y + 13 if low on space
    });

  }

  function status(icon, txt, size, color) {
    size = size || 14;
    let y = 69;
    if (icon) {
      use(icon, statusX, y + (size === 14 ? 2 : 1), size, size, color);
      statusX += 20;
    }
    text(txt, statusX, y + 15, 16, true, color);
    statusX += 110;
  }

  function line(x1, y1, x2, y2, lw, col) {
    if (lw / 2 !== (lw>>>1)) {
      x1 += 0.5; y1 += 0.5; x2 += 0.5; y2 += 0.5;
    }
    out.add("<line x1=\"%0\" y1=\"%1\" x2=\"%2\" y2=\"%3\"  stroke=\"%5\" stroke-width=\"%4\" />", x1, y1, x2, y2, (lw || 1), col ? col : "#000")
  }

  function rect(x, y, w, h, bgCol, title) {
    out.add("<rect x=\"%0\" y=\"%1\" width=\"%2\" height=\"%3\" fill=\"%4\"%5 />", x, y, w, h, bgCol, title ? " title=\"" + title + "\"" : "")
  }

  function text(txt, x, y, size, sans, color, align) {
    align = align ? " text-anchor=\"" + align + "\" " : "";
    out.add("<text x=\"%1\" y=\"%2\" fill=\"%5\" %6font-family=\"%4\" font-size=\"%3\">%0</text>", txt, x, y, size||16, sans ? "sans-serif" : "Consolas, monospace", color ? color : "#000", align)
  }

  function text2(txt1, txt2, x, y, size) {
    out.add("<text x=\"%2\" y=\"%3\" font-family=\"Consolas, monospace\" font-size=\"%4\"><tspan fill=\"#777\">%0</tspan><tspan fill=\"#000\">%1</tspan>", txt1, txt2, x, y, size||16);
    out.add("</text>");
  }

  function link(txt, url, x, y, size) {
    out.add("<a xlink:href=\"%0\" style=\"cursor:pointer\">", url);
    text(txt, x , y + size * 1.25, size, true);
    out.add("</a>");
  }

  function textFmt(txt) {
    let parts = txt.split(lf), res = new Output();
    parts.forEach(part => {
      res.add("<tspan x=\"%0\" dy=\"1.3em\">", indent);
      res.add(part);
      res.add("</tspan>");
    });

    text(res.toString(), 10, h, 14);
    h += parts.length * 15;
  }

  function use(name, x, y, width, height, col, desc) {
    col = col ? " fill=\"" + col + "\"" : "";
    if (desc) out.add("<g><title>%0</title>", desc);
    if (arguments.length > 3) {
      out.add("<use href=\"#icon-%0\" x=\"%1\" y=\"%2\" width=\"%3\" height=\"%4\"%5></use>", name, x, y, width, height, col)
    }
    else {
      out.add("<use href=\"#icon-%0\" width=\"%1\" height=\"%2\"%3></use>", name, x, y, col)
    }
    if (desc) out.add("</g>");
  }

  function addSymbol(name, data) {
    out.add("<symbol id=\"icon-%0\" viewBox=\"-1 -1 34 34\">", name);
    for(let i = 1; i < arguments.length; i++) out.add("<path d=\"%0\"></path>", arguments[i]);
    out.add("</symbol>")
  }

  return out.toString()
}
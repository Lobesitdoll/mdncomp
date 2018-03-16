
function getDoc(url) {

  let
    clr = ANSI.clrToCursor + ANSI.cursorUp,
    cached = io.getCached(url);

  if (cached && !options.docforce) {
    log();
    parse(cached);
  }
  else {
    log(ANSI.green + "Fetching documentation...");

    // removes redirect
    let langUrl = url.replace("mozilla.org/", "mozilla.org/" + isoLang + "/");

    io.request(langUrl,
      () => !clrLine(),
      pct => {
        let width = 50, prog = Math.round(width * pct),
          rem = width - prog;
        log(clr + ANSI.white + "Downloading doc " + ANSI.white + "[" + ANSI.green + "#".repeat(prog) + " ".repeat(rem) + ANSI.white + "]" + ANSI.reset + ANSI.black);
      },
      data => {
        // extract article from article top to example
        const start = "<article id=\"wikiArticle\">", end = "</article>";
        let
          i1 = data.indexOf(start),
          i2 = data.indexOf(end, i1 + start.length),
          i3;

        if (i1 < 0 || i2 < 0) {
          log(ANSI.red + "Warning: Could not parse the doc page." + ANSI.reset + lf);
          return
        }

        // scope out article
        data = data.substring(i1 + start.length, i2 - 1);

        // get rid of Example(s) if any
        i3 = data.indexOf("id=\"Example");
        if (i3 >= 0) data = trimArticle(data, i3);

        // get rid of BCD if any
        i3 = data.indexOf("id=\"Browser_compatibility");
        if (i3 >= 0) data = trimArticle(data, i3);

        //get rid of specifications if any
        i3 = data.indexOf("id=\"Specification");
        if (i3 >= 0) data = trimArticle(data, i3);

        // save to cache
        io.setCached(url, data);

        // parse
        parse(data)
      },
      err => logErr(lf + "An error occurred -" + lf + "Status code: " + err.statusCode + (err.error ? lf + "Message: " + err.error : "") + ANSI.reset));

    function trimArticle(data, endPos) {
      return data.substr(0, endPos - (endPos - data.lastIndexOf("<", endPos)));
    }

    function logErr(txt) {
      log(clr + ANSI.red + txt + ANSI.white)
    }
  }

  function clrLine() {
    log(clr + ("").padStart(options.maxChars, " "));
  }

  function parse(data) {
    clrLine();
    log(ANSI.cursorUp + ANSI.cursorUp);

    let str = ANSI.reset + data, _lf = "#LF#", inPre = false;

    // convert
    let
      preLine = ANSI.blue + "-".repeat(options.maxChars - 1),
      optional = false;
    const
      rxPre = /=.*brush:\s?(html|css)/i,
      rxOptional = /.*class=.*optionalInline/i,
      rxNote = /.*class=.*(experimental|deprecated)/i;

    //tagParser.skip = false;
    function testTag(str, rx, tag) {
      return rx.test(str.substring(tag.tagStart, tag.tagEnd))
    }

    str = tagParser(str, e => {
      switch(e.name) {
        case "div":
          if (testTag(str, rxNote, e)) tagParser.skip = true;
          return "";
        case "/div":
          if (!inPre) tagParser.skip = false;
          return "";
        case "span":
          if (testTag(str, rxOptional, e)) optional = true;
          return optional ? ANSI.white + " (" + ANSI.green : "";
        case "/span":
          let resSpan = "";
          if (!inPre && optional) {
            optional = false;
            resSpan = ANSI.white + ") " + ANSI.reset;
          }
          return resSpan;
        case "ul":
        case "br":
        case "/p":
          return _lf;
        case "h2":
        case "h3":
          return _lf + ANSI.yellow;
        case "/h2":
        case "/h3":
        case "/dt":
        case "/dd":
        case "/li":
          return ANSI.reset + _lf;
        case "pre":
          inPre = true;
          if (testTag(str, rxPre, e)) tagParser.skip = true;
          return tagParser.skip ? "" : preLine + ANSI.cyan + _lf;
        case "code":
          return ANSI.cyan;
        case "/pre":
          let res = tagParser.skip ? "" : _lf + preLine + ANSI.reset + _lf;
          inPre = tagParser.skip = false;
          return res;
        case "/code":
          return ANSI.reset;
        case "dt":
          return ANSI.white;
        case "dd":
        case "li":
          return ANSI.white + "-" + ANSI.reset + " ";
        default:
          return ""
      }
    }, ch => {
      return inPre && ch === "\n" ? _lf : ch
    });

    // entities
    str = str.replace(/&nbsp;/gmi, " ");
    str = str.replace(/&quot;/gmi, "\"");
    str = str.replace(/&lt;/gmi, "<");
    str = str.replace(/&gt;/gmi, ">");

    // white space
    str = str.replace(/\n\s*\n/gmi, "");

    // placeholders
    str = str.replace(new RegExp(_lf, "gm"), lf);

    // hackish solution to get rid of empty lines in pre... todo improve..
    str = str.replace(lf + lf + ANSI.blue + "-------", lf + ANSI.blue + "-------");

    let lines = str.split(lf);
    str = "";
    lines.forEach(line => {
      str += breakAnsiLine(line.replace(/\s\s+/g, " ").trim(), options.maxChars).trim() + lf;
    });

    str = ANSI.blue + "DOCUMENTATION EXCERPT" + ANSI.reset + lf + lf + str.trim() + lf;

    log(str);
  }
}
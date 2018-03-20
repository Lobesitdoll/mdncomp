
function getDoc(url, callback) {

  let
    clr = ANSI.clrToCursor + ANSI.cursorUp,
    cached = io.getCachedData(url);

  if (cached && !options.docforce) {
    log();
    format(cached);
  }
  else {
    log(ANSI.green + "Fetching documentation...");

    // removes redirect
    let langUrl = url.replace("mozilla.org/", "mozilla.org/" + isoLang + "/");

    io.request(langUrl,
      () => !clrLine(),
      pct => {
        let
          width = 50,
          prog = Math.round(width * pct),
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

        // parse
        parse(data)
      },
      err => {
        logErr(lf + "An error occurred -" + lf + "Status code: " + err.statusCode + (err.error ? lf + "Message: " + err.error : "") + ANSI.reset);
        callback();

      }, {"Range": "bytes=16384-"});

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

    let str = ANSI.reset + data, _lf = "#LF#", inPre = false, indent = 0;

    // tabs need to go, we'll use tabs for tables later (if any)
    str = str.replace(/\t/gm, " ");

    // convert
    let
      preLine = "--LINE--",
      optional = false;
    const
      //rxPre = /=.*brush:\s?(html|css)/i,
      rxPre = /=.*brush:\s?(html)/i,
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
        case "table":
          tagParser.skipLF = true;
          return ANSI.gray + preLine + ANSI.reset + _lf;
        case "/table":
          tagParser.skipLF = false;
          return ANSI.gray + preLine + ANSI.reset + _lf;
//        case "iframe":
//          tagParser.skip = true;
//          return "";
        case "math":
          tagParser.skip = true;
          return ANSI.blue + " --math formula not shown--" + ANSI.reset;
        case "/math":
//        case "/iframe":
          tagParser.skip = false;
          return "";
        case "/th":
        case "/td":
          return "\t";
        case "/tr":
          return _lf;
        case "dl":
        case "ul":
          tagParser.skipLF = true;
          return _lf;
        case "/dl":
        case "/ul":
          tagParser.skipLF = false;
          return "";
        case "br":
        case "/p":
          return _lf;
        case "h2":
        case "h3":
          return _lf + ANSI.yellow;
        case "/h2":
        case "/h3":
        case "/dt":
          return ANSI.reset + _lf;
        case "/dd":
        case "/li":
          indent--;
          return ANSI.reset + _lf;
        case "pre":
          inPre = true;
          if (testTag(str, rxPre, e)) tagParser.skip = true;
          return tagParser.skip ? "" : ANSI.blue + preLine + ANSI.cyan + _lf;
        case "/pre":
          let res = tagParser.skip ? "" : _lf + ANSI.blue + preLine + ANSI.reset + _lf;
          inPre = tagParser.skip = false;
          return res;
        case "code":
          return ANSI.cyan;
        case "/code":
          return ANSI.reset;
        case "dt":
          return ANSI.white + "*".repeat(Math.max(0, indent + 1)) + ANSI.reset + " ";
        case "dd":
        case "li":
          indent++;
          return ANSI.white + "-".repeat(Math.max(0, indent)) + ANSI.reset + " ";
        default:
          return ""
      }
    }, ch => {
      return inPre && ch === "\n" ? _lf : ch
    });

    // entities
    str = str.replace(/&nbsp;/gmi, " ");
    str = str.replace(/&quot;/gmi, "\"");
    str = str.replace(/&amp;/gmi, "&");
    str = str.replace(/&lt;/gmi, "<");
    str = str.replace(/&gt;/gmi, ">");

    // white space
    str = str.replace(/\n\s*\n/gmi, "");

    // placeholders
    str = str.replace(new RegExp(_lf, "gm"), lf);

    // hackish solution to get rid of empty lines in pre... todo improve..
    str = str.replace(lf + lf + ANSI.blue + preLine, lf + ANSI.blue + preLine);

    // mark data as parsed:
    str = "#" + str;

    // save to cache
    io.setCachedData(url, str);

    // format output
    format(str);
  }

  function format(str) {

    if (!str.startsWith("#")) { // for transition from old html format to pre-parsed format
      parse(str);               // todo cache upgrade can be a one-time part of --update process
      return;
    }

    str = str.substr(1);

    // pre-lines
    let preLine = "-".repeat(options.maxChars - 1);
    str = str.replace(/--LINE--/gm, preLine);

    let lines = str.split(lf), tabLen = -1;
    str = "";
    lines.forEach((line, i) => {
      let rxWS = /\s\s+/g;

      // table? get max in 1. column
      if (tabLen < 0 && line.includes("\t")) {
        let y, l;
        for(y = i; y < lines.length; y++) {
          l = lines[y];
          if (!l.includes("\t")) break;
          l = l.split("\t")[0].trim();
          if (l.length > tabLen) tabLen = l.length
        }
        tabLen++;
      }

      if (line.includes("\t")) {
        let l = line.split("\t");
        line = ANSI.white + (l[0].trim().padEnd(tabLen) + ANSI.reset + (l[1].trim() || ""));
        rxWS = "x79y"
      }
      else if (tabLen > 0) tabLen = -1; // ready for next table

      str += breakAnsiLine(line.replace(rxWS, " ").trim(), options.maxChars).trim() + lf;
    });

    // check for draft version
    // check for obsolete version
    markTop("Draft", ANSI.yellow);
    markTop("Obsolete", ANSI.red);

    function markTop(keyword, color) {
      let draft = "", i = str.indexOf(keyword), kl = keyword.length;
      if (i >= 0 && i < 10) {
        i = (options.maxChars - kl - 2)>>1;
        draft = ANSI.red + "/".repeat(i - 1) + color + " " + keyword.toUpperCase() + " " + ANSI.red + "/".repeat(i) + ANSI.reset + lf;
        str = draft + str.substr(i + kl + 1);
      }
    }

    // headers
    //str = str.replace(ANSI.yellow + "Syntax" + ANSI.reset + lf, ANSI.yellow + "SYNTAX" + ANSI.reset + lf);

    str = ANSI.reset + str.trim() + lf;
    //str = ANSI.blue + "DOCUMENTATION EXCERPT" + ANSI.reset + lf + lf + str.trim() + lf;

    outStore(str);
    callback();
  }
}
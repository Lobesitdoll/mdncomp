
/*
  TagParser (c) by K3N / epistemex.com
 */

/**
 * Parse string holding html into text with callback per tag so it can
 * be replaced with other content.
 *
 * Note: Does not handle content between SCRIPT tags. This is intended
 * to be used with fragments/part content.
 *
 * @param {string} html
 * @param {function} onTag
 * @returns {string}
 */
function tagParser(html, onTag, onChar) {

  const Q = {none:0, dbl: 1, sng: 2};
  let
    i = 0, t = -1, ch,
    inQuote = Q.none,
    inTag = false,
    name = "",
    txt = "";

  while(i < html.length) {
    ch = html[i];

    if (inTag) {
      // inside quotes?
      if (!inQuote) {
        if (ch === "\"") inQuote = Q.dbl;
        else if (ch === "'") inQuote = Q.sng;
      }
      else {
        if ((inQuote === Q.dbl && ch === "\"") || (inQuote === Q.sng && ch === "'")) inQuote = Q.none;
      }

      if (!inQuote) {
        // get tag name
        if ((ch === " " && !name.length) || (ch === ">" && !name.length)) name = html.substring(t + 1, i);

        // end of tag?
        if (ch === ">") {
          inTag = false;
          txt += onTag({tagStart: t, tagEnd: i + 1, name: name.toLowerCase()});
        }
      }
    }
    else {
      if (ch === "<") {
        inTag = true;
        t = i;
        name = "";
      }
      else {
        if (!tagParser.skip) txt += onChar(ch);
      }
    }
    i++
  }

  return txt
}

tagParser.skip = false;
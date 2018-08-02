/*
  Formatter Short module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const utils = loadModule("core.utils");
const Output = loadModule("core.output");
const out = new Output(0, lf);
const table = loadModule("core.table");
const browserNames = utils.getBrowserShortNames();
const tblOptions = {
  align       : [ "l" ],
  delimiter   : global.sepChar,
  stringLength: utils.ansiLength
};

function formatterShort(data) {
  //out.addLine(`?w${data.prePath}?w${data.path}`);
  const tbl = [];

  // headers
  const header = [text.hdrBrowsers];
  if (options.desktop) header.push(...getNames("desktop", "?w"));
  if (options.mobile) header.push(...getNames("mobile", "?c"));
  if (options.ext) header.push(...getNames("ext", "?y"));
  header[header.length - 1] += "?G";
  tbl.push(header);

  // table data
  tbl.push(...doLines());
  out.add(lf, table(tbl, tblOptions), lf);


  function getNames(device, color = "?w") {
    const dev = data.browsers[device];
    return dev.map((o, i) => color + browserNames[o.browser].padEnd(3) + (i === dev.length - 1 ? "?w" : "?G"))
  } // : getNames

  function doLines() {
    const line = [];
    line.push(getLine(data.name, data.browsers, "?w"));

    if (options.children && data.children.length) {
      data.children.forEach(child => {
        let name = child.name;
        if (child.name === data.name) name += "()";
        line.push(getLine(name, child.browsers));
      })
    }
    return line
  } // : doLines

  function getLine(name, browsers, color = "?R") {
    const result = [color + utils.getFeatureName(name)];
    if (options.desktop) result.push(...getBrowser(browsers["desktop"]));
    if (options.mobile) result.push(...getBrowser(browsers["mobile"]));
    if (options.ext) result.push(...getBrowser(browsers["ext"]));
    return result
  } // : getLine

  function getBrowser(browser) {
    const result = [];

    browser
      .forEach((stat, i) => {
        const history = stat.history[0];
        let v = utils.versionAddRem(history.add, history.removed);
        if (stat.noteIndex.length) v += "?c*";
        v += (i === browser.length - 1 ? "?w" : "?G");
        result.push(v);
      });

    return result
  } // :getBrowser

  return out.toString()
}

module.exports = formatterShort;
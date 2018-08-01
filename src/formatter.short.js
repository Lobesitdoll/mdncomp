/*
  Formatter Short module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const utils = loadModule("core.utils");
const Output = loadModule("core.output");
const out = new Output(0, lf);
const table = require("markdown-table");
const browserNames = utils.getBrowserShortNames();
const tblOptions = {
  delimiter: global.sepChar,
  stringLength: utils.ansiLength,
  align: ["l", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c", "c"],
  pad: true,
  start: "",
  end: ""
};

function formatterShort(data) {
  //out.addLine(`?w${data.prePath}?w${data.path}`);
  const tbl = [];

  const header = [text.hdrBrowsers];
  if (options.desktop) header.push(...getNames("desktop", "?w"));
  if (options.mobile) header.push(...getNames("mobile", "?c"));
  if (options.ext) header.push(...getNames("ext", "?y"));
  header[header.length - 1] += "?G";
  tbl.push(header);

  // get data
  tbl.push(...doLines());

  out.add(lf, table(tbl, tblOptions), lf);

  function getNames(device, color = "?w") {
    const dev = data.browsers[device];
    return dev.map((o, i) => color + browserNames[o.browser].padEnd(3) + (i === dev.length - 1 ? "?w" : "?G"))
  }

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
  }

  function getLine(name, browsers, color = "?R") {
    name = name
      .replace("worker_support", text.workerSupport)
      .replace("sab_in_dataview", text.sabInDataView)
      .replace("SharedArrayBuffer_as_param", text.sabSupport)
      .replace(/_/g, " ");

    const result = [color + name];
    if (options.desktop) result.push(...getBrowser(browsers["desktop"]));
    if (options.mobile) result.push(...getBrowser(browsers["mobile"]));
    if (options.ext) result.push(...getBrowser(browsers["ext"]));

    return result
  }

  function getBrowser(browser) {
    const result = [];

    browser
      .forEach((stat, i) => {
        const history = stat.history[0];
        let v = utils.versionAddRem(history.add, history.removed);

        if (stat.noteIndex.length) {
          v += "?c*";
        }

        v += i === browser.length - 1 ? "?w" : "?G";

        result.push(v);
      });

    return result
  }

  return out.toString()
}

module.exports = formatterShort;
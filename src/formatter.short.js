/*
  Formatter Short module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const utils = loadModule("core.utils");
const Output = loadModule("core.output");
const table = loadModule("core.table");

const out = new Output(0, lf);
const browserNames = utils.getBrowserShortNames();
const tblOptions = {
  align       : [ "l" ],
  delimiter   : global.sepChar,
  stringLength: utils.ansiLength
};

function formatterShort(data) {
  const tbl = [];

  out.addLine(`${lf}?c${data.prePath}?w${data.name}  ${getStatus()}?R`);
  if (data.url) out.addLine(data.url);

  // headers
  const header = [ "?y" + text.hdrBrowsers ];
  if ( options.desktop ) header.push(...getNames("desktop", "?w"));
  if ( options.mobile ) header.push(...getNames("mobile", "?c"));
  if ( options.ext ) header.push(...getNames("ext", "?y"));
  header[ header.length - 1 ] += "?G";
  tbl.push(header);

  // table data
  tbl.push(...doLines());
  out.add(lf, table(tbl, tblOptions), lf);

  function getNames(device, color = "?w") {
    const dev = data.browsers[ device ];
    return dev.map((o, i) => color + browserNames[ o.browser ].padEnd(3) + (i === dev.length - 1 ? "?w" : "?G"));
  } // : getNames

  function doLines() {
    const line = [];
    line.push(getLine(data.name, data.browsers, "?w"));

    if ( options.children && data.children.length ) {
      data.children.forEach(child => {
        let name = child.name;
        if ( child.name === data.name ) name += "()";
        if ( !(child.standard || child.experimental || child.deprecated) ) name = "?G-" + name + "?R";
        line.push(getLine(name, child.browsers, "?R", true));
      });
    }
    return line;
  } // : doLines

  function getLine(name, browsers, color = "?R", isChild = false) {
    const result = [ color + utils.getFeatureName(name) ];
    if ( options.desktop ) result.push(...getBrowser(browsers[ "desktop" ], isChild));
    if ( options.mobile ) result.push(...getBrowser(browsers[ "mobile" ], isChild));
    if ( options.ext ) result.push(...getBrowser(browsers[ "ext" ], isChild));
    return result;
  } // : getLine

  function getBrowser(browser, isChild = false) {
    const result = [];

    browser
      .forEach((stat, i) => {
        const history = stat.history[ 0 ];
        let v = utils.versionAddRem(history.add, history.removed);

        if ( stat.noteIndex.length ) v += "?c*";
        v += (i === browser.length - 1 ? "?w" : "?G");

        if ( history.flags && history.flags.length ) v += isChild ? "?mF?G" : "?bF?G";

        result.push(v);
      });

    return result;
  } // :getBrowser

  function getStatus() {
    let status = [];
    if ( data.standard ) status.push(`?g${text.standardShort}?R`);
    if ( data.experimental ) status.push(`?y${text.experimentalShort}?R`);
    if ( data.deprecated ) status.push(`?r${text.deprecatedShort}?R`);
    if ( !status.length ) status.push(`?r${text.nonStandardShort}?R`);
    return status.length ? "?G[" + status.join(", ") + "?G]?R" : "?R";
  } // : getStatus

  return out.toString();
}

module.exports = formatterShort;
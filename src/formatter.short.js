/*
  Formatter Short module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const utils = loadModule("core.utils");
const table = loadModule("core.table");

const browserNames = utils.getBrowserNames();
const tblOptions = {
  align       : [ "l" ],
  delimiter   : char.sep,
  stringLength: utils.ansiLength
};

function formatterShort(data) {
  const tbl = [];
  let hasNotes = false;
  let hasFlags = false;

  log(`${lf}?c${data.prePath}?w${data.name}  ${getStatus()}?R`);
  if ( data.url ) log("?G" + data.url + "?R");

  // headers
  const header = [ "?y" + text.hdrBrowsers ];
  if ( options.desktop && data.browsers.desktop.length ) header.push(...getNames("desktop", "?w"));
  if ( options.mobile && data.browsers.mobile.length ) header.push(...getNames("mobile", "?c"));
  if ( options.ext && data.browsers.ext.length ) header.push(...getNames("ext", "?y"));
  header[ header.length - 1 ] += "?G";
  tbl.push(header);

  // table data
  tbl.push(...doLines());
  log(lf + table(tbl, tblOptions));

  // hints
  if (!options.expert) {
    const hints = [];
    hints.push(`?c${char.notes}?R) ${text.someNotesHint}`);
    hints.push(`?c${char.flags}?R) ${text.someFlagsHint}`);
    log(hints.join(", "));
    if (hints.length) log(text.someHints + lf)
  }

  function getNames(device, color = "?w") {
    const dev = data.browsers[ device ];
    return dev.map((o, i) => color + browserNames[ o.browser ].short.padEnd(3) + (i === dev.length - 1 ? "?w" : "?G"));
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
        let v = utils.versionAddRem(history.version_added, history.version_removed, stat.noteIndex.length > 0);

        if ( stat.noteIndex.length ) {
          hasNotes = true;
          v += "?c" + char.notes;
        }
        v += (i === browser.length - 1 ? "?w" : "?G");

        if ( history.flags && history.flags.length ) {
          hasFlags = true;
          v += (isChild ? "?m" : "?b") + char.flags + "?G";
        }

        result.push(v);
      });

    return result;
  } // :getBrowser

  function getStatus() {
    if ( data.path.startsWith("webextensions") ) return "";
    let status = [];
    if ( data.standard ) status.push(`?g${text.standardShort}?R`);
    if ( data.experimental ) status.push(`?y${text.experimentalShort}?R`);
    if ( data.deprecated ) status.push(`?r${text.deprecatedShort}?R`);
    if ( !status.length ) status.push(`?r${text.nonStandardShort}?R`);
    return status.length ? "?G[" + status.join(", ") + "?G]?R" : "?R";
  } // : getStatus

  //return out.toString();
}

module.exports = formatterShort;
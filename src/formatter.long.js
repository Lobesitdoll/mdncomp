/*
  Formatter Long module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const utils = loadModule("core.utils");
const Output = loadModule("core.output");
const table = loadModule("core.table");

const out = new Output(0, lf);
const browserNames = utils.getBrowserLongNames();
const refs = [ "°", "¹", "²", "³", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "p", "q", "r", "s", "^", "ª", "º" ]; // skipping "o" on purpose

const tblOptions = {
  align       : [ "l" ],
  delimiter   : char.sep,
  stringLength: utils.ansiLength,
  start       : "?G",
  end         : "?R"
};

function formatterLong(data, recursive = false) {
  const isWebExt = data.path.startsWith("webextensions");
  const flags = [];
  let workerHint = false;
  let sabHint = false;
  let expHint = false;
  let depHint = false;
  let nonStdHint = false;
  let hints = false;

  /* Header ------------------------------------------------------------------*/

  if ( data.name === "worker_support" ) {
    out
      .addLine(lf, "?c", text.hdrWorkers, "?w")
      .addLine("%0", getStatus());
  }
  else if ( data.name === "SharedArrayBuffer_as_param" ) {
    out
      .addLine(lf, "?c", text.hdrSAB, "?w")
      .addLine("%0", getStatus());
  }
  else {
    // path + api, status, url
    out.addLine("\n?c%0?w%1?R", data.prePath, data.name);
    if (!isWebExt) {
      out.addLine("%0", getStatus());
    }
    if ( data.url ) out.addLine(data.url ? "?G" + data.url : "-", "?R");

    // Short title
    if ( data.short && data.short.length ) {
      let short = utils.entities("?R" + utils.breakAnsiLine(utils.cleanHTML(data.short), options.maxChars));
      out.addLine(short, lf);
    }

    // Description
    if ( options.desc && data.description && data.description !== data.short ) {
      let desc = utils.entities("?w" + utils.breakAnsiLine(utils.cleanHTML(data.description, true, ANSI.white), options.maxChars));
      out.addLine(lf, desc);
    }
  }

  /* Show table data ---------------------------------------------------------*/

  if ( options.desktop && data.browsers.desktop.length ) doDevice("desktop");
  if ( options.mobile && data.browsers.mobile.length ) doDevice("mobile");
  if ( options.ext && data.browsers.ext.length ) doDevice("ext");
  out.addLine();

  /* Show hints if any -------------------------------------------------------*/

  if (!options.expert) {
    if ((depHint || nonStdHint || expHint) &&
      (((options.worker && recursive) || (!options.worker && !recursive)) || ((options.sab && recursive) || (!options.sab && !recursive)))) {
      let hint = [];
      if (expHint) hint.push(`?o!?R = ${text.experimental}`);
      if (depHint) hint.push(`?r-?R = ${text.deprecated}`);
      if (nonStdHint) hint.push(`?rX?R = ${text.nonStandard}`);
      out.addLine("?R", hint.join(", "), lf);
    }
  }

  /* Show table data for workers/SharedArrayBuffer ---------------------------*/

  if ( options.worker && data.workers ) formatterLong(data.workers, true);
  if ( options.sab && data.sab ) formatterLong(data.sab, true);

  /* Show notes --------------------------------------------------------------*/

  if ( options.notes && data.notes.length ) {
    addHeader(text.hdrNotes);
    data.notes.forEach(note => {
      let res = `?c${refs[ note.index % refs.length ]}?R: `;
      res += `?R${utils.cleanHTML(note.note, true, "?R", "?c", "?y")}`;
      res += hasLink(note.note) ? `?R ${text.refLink} ${note.index}.?R` : "?R";

      out.addLine(utils.breakAnsiLine(res, options.maxChars));
    });
    out.addLine();

    // Links in notes
    if ( options.notes && data.links.length ) {
      addHeader(text.hdrLinks);
      data.links.forEach(link => {
        out.addLine(`?c${link.index}?R: ?y${link.url}?R`);
      });
      out.addLine()
    }
  }

  /* Show flags and history --------------------------------------------------*/

  if ( options.flags || options.history) {
    if ( options.desktop ) getFlags("desktop");
    if ( options.mobile ) getFlags("mobile");
    if ( options.ext ) getFlags("ext");
    if (flags.length) {
      addHeader(options.history ? text.hdrFlagsHistory : text.hdrFlags);
      out.add(flags.join(lf), lf, lf);
    }
  }

  /* Show specifications -----------------------------------------------------*/

  if ( options.specs && data.specs.length ) {
    addHeader(text.hdrSpecs);
    data.specs.forEach(spec => {
      out.addLine("?w" + `${utils.entities(spec.name)} ?R[${getSpecStatus(spec.status)}?R]${lf}${spec.url}`);
    });
    out.addLine()
  } // :specs

  /* Additional hints --------------------------------------------------------*/

  if (!options.expert) {
    if ( workerHint ) {
      out.addLine(utils.breakAnsiLine(text.workerHint, options.maxChars));
      hints = true;
    }

    if ( sabHint ) {
      out.addLine(lf, utils.breakAnsiLine(text.sabHint, options.maxChars));
      hints = true;
    }

    if (!options.specs && data.specs.length) {
      out.addLine(text.specsHint);
      hints = true;
    }

    if (!options.desc && data.description.length) {
      out.addLine(text.descHint);
      hints = true;
    }

    if (!options.history) {
      out.addLine(text.historyHint);
      hints = true;
    }

    if (!data.isFiltered && data.children.length > 9) {
      out.addLine(text.filterHint);
      hints = true;
    }

    if (hints) {
      out.addLine()
    }
  }

  /* Helpers -----------------------------------------------------------------*/

  function doDevice(device) {
    const dev = data.browsers[ device ];
    const dataName = data.name;
    const tbl = [];

    // Header line
    const tableName = [ "?y" + text[ device ].toUpperCase() + "?G" ];
    const colNames = dev.map(o => `?w${browserNames[ o.browser ].padEnd(10)}?G`);
    tbl.push(tableName.concat(colNames));

    // Main feature name
    tbl.push(getLine(data.isCompat ? dataName : "P " + dataName, dev, data, false /*, 2*/));

    if ( options.children && data.children.length ) {
      data.children.forEach((child /*, i*/) => {
        let name = child.name;

        if ( !workerHint && !options.worker && name === "worker_support" ) workerHint = true;
        if ( !sabHint && !options.sab && name === "SharedArrayBuffer_as_param" ) sabHint = true;

        if ( name === dataName ) name += "()";

        tbl.push(getLine(name, child.browsers[ device ], child, true/*, i+2*/));
      });
    }

    out.add(lf, "?G", table(tbl, tblOptions));
  }

  function getLine(name, status, data, isChild) {
    const color = isChild ? "?R" : (data.isCompat ? "?w" : "?g");

    // Status
    let stat = " ";
    if (!isWebExt) {
      if (!(data.standard || data.experimental)) {
        stat += "?rX";
        nonStdHint = true
      }
      if (data.experimental) {
        stat += "?o!";
        expHint = true
      }
      if (data.deprecated) {
        stat += "?r-";
        depHint = true
      }
    }
    stat = stat.trimRight();

    // feature/child name as first entry
    const result = [ color + utils.getFeatureName(name) + stat + "?G" ];

    status
      .sort(sortRefs)
      .forEach(stat => {
        const history = stat.history[ 0 ];
        let v = utils.versionAddRem(history.version_added, history.version_removed, stat.noteIndex.length > 0);

        if ( stat.noteIndex.length ) {
          v += "?c";
          if ( isChild && options.shorthand ) v += "*";
          else {
            stat.noteIndex.forEach(ref => {
              v += refs[ ref % refs.length ];
            });
          }
        }

        if ( options.flags && history.flags && history.flags.length ) {
          v += isChild ? "?mF" : "?bF";
        }

        v += "?G";
        result.push(v);
      });

    return result;
  } // : getLine

  function getFlags(device) {
    data
      .browsers[ device ]
      .forEach(browser => {
        const name = browserNames[ browser.browser ];

        if ( browser.history.length ) {
          let max = options.history ? browser.history.length : 1;
          for(let i = 0; i < max; i++) {
            const history = browser.history[ i ];
            let version = utils.ansiFree(utils.versionAddRem(history.version_added, history.version_removed, false));

            if ( options.history ) {
              let _version = isNaN(version) ? "" : " " + version;
              if ( history.alternative_name ) flags.push(`?y${name}${_version}?w: ${text.altName}: ?c${history.alternative_name}?w`);
              if ( history.prefix ) flags.push(`?y${name}${_version}?w: ${text.vendorPrefix}: ?c${history.prefix}?w`);
              if ( history.partial_implementation ) flags.push(`?y${name}${_version}?w: ${text.partialImpl}.?w`);
              if ( history.notes.length ) {
                flags.push(`?y${name}${_version}?w: ${text.seeNote} ?c${history.notes.map(i => refs[ i % refs.length ]).join(", ")}?w`);
              }
            }

            if ( options.flags && history.flags.length ) {
              version = isNaN(version) ? "" : " " + version;

              let entry = "?y" + name + version + ":?w ";
              history
                .flags
                .forEach(flag => {
                  switch( flag.type ) {
                    case "preference":
                      entry += `${text.thisFeatBehind} ?c${flag.name}?w ${text.preference}`;
                      if ( flag.value_to_set ) entry += ` (${text.setTo} ?c${flag.value_to_set}?w)`;
                      entry += ".";
                      break;
                    case "compile_flag":
                      entry += `${text.compileWith} ?c${flag.name}?w ${text.setTo} ?c${flag.value_to_set}?w.`;
                      break;
                    case "runtime_flag":
                      entry += `${text.startWith} ?c${flag.name}?w.`;
                      break;
                  }
                });

              flags.push(utils.breakAnsiLine(entry, options.maxChars));
            }
          }
        }
      });
  } // : getFlags

  function hasLink(str) {
    // todo make this more solid?
    return str.includes("<a href");
  }

  function getStatus() {
    let status = [];
    if ( data.standard ) status.push(`?g${text.standard}?R`);
    if ( data.experimental ) status.push(`?y${text.experimental}?R`);
    if ( data.deprecated ) status.push(`?r${text.deprecated}?R`);
    if ( !status.length ) status.push(`?r${text.nonStandard}?R`);
    return status.join(", ");
  } // : getStatus

  function getSpecStatus(status) {
    return "?" + ({
      "RFC"      : "yIETF RFC",
      "STANDARD" : `g${text.specStandard}`,
      "REC"      : `g${text.specRec}`,
      "CR"       : `c${text.candidate} ${text.specRec}`,
      "LIVING"   : `c${text.specLiving} ${text.specStandard}`,
      "DRAFT"    : `y${text.specDraft}`,
      "PR"       : `y${text.specProposed} ${text.specRec}`,
      "RC"       : `c${text.specRelease} ${text.specCandidate}`,
      "WD"       : `b${text.specWorking} ${text.specDraft}`,
      "ED"       : `g${text.specEditors} ${text.specDraft}`,
      "OBSOLETE" : `r${text.obsolete}`,
      "LC"       : `y${text.lastCallWorking} ${text.specDraft}`,
      "OLD-TRANSFORMS": `o${text.hasMergedAnother} ${text.specDraft.toLowerCase()}`
    }[ status.toUpperCase() ] || `y${text.status}`) + "?R"
  } // : getSpecStatus

  function addHeader(txt) {
    out.addLine(`?c${ANSI.underline}${txt}`);
  }

  function sortRefs(a, b) {
    return a < b ? -1 : (a > b ? 1 : 0);
  }

  return out.toString();
}

module.exports = formatterLong;
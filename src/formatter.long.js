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
const refs = [ "°", "¹", "²", "³", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "^", "ª", "º", "'", "\"", "`" ];

const tblOptions = {
  align       : [ "l" ],
  delimiter   : global.sepChar,
  stringLength: utils.ansiLength,
  start       : "?G",
  end         : "?R"
};

function formatterLong(data) {
  let workerHint = false;
  let sabHint = false;

  // Header
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
    out
      .addLine("\n?c%0?w%1?R", data.prePath, data.name)
      .addLine("%0", getStatus());
    if ( data.url ) out.addLine(data.url ? "?G" + data.url : "-", "?R");

    // Short title
    if ( data.short && data.short.length ) {
      let short = utils.entities("?R" + utils.breakAnsiLine(utils.cleanHTML(data.short), options.maxChars));
      out.addLine(short, lf);
    }

    // Description
    if ( options.desc && data.description && data.description !== data.short ) {
      let desc = utils.entities("?R" + utils.breakAnsiLine(utils.cleanHTML(data.description), options.maxChars));
      out.addLine(lf, desc, lf);
    }
  }

  // Show table data
  if ( options.desktop ) doDevice("desktop");
  if ( options.mobile ) doDevice("mobile");
  if ( options.ext ) doDevice("ext");

  // Show hints if any
  if ( workerHint ) {
    out.addLine(lf, utils.breakAnsiLine(text.workerHint, options.maxChars));
  }

  if ( sabHint ) {
    out.addLine(lf, utils.breakAnsiLine(sabHint, options.maxChars));
  }

  // Show table data for workers/SharedArrayBuffer
  if ( options.workers && data.workers ) formatterLong(data.workers);
  if ( options.sab && data.sab ) formatterLong(data.sab);

  // Show notes
  if ( options.notes && data.notes.length ) {
    addHeader(text.hdrNotes);
    data.notes.forEach(note => {
      let res = `?c${refs[ note.index % refs.length ]}?R: `;
      res += `?R${utils.cleanHTML(note.note, true, "?R", "?c", "?y")}`;
      res += hasLink(note.note) ? `?R ${text.refLink} ${note.index}.?R` : "?R";

      out.addLine(utils.breakAnsiLine(res, options.maxChars));
    });

    // Links in notes
    if ( options.notes && data.links.length ) {
      addHeader(text.hdrLinks);
      data.links.forEach(link => {
        out.addLine(`?c${link.index}?R: ?y${link.url}?R`);
      });
    }
  }

  // Show flags and history
  if ( (options.flags && hasFlags()) || (options.history && hasHistory()) ) {
    addHeader(text.hdrFlagsHistory);
    if ( options.desktop ) getFlags("desktop");
    if ( options.mobile ) getFlags("mobile");
    if ( options.ext ) getFlags("ext");
    out.addLine()
  }

  // Show specifications?
  if ( options.specs && data.specs.length ) {
    addHeader(text.hdrSpecs);
    data.specs.forEach(spec => {
      out.addLine("?w" + `${utils.entities(spec.name)} ?R[${getSpecStatus(spec.status)}?R]${lf}${spec.url}`);
    });
  } // :specs

  function doDevice(device) {
    const dev = data.browsers[ device ];
    const dataName = data.name;
    const tbl = [];

    // Header line
    const tableName = [ "?y" + text[ device ].toUpperCase() + "?G" ];
    const colNames = dev.map(o => `?w${browserNames[ o.browser ].padEnd(10)}?G`);
    tbl.push(tableName.concat(colNames));

    // Main feature name
    tbl.push(getLine(data.isCompat ? dataName : "P " + dataName, dev, data.isCompat ? "?w" : "?g", false /*, 2*/));

    if ( options.children && data.children.length ) {
      data.children.forEach((child /*, i*/) => {
        let name = child.name;

        if ( !workerHint && !options.workers && name === "worker_support" ) workerHint = true;
        if ( !sabHint && !options.sab && name === "SharedArrayBuffer_as_param" ) sabHint = true;

        if ( name === dataName ) name += "()";
        if ( !(child.standard || child.experimental || child.deprecated) ) name = "?G-" + name;

        tbl.push(getLine(name, child.browsers[ device ], "?R", true/*, i+2*/));
      });
    }

    out.add(lf, "?G", table(tbl, tblOptions));
  }

  function getLine(name, status, color, isChild /*, bgToggle*/) {
    //const bg = bgToggle % 4 === 0 ? ANSI.bg2 : ANSI.bg1;

    // feature/child name as first entry
    const result = [ color /* + bg*/ + utils.getFeatureName(name) + "?G " ];

    status
      .sort(sortRefs)
      .forEach(stat => {
        const history = stat.history[ 0 ];
        let v = utils.versionAddRem(history.add, history.removed);

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
        result.push(/*bg + */ v);
      });

    return result;
  } // : getLine

  // todo move to utils
  function hasFlags() {
    const devices = [];
    if ( options.desktop ) devices.push("desktop");
    if ( options.mobile ) devices.push("mobile");
    if ( options.ext ) devices.push("ext");

    for(let device of devices) {
      for(let browser of data.browsers[ device ]) {
        if ( browser.history.length ) {
          if ( options.history ) return true;
          let max = options.history ? browser.history.length : 1;
          for(let i = 0; i < max; i++) {
            if ( browser.history[ i ].flags.length ) return true;
          }
        }
      }
    }
    return false;
  } // : hasFlags

  // todo move to utils + improve
  function hasHistory() {
    const devices = [];
    if ( options.desktop ) devices.push("desktop");
    if ( options.mobile ) devices.push("mobile");
    if ( options.ext ) devices.push("ext");

    for(let device of devices) {
      for(let browser of data.browsers[ device ]) {
        if ( browser.history.length ) return true;
      }
    }
    return false;
  } // : hasHistory

  function getFlags(device) {
    const flags = [];

    data.browsers[ device ].forEach(browser => {
      const name = browserNames[ browser.browser ];

      if ( browser.history.length ) {
        let max = options.history ? browser.history.length : 1;
        for(let i = 0; i < max; i++) {
          let history = browser.history[ i ];
          let version = utils.ansiFree(utils.versionAddRem(history.add, history.removed));

          if ( options.history ) {
            let _version = isNaN(version) ? "" : " " + version;
            if ( history.altName ) flags.push(`?y${name}${_version}?w: ${text.altName}: ?c${history.altName}?w`);
            if ( history.prefix ) flags.push(`?y${name}${_version}?w: ${text.vendorPrefix}: ?c${history.prefix}?w`);
            if ( history.partial ) flags.push(`?y${name}${_version}?w: ${text.partialImpl}.?w`);
            if ( history.notes.length ) {
              flags.push(`?y${name}${_version}?w: ${text.seeNote} ?c${history.notes.map(i => refs[ i % refs.length ]).join(", ")}?w`);
            }
          }

          if ( options.flags && history.flags.length ) {
            if ( isNaN(version) ) version = "";
            else version = " " + version;

            let entry = "?y" + name + version + ":?w ";
            history.flags.forEach(flag => {
              switch( flag.type ) {
                case "preference":
                  entry += `${text.thisFeatBehind} ?c${flag.name}?w ${text.preference}.`;
                  if ( flag.value_to_set ) entry += ` (${text.setTo} ?c${flag.value_to_set}?w).`;
                  break;
                case "compile_flag":
                  entry += `${text.compileWith} ?c${flag.name}?w ${text.setTo} ?c${flag.value_to_set}?w.`;
                  break;
                case "runtime_flag":
                  entry += `${text.startWith} ?c${flag.name}?w. `;
                  break;
              }
            });
            flags.push(utils.breakAnsiLine(entry, options.maxChars) + lf);
          }
        }
      }
    });

    out.add(flags.join(""));
  } // : getFlags

  function hasLink(str) {
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
    out.addLine(`${lf}?c${txt}`);
  }

  function sortRefs(a, b) {
    return a < b ? -1 : (a > b ? 1 : 0);
  }

  return out.toString();
}

module.exports = formatterLong;
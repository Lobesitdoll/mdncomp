/*
  Formatter Long module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const utils = loadModule("core.utils");
const table = loadModule("core.table");

const browserNames = utils.getBrowserNames();
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
  const hint = {
    worker: false,
    sab   : false,
    exp   : false,
    dep   : false,
    nonStd: false,
    parent: false
  };
  let hasHints = false;

  /* Header ------------------------------------------------------------------*/

  if ( !recursive ) log();

  if ( data.name === "worker_support" ) {
    log(`?c${text.hdrWorkers}?w`);
    log(getStatus());
  }
  else if ( data.name === "SharedArrayBuffer_as_param" ) {
    log(`?c${text.hdrSAB}?w`);
    log(getStatus());
  }
  else {
    // path + api, status, url
    log(`?c${data.prePath}?w${data.name}?R`);
    if ( !isWebExt ) {
      log(getStatus());
    }
    if ( data.url ) log((data.url ? "?G" + data.url : "-") + "?R");

    // Short title
    if ( data.short && data.short.length ) {
      let short = utils.entities("?R" + utils.breakAnsiLine(utils.cleanHTML(data.short), options.maxChars));
      log(short + lf);
    }

    // Description
    if ( options.desc ) {
      if ( data.description && data.description !== data.short ) {
        let desc = utils.entities("?w" + utils.breakAnsiLine(utils.cleanHTML(data.description, true, "?w"), options.maxChars));
        log(lf + desc);
      }
      else {
        log(lf + "?R" + text.noDescription);
      }
    }
  }

  log("?R");

  /* Show table data ---------------------------------------------------------*/

  if ( options.desktop && data.browsers.desktop.length ) doDevice("desktop");
  if ( options.mobile && data.browsers.mobile.length ) doDevice("mobile");
  if ( options.ext && data.browsers.ext.length ) doDevice("ext");

  /* Show hints if any -------------------------------------------------------*/

  if ( !options.expert ) {
    if ( (hint.dep || hint.nonStd || hint.exp || hint.parent) &&
      (((options.worker && recursive) || (!options.worker && !recursive)) || ((options.sab && recursive) || (!options.sab && !recursive))) ) {
      let hints = [];
      if ( hint.exp ) hints.push(`?o${char.experimental}?R = ${text.experimental}`);
      if ( hint.dep ) hints.push(`?r${char.deprecated}?R = ${text.deprecated}`);
      if ( hint.nonStd ) hints.push(`?r${char.nonStd}?R = ${text.nonStandard}`);
      if ( hint.parent ) hints.push(`?g${char.parent}?R = ${text.listParent}`);
      log("?R" + hints.join(", ") + lf);
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

      log(utils.breakAnsiLine(res, options.maxChars));
    });
    log("?R");

    // Links in notes
    if ( options.notes && data.links.length ) {
      addHeader(text.hdrLinks);
      data.links.forEach(link => {
        log(`?c${link.index}?R: ?G${link.url}?R`);
      });
      log("?R");
    }
  }

  /* Show flags and history --------------------------------------------------*/

  if ( options.flags || options.history ) {
    if ( options.desktop ) getFlags("desktop");
    if ( options.mobile ) getFlags("mobile");
    if ( options.ext ) getFlags("ext");
    if ( flags.length ) {
      addHeader(options.history ? text.hdrFlagsHistory : text.hdrFlags);
      log(flags.join(lf));
      log("?R");
    }
  }

  /* Show specifications -----------------------------------------------------*/

  if ( options.specs && data.specs.length ) {
    addHeader(text.hdrSpecs);
    data
      .specs
      .forEach(spec => {
        log(`?w${utils.entities(spec.name)} ?R[${getSpecStatus(spec.status)}?R]${lf}?G${spec.url}?R`);
      });

    log("?R");
  } // :specs

  /* Additional hints --------------------------------------------------------*/

  function logHint(txt) {
    log(txt);
    hasHints = true;
  }

  if ( !options.expert && !recursive ) {

    if ( hint.worker ) {
      logHint(utils.breakAnsiLine(text.workerHint, options.maxChars));
    }

    if ( hint.sab ) {
      logHint(utils.breakAnsiLine(text.sabHint, options.maxChars));
    }

    if ( !options.specs && data.specs.length ) {
      logHint(text.specsHint);
    }

    if ( !options.desc && data.description.length ) {
      logHint(text.descHint);
    }

    if ( !options.history ) {
      logHint(text.historyHint);
    }

    if ( !data.isFiltered && data.children.length > 9 ) {
      logHint("?R" + text.filterHint);
    }

    if ( hasHints ) log("?R");
  }

  /* Helpers -----------------------------------------------------------------*/

  function doDevice(device) {
    const tbl = [];
    const dev = data.browsers[ device ];
    const dataName = data.name;

    // Header line
    const tableName = [ "?y" + text[ device ].toUpperCase() + "?G" ];
    const colNames = dev.map(o => `?w${browserNames[ o.browser ].long.padEnd(10)}?G`);
    tbl.push(tableName.concat(colNames));

    // Main feature name
    let _dataName = dataName;
    if ( !data.isCompat ) {
      _dataName = char.parent + " " + dataName;
      hint.parent = true;
    }
    tbl.push(getLine(_dataName, dev, data, false));

    if ( options.children && data.children.length ) {
      data.children.forEach((child) => {
        let name = child.name;

        if ( !hint.worker && !options.worker && name === "worker_support" ) hint.worker = true;
        if ( !hint.sab && !options.sab && name === "SharedArrayBuffer_as_param" ) hint.sab = true;

        if ( name === dataName ) name += "()";

        tbl.push(getLine(name, child.browsers[ device ], child, true));
      });
    }

    log("?G" + table(tbl, tblOptions));
  }

  function getLine(name, status, data, isChild) {
    const color = isChild ? "?R" : (data.isCompat ? "?w" : "?g");

    // Status
    let stat = " ";

    if ( !isWebExt ) {
      if ( !(data.standard || data.experimental) ) {
        stat += "?r" + char.nonStd;
        hint.nonStd = true;
      }
      if ( data.experimental ) {
        stat += "?o" + char.experimental;
        hint.exp = true;
      }
      if ( data.deprecated ) {
        stat += "?r" + char.deprecated;
        hint.dep = true;
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
          v += (isChild ? "?m" : "?b") + char.flags;
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
        const name = browserNames[ browser.browser ].long;

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
                const _noteRefs = history.notes.map(i => refs[ i % refs.length ]).join(", ");
                flags.push(`?y${name}${_version}?w: ${text.seeNote} ?c${_noteRefs}?w`);
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
    return str.includes("<a");
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
      "RFC"           : "yIETF RFC",
      "STANDARD"      : `g${text.specStandard}`,
      "REC"           : `g${text.specRec}`,
      "CR"            : `c${text.candidate} ${text.specRec}`,
      "LIVING"        : `c${text.specLiving} ${text.specStandard}`,
      "DRAFT"         : `y${text.specDraft}`,
      "PR"            : `y${text.specProposed} ${text.specRec}`,
      "RC"            : `c${text.specRelease} ${text.specCandidate}`,
      "WD"            : `b${text.specWorking} ${text.specDraft}`,
      "ED"            : `g${text.specEditors} ${text.specDraft}`,
      "OBSOLETE"      : `r${text.obsolete}`,
      "LC"            : `y${text.lastCallWorking} ${text.specDraft}`,
      "OLD-TRANSFORMS": `o${text.hasMergedAnother} ${text.specDraft.toLowerCase()}`
    }[ status.toUpperCase() ] || `y${text.status}`) + "?R";
  } // : getSpecStatus

  function addHeader(txt) {
    log(`?b${txt}?R`);
  }

  function sortRefs(a, b) {
    return a < b ? -1 : (a > b ? 1 : 0);
  }

}

module.exports = formatterLong;
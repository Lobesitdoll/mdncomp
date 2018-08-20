/*
  Formatter Long module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

/*
    Good test candidates:
      - websocket 0 (hist.)
      - api.Navigator. (notes/hist., link numbering)
      - api.Window. (notes/hist., link numbering)
      - api.datatransfer. (multiple links)
      - api.MediaTrackSettings.autoGainControl (conf. markings if hist.)
      - api.Bluetooth.getAvailability (link validity, currently 404)
      - sharedarraybuffer.

    Currently longest API paths (93 chars):
    javascript.functions.default_parameters.parameters_without_defaults_after_default_parameters
    javascript.functions.default_parameters.destructured_parameter_with_default_value_assignment

    >= 84
    api.WindowOrWorkerGlobalScope.createImageBitmap.resizeWidth_resizeHeight_resizeQuality
    webextensions.manifest.chrome_settings_overrides.search_provider.suggest_url_post_params
    webextensions.manifest.chrome_settings_overrides.search_provider.image_url_post_params
    webextensions.manifest.chrome_settings_overrides.search_provider.instant_url_post_params
    webextensions.manifest.chrome_settings_overrides.search_provider.search_url_post_params
 */

const utils = loadModule("core.utils");
const table = loadModule("core.table");

const browserNames = utils.getBrowserNames();
const refs = [ // skipping "l", "o", "x, on purpose:
  "°", "¹", "²", "³", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v", "w", "y", "z", "^", "ª", "º",
  "æ", "ø", "å", "ä", "ö", "á", "é", "ò", "ú", "à", "è", "ù", "Æ", "Ø", "Å", "Ö", "Ä", "Á", "É", "Ò", "Ú", "À", "È"
];

const tblOptions = {
  align       : [ "l" ],
  delimiter   : char.sep,
  stringLength: utils.ansiLength,
  start       : "?G",
  end         : "?R"
};

function formatterLong(data) {
  const isWebExt = data.path.startsWith("webextensions");
  const flags = [];
  const hint = {
    exp   : false,
    dep   : false,
    nonStd: false,
    parent: false
  };
  let hasHints = false;

  /* Header ------------------------------------------------------------------*/

  log();

  // path + api, status, url
  log(utils.breakAnsiLine(`?c${data.prePath}?w${data.name}?R`, options.maxChars));
  if ( !isWebExt ) {
    log(getStatus());
  }
  if ( data.url ) log((data.url ? "?G" + data.url : "-") + "?R");

  // Short title
  if ( data.title && data.title.length ) {
    let short = utils.entities("?w" + utils.breakAnsiLine(utils.cleanHTML(data.title, true, "?w"), options.maxChars));
    log(lf + short);
  }

  // Description
  if ( options.desc ) {
    if ( data.description && data.description !== data.title ) {
      let desc = utils.entities("?w" + utils.breakAnsiLine(utils.cleanHTML(data.description, true, "?w"), options.maxChars));
      log(lf + desc);
    }
    else {
      log(lf + "?R" + text.noDescription);
    }
  }

  log("?R");

  /* Show table data ---------------------------------------------------------*/

  if ( options.desktop && data.browsers.desktop.length ) doDevice("desktop");
  if ( options.mobile && data.browsers.mobile.length ) doDevice("mobile");
  if ( options.ext && data.browsers.ext.length ) doDevice("ext");

  /* Show hints if any -------------------------------------------------------*/

  if ( options.expert < 2 ) {
    if ( hint.dep || hint.nonStd || hint.exp || hint.parent ) {
      let hints = [];
      if ( hint.exp ) hints.push(`?y${char.experimental}?R = ${text.experimental}`);
      if ( hint.dep ) hints.push(`?b${char.deprecated}?R = ${text.deprecated}`);
      if ( hint.nonStd ) hints.push(`?r${char.nonStd}?R = ${text.nonStandard}`);
      if ( hint.parent ) hints.push(`?g${char.parent}?R = ${text.listParent}`);
      log("?R" + hints.join(", ") + lf);
    }
  }

  /* Show flags and history --------------------------------------------------*/

  if ( options.flags || options.history ) {
    if ( options.desktop ) getFlags("desktop");
    if ( options.mobile ) getFlags("mobile");
    if ( options.ext ) getFlags("ext");
    if ( flags.length ) {
      addHeader((options.history ? text.hdrFlagsHistory : text.hdrFlags) + " (?m" + char.flags + "?b)");
      log(flags.join(lf));
      log("?R");
    }
  }

  /* Show notes --------------------------------------------------------------*/

  if ( options.notes && data.notes.length ) {
    addHeader(text.hdrNotes);
    data.notes.forEach(note => {
      let res = `?c${refs[ note.index % refs.length ]}?R: `;
      res += `?R${utils.cleanHTML(note.note, true, "?R", "?c", "?y")}`;
      res += hasLink(note.note) ? `?R ${text.refLink} ${linkFromNoteIndex(note).linkIndex}.?R` : "?R";

      log(utils.breakAnsiLine(res, options.maxChars));
    });
    log("?R");

    // Links in notes
    if ( options.notes && data.links.length ) {
      addHeader(text.hdrLinks);
      let lastIndex = "";
      data.links.forEach(link => {
        let index;
        if ( link.index === lastIndex ) {
          index = "".padStart(Math.log10(data.links.length) + 1) + "  ";
        }
        else {
          lastIndex = link.index;
          index = `?c${link.linkIndex}?R: `;
        }

        log(`${index}?G${link.url}?R`);
      });
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

  if ( options.expert < 1 ) {

    if ( !options.desc && data.description.length ) {
      logHint(text.descHint);
    }

    if ( !options.specs && data.specs.length ) {
      logHint(text.specsHint);
    }

    if ( !options.history && data.notes.length ) {
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
    const tableName = [ "?y" + text[ device ].toUpperCase()
      .padEnd(Math.max(0, options.maxChars - 67)) + "?G" ];
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
        if ( name === dataName ) name += "()";
        tbl.push(getLine(name, child.browsers[ device ], child, true));
      });
    }

    log("?G" + table(tbl, tblOptions));
  }

  function getLine(name, status, data, isChild) {
    const color = isChild ? "?R" : (data.isCompat ? "?w" : "?g");

    // Status
    let stat = "";

    if ( !isWebExt ) {
      if ( data.deprecated ) {
        stat += "?b" + char.deprecated;
        hint.dep = true;
      }
      if ( !(data.standard || data.experimental) ) {
        stat += "?r" + char.nonStd;
        hint.nonStd = true;
      }
      if ( data.experimental ) {
        stat += "?y" + char.experimental;
        hint.exp = true;
      }
    }

    if (stat.length) stat += " ";

    // feature/child name as first entry
    const result = [ stat + color + name + "?G" ];

    status
      .sort(sortRefs)
      .forEach(stat => {
        const history = stat.history[ 0 ];
        let version = utils.versionAddRem(history.version_added, history.version_removed, stat.noteIndex.length > 0);

        if ( stat.noteIndex.length ) {
          version += "?c";
          stat.noteIndex.forEach(ref => {
            version += refs[ ref % refs.length ];
          });
        }

        if ( options.flags && history.flags && history.flags.length ) {
          version += "?m" + char.flags;
        }

        version += "?G";
        result.push(version);
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
            let version = utils.ansiFree(utils.versionAddRem(history.version_added, history.version_removed, false, true));
            version = version === char.yes ? "" : " " + version;

            if ( options.history ) {
              if ( history.alternative_name ) flags.push(`?y${name}${version}?R: ${text.altName}: ?c${history.alternative_name}`);
              if ( history.prefix ) flags.push(`?y${name}${version}?R: ${text.vendorPrefix}: ?c${history.prefix}`);
              if ( history.partial_implementation ) flags.push(`?y${name}${version}?R: ${text.partialImpl}.`);
              if ( history.notes.length ) {
                const _noteRefs = history.notes.map(i => refs[ i % refs.length ]).join("?R,?c");
                flags.push(`?y${name}${version}?R: ${text.seeNote} ?c${_noteRefs}?w`);
              }
            }

            if ( options.flags && history.flags.length ) {
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

  function linkFromNoteIndex(note) {
    for(let link of data.links) {
      if (link.index === note.index) return link
    }
    return {linkIndex: "-"}
  }

  function addHeader(txt) {
    log(`?b${txt}?R`);
  }

  function sortRefs(a, b) {
    return a < b ? -1 : (a > b ? 1 : 0);
  }

}

module.exports = formatterLong;
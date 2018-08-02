/*
  Formatter Long module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const utils = loadModule("core.utils");
const Output = loadModule("core.output");
const out = new Output(0, lf);
const table = loadModule("core.table");
const browserNames = utils.getBrowserLongNames();
const refs = ["°", "¹", "²", "³", "ª", "^", "`", "'", "\"", "'\"", "\"\"", "\"\"'", "º"];

const tblOptions = {
  align       : [ "l" ],
  delimiter   : global.sepChar,
  stringLength: utils.ansiLength,
  end         : "?R"
};

function formatterLong(data) {
  let workerHint = false;
  let sabHint = false;

  // Header
  if (data.name === "worker_support") {
    out.addLine(lf, "?c", text.hdrWorkers, "?w");
    out.addLine("%0", getStatus());
  }
  else if (data.name === "SharedArrayBuffer_as_param") {
    out.addLine(lf, "?c", text.hdrSAB, "?w");
    out.addLine("%0", getStatus());
  }
  else {
    out.addLine("\n?c%0?w%1?R", data.prePath, data.name);
    out.addLine("%0", getStatus());
    if (data.url) out.addLine(data.url ? "?G" + data.url : "-", "?R");

    // Short title
    if (data.short && data.short.length) {
      let short = utils.entities("?R" + utils.breakAnsiLine(utils.cleanHTML(data.short), options.maxChars));
      out.addLine(short, lf)
    }

    // Description
    if (options.desc && data.description && data.description !== data.short) {
      let desc = utils.entities("?R" + utils.breakAnsiLine(utils.cleanHTML(data.description), options.maxChars));
      out.addLine(lf, desc, lf)
    }
  }

  // Show table data
  if (options.desktop) doDevice("desktop");
  if (options.mobile) doDevice("mobile");
  if (options.ext) doDevice("ext");

  if (workerHint) {
    out.addLine(lf, utils.breakAnsiLine(text.workerHint, options.maxChars))
  }

  if (sabHint) {
    out.addLine(lf, utils.breakAnsiLine(sabHint, options.maxChars))
  }

  // Show table data for workers/SharedArrayBuffer
  if (options.workers && data.workers) formatterLong(data.workers);
  if (options.sab && data.sab) formatterLong(data.sab);

  // Show history
  if (options.history) {
    //if (options.desktop) out.add(doHistory("desktop"), lf);
  }

  // Show notes
  if (options.notes && data.notes.length) {
    // Notes
    out.addLine(lf, "?c", text.hdrNotes);
    data.notes.forEach(note => {
      let res = "?c" + refs[note.index % refs.length] + "?R: ";
      res += "?R" + utils.cleanHTML(note.note, true, "?R", "?c", "?y");
      res += (hasLink(note.note) ? `?R ${text.refLink} ${note.index}.?R` : "?R");

      out.addLine(utils.breakAnsiLine(res, options.maxChars))
    });

    // Links in notes
    if (options.notes && data.links.length) {
      out.addLine(lf, "?c", text.hdrLinks);
      data.links.forEach(link => {
        out.addLine("?c", link.index, "?R", ": ", "?y", link.url, "?R")
      })
    }
  }

  // Show flags
  if ((options.flags && hasFlags()) || (options.history && hasHistory())) {
    out.addLine(lf, "?c", text.hdrFlagsHistory);
    if (options.desktop) getFlags("desktop");
    if (options.mobile) getFlags("mobile");
    if (options.ext) getFlags("ext");
  }

  // Show specifications?
  if (options.specs && data.specs.length) {
    out.addLine(lf, "?c", text.hdrSpecs);
    data.specs.forEach(spec => {
      out.addLine(
        "?w" + `${utils.entities(spec.name) + lf}  ${getSpecStatus(spec.status) + lf}  ${spec.url}`
      );
    });
    out.addLine();
  } // :specs

  function doDevice(device) {
    const dev = data.browsers[device];
    const dataName = data.name;
    const tbl = [];
    let extra = "";

    // Device name
    tbl.push(
      ["?w" + text[device] + "?G"].concat(dev.map(o => `?w${browserNames[o.browser].padEnd(10)}?G`))
    );

    // Main feature name
    tbl.push(getLine(data.isCompat ? dataName : "P " + dataName, dev, data.isCompat ? "?w" : "?g"/*, 2*/));

    if (options.children && data.children.length) {
      data.children.forEach((child/*, i*/) => {
        let name = child.name;

        if (!workerHint && !options.workers && name === "worker_support") workerHint = true;
        if (!sabHint && !options.sab && name === "SharedArrayBuffer_as_param") sabHint = true;

        if (name === dataName) name += "()";
        if (!(child.standard || child.experimental || child.deprecated)) name = "?G-" + name;

        tbl.push(getLine(name, child.browsers[ device ], "?R"/*, i+2*/))
      })
    }
    else if (!dataName.includes("_")) extra = lf;

    out.add(lf, "?G", table(tbl, tblOptions), lf, extra)
  }

  function getLine(name, status, color/*, bgToggle*/) {
    //const bg = bgToggle % 4 === 0 ? ANSI.bg2 : ANSI.bg1;

    // feature/child name as first entry
    const result = [color /* + bg*/ + utils.getFeatureName(name) + "?G "];

    status
      .sort(sortRefs)
      .forEach(stat => {
        const history = stat.history[0];
        let v = utils.versionAddRem(history.add, history.removed);

        if (stat.noteIndex.length) {
          v += "?c";
          stat.noteIndex.forEach(ref => {
            v += refs[ref % refs.length]
          })
        }

        v += "?G";
        result.push(/*bg + */ v);
      });

    return result
  } // : getLine

  function hasFlags() {
    const devices = [];
    if (options.desktop) devices.push("desktop");
    if (options.mobile) devices.push("mobile");
    if (options.ext) devices.push("ext");

    for(let device of devices) {
      for(let browser of data.browsers[device]) {
        if (browser.history.length) {
          if (options.history) return true;
          let max = options.history ? browser.history.length : 1;
          for(let i = 0; i < max; i++) {
            if (browser.history[i].flags.length) return true
          }
        }
      }
    }
    return false
  } // : hasFlags

  function hasHistory() {
    const devices = [];
    if (options.desktop) devices.push("desktop");
    if (options.mobile) devices.push("mobile");
    if (options.ext) devices.push("ext");

    for(let device of devices) {
      for(let browser of data.browsers[device]) {
        if (browser.history.length) return true
      }
    }
    return false
  } // : hasHistory

  function getFlags(device) {
    const flags = [];

    data.browsers[device].forEach(browser => {
      const name = browserNames[browser.browser];

      if (browser.history.length) {
        let max = options.history ? browser.history.length : 1;
        for(let i = 0; i < max; i++) {
          let history = browser.history[i];
          let version = utils.ansiFree(utils.versionAddRem(history.add, history.removed));

          if (options.history) {
            let _version = isNaN(version) ? "" : " " + version;
            if (history.altName) flags.push(`?y${name}${_version}?w: ${text.altName}: ?c${history.altName}?w` + lf);
            if (history.prefix) flags.push(`?y${name}${_version}?w: ${text.vendorPrefix}: ?c${history.prefix}?w` + lf);
            if (history.partial) flags.push(`?y${name}${_version}?w: ${text.partialImpl}.?w` + lf);
            if (history.notes.length) flags.push(`?y${name}${_version}?w: ${text.seeNote} ?c${history.notes.map(i => refs[i % refs.length]).join(", ")}?w` + lf);
          }

          if (options.flags && history.flags.length) {
            if (isNaN(version)) version = "";
            else version = " " + version;

            let entry = "?y" + name + version + ":?w ";
            history.flags.forEach(flag => {
              switch(flag.type) {
                case "preference":
                  entry += `${text.thisFeatBehind} ?c${flag.name}?w ${text.preference}.`;
                  if (flag.value_to_set) entry += ` (${text.setTo} ?c${flag.value_to_set}?w).`;
                  break;
                case "compile_flag":
                  entry += `${text.compileWith} ?c${flag.name}?w ${text.setTo} ?c${flag.value_to_set}?w.`;
                  break;
                case "runtime_flag":
                  entry += `${text.startWith} ?c${flag.name}?w. `;
                  break;
              }
            });
            flags.push(utils.breakAnsiLine(entry, options.maxChars) + lf)
          }
        }
      }
    });

    out.add(flags.join(""))
  } // : getFlags

  function hasLink(str) {
    return str.includes("<a href")
  }

  function getStatus() {
    let status = [];
    if (data.standard) status.push(`?g${text.standard}?R`);
    if (data.experimental) status.push(`?y${text.experimental}?R`);
    if (data.deprecated) status.push(`?r${text.deprecated}?R`);
    if (!status.length) status.push(`?r${text.nonStandard}?R`);
    return status.join(", ")
  } // : getStatus

  function getSpecStatus(status) {
    switch(status.toUpperCase()) {
      case "REC":
        return `?g${text.specRecommendation}?R`;
      case "PR":
        return `?y${text.specProposed} ${text.specRecommendation}?R`;
      case "CR":
        return `?c${text.candidate} ${text.specRecommendation}?R`;
      case "RC":
        return `?c${text.specRelease} ${text.specCandidate}?R`;
      case "WD":
        return `?b${text.specWorking} ${text.specDraft}?R`;
      case "ED":
        return `?g${text.specEditors} ${text.specDraft}?R`;
      case "OLD-TRANSFORMS":
        return `?o${text.hasMergedAnother} ${text.specDraft.toLowerCase()}?R`;
      case "LIVING":
        return `?c${text.specLiving} ${text.specStandard}?R`;
      case "RFC":
        return `?yIETF RFC?R`;
      case "STANDARD":
        return `?g${text.specStandard}?R`;
      case "DRAFT":
        return `?y${text.specDraft}?R`;
      case "OBSOLETE":
        return `?r${text.obsolete}?R`;
      case "LC":
        return `?y${text.lastCallWorking} ${text.specDraft}?R`;
      default:
        return `?y${text.status}?R`
    }
  } // : getSpecStatus

  function sortRefs(a, b) {
    return a < b ? -1 : (a > b ? 1 : 0)
  }

  return out.toString()
}

module.exports = formatterLong;
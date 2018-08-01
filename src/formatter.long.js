/*
  Formatter Long module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const utils = loadModule("core.utils");
const refs = ["°", "¹", "²", "³", "ª", "^", "`", "'", "\"", "'\"", "\"\"", "\"\"'", "º"];
const Output = loadModule("core.output");
const out = new Output(0, lf);
const table = require("markdown-table");
const browserNames = utils.getBrowserShortNames();

const tblOptions = {
  align: ["l", "c", "c", "c", "c", "c", "c"],
  delimiter: global.sepChar,
  stringLength: utils.ansiLength,
  pad: true,
  start: "",
  end: ""
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
    out.addLine(lf, utils.breakAnsiLine("?R*) Use option ?c--workers?R to see Worker support details.", options.maxChars))
  }

  if (sabHint) {
    out.addLine(lf, utils.breakAnsiLine("?R*) Use option ?c--sab?R to see SharedArrayBuffer as a parameter details.", options.maxChars))
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
      res += (hasLink(note.note) ? `?R Ref link ${note.index}.?R` : "?R");

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
    const tbl = [];
    let extra = "";

    tbl.push(
      ["?w" + text.device[device] + "?G"]
        .concat(dev.map(o => "?w" + browserNames[o.browser].padEnd(10) + "?G"))
    );
    tbl.push(getLine(data.name, dev, "?w"));

    if (options.children && data.children.length) {
      data.children.forEach(child => {
        if (!workerHint && !options.workers && child.name === "worker_support") workerHint = true;
        if (!sabHint && !options.sab && child.name === "SharedArrayBuffer_as_param") sabHint = true;
        let name = child.name;
        if (child.name === data.name) name += "()";
        tbl.push(getLine(name, child.browsers[ device ], "?R"))
      })
    }
    else if (!data.name.includes("_")) extra = lf;

    out.add(lf, "?G", table(tbl, tblOptions), lf, extra)
  }

  function getLine(name, status, color) {
    name = name
      .replace("worker_support", text.workerSupport)
      .replace("sab_in_dataview", text.sabInDataView)
      .replace("SharedArrayBuffer_as_param", text.sabSupport)
      .replace(/_/g, " ");

    const result = [color + name + "?G "];

    status
      .sort(sortRefs)
      .forEach(stat => {
        const history = stat.history[0];
        let v = utils.versionAddRem(history.add, history.removed);

        if (stat.noteIndex.length) {
          v += "?c";
          stat.noteIndex.forEach(ref => {
            v += refs[ref % refs.length]
          });
        }

        v += "?G";
        result.push(v);
      });

    return result
  }

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
  }

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
  }

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
            if (history.altName) flags.push(`?y${name}${_version}?w: Alternative name: ?c${history.altName}?w` + lf);
            if (history.prefix) flags.push(`?y${name}${_version}?w: Vendor prefixed: ?c${history.prefix}?w` + lf);
            if (history.partial) flags.push(`?y${name}${_version}?w: Partial support.?w` + lf);
            if (history.notes.length) flags.push(`?y${name}${_version}?w: See note ?c${history.notes.map(i => refs[i % refs.length]).join(", ")}?w` + lf);
          }

          if (options.flags && history.flags.length) {
            if (isNaN(version)) version = "";
            else version = " " + version;

            let entry = "?y" + name + version + ":?w ";
            history.flags.forEach(flag => {
              switch(flag.type) {
                case "preference":
                  entry += `This feature is behind the ?c${flag.name}?w preference.`;
                  if (flag.value_to_set) entry += ` (needs to be set to ?c${flag.value_to_set}?w).`;
                  break;
                case "compile_flag":
                  entry += `Compile with ?c${flag.name}?w set to ?c${flag.value_to_set}?w.`;
                  break;
                case "runtime_flag":
                  entry += `Start with ?c${flag.name}?w. `;
                  break;
              }
            });
            flags.push(utils.breakAnsiLine(entry, options.maxChars) + lf)
          }
        }
      }
    });

    out.add(flags.join(""))
  }

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
  }

  function getSpecStatus(status) {
    switch(status.toUpperCase()) {
      case "REC":
        return "?gRecommendation?R";
      case "PR":
        return "?yProposed Recommendation?R";
      case "CR":
        return "?cCandidate Recommendation?R";
      case "RC":
        return "?cRelease Candidate?R";
      case "WD":
        return "?bWorking Draft?R";
      case "ED":
        return "?gEditor's Draft?R";
      case "OLD-TRANSFORMS":
        return "?oThis has been merged in another draft?R";
      case "LIVING":
        return "?cLiving Standard?R";
      case "RFC":
        return "?yIETF RFC?R";
      case "STANDARD":
        return "?gStandard?R";
      case "DRAFT":
        return "?yDraft?R";
      case "OBSOLETE":
        return "?rObsolete?R";
      case "LC":
        return "?yLast Call Working Draft?R";
      default:
        return "?y" + status + "?R"
    }
  }

  function sortRefs(a, b) {
    return a < b ? -1 : (a > b ? 1 : 0)
  }

  return out.toString()
}

module.exports = formatterLong;
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
  out.addLine("\n%0%1%2%3", ANSI.cyan, data.prePath, ANSI.white, data.name, ANSI.reset);
  out.addLine("%0", getStatus());
  if (data.url) out.addLine(data.url ? ANSI.gray + data.url : "-", ANSI.reset);

  // Short title
  if (data.short && data.short.length) {
    let short = utils.entities(ANSI.reset + utils.breakAnsiLine(utils.cleanHTML(data.short), options.maxChars));
    out.addLine(short, lf)
  }

  // Description
  if (options.desc && data.description && data.description !== data.short) {
    let desc = utils.entities(ANSI.reset + utils.breakAnsiLine(utils.cleanHTML(data.description), options.maxChars));
    out.addLine(lf, desc.replace(/\n /gm, "\n"), lf)
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

  // Show table data
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
      let res = ANSI.cyan + refs[note.index % refs.length] + ANSI.reset + ": ";
      res += ANSI.yellow + utils.cleanHTML(note.note, true, ANSI.yellow, ANSI.cyan, ANSI.orange);
      res += (hasLink(note.note) ? ` Ref link ${note.index}.` : "") + ANSI.reset;

      out.addLine(utils.breakAnsiLine(res, options.maxChars).replace(/\n /gm, "\n"))
    });

    // Links in notes
    if (options.notes && data.links.length) {
      out.addLine(lf, ANSI.cyan, text.hdrLinks);
      data.links.forEach(link => {
        out.addLine("?c", link.index, "?R", ": ", "?y", link.url, "?R")
      })
    }
  }

  // Show flags
  if ((options.flags || options.history) && hasFlags()) {
    out.addLine(lf, "?c", text[options.history ? "hdrFlagsHistory" : "hdrFlags"]);
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

    tbl.push(
      [ANSI.white + text.device[device] + ANSI.gray]
        .concat(dev.map(o => ANSI.white + browserNames[o.browser].padEnd(10) + ANSI.gray))
    );
    tbl.push(getLine(data.name, dev, ANSI.white));

    if (options.children) {
      data.children.forEach(child => {
        if (!options.workers && child.name === "worker_support") workerHint = true;
        if (!options.sab && child.name === "SharedArrayBuffer_as_param") sabHint = true;
        tbl.push(getLine(child.name, child.browsers[ device ], ANSI.yellow))
      })
    }

    out.add(lf, ANSI.gray, table(tbl, tblOptions), lf)
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
            if (history.altName) flags.push(`?y${name} ${version}?w: Alternative name: ?c${history.altName}?w`);
            if (history.prefix) flags.push(`?y${name} ${version}?w: Vendor prefixed: ?c${history.prefix}?w`);
            if (history.partial) flags.push(`?y${name} ${version}?w: Partial support.?w`);
            if (history.notes.length) flags.push(`?y${name} ${version}?w: See notes: ?c${history.notes.join(", ") + lf}?w`);
          }

          if (history.flags.length) {
            if (isNaN(version)) version = "";
            else version = " " + version;

            let entry = ANSI.yellow + name + version + ": " + ANSI.white;
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
            flags.push(utils.breakAnsiLine(entry, options.maxChars).replace(/\n /gm, "\n") + lf)
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
    if (data.standard) status.push(ANSI.green + text.standard + ANSI.reset);
    if (data.experimental) status.push(ANSI.yellow + text.experimental + ANSI.reset);
    if (data.deprecated) status.push(ANSI.red + text.deprecated + ANSI.reset);
    return status.join(", ")
  }

  function getLine(name, status, color) {
    name = name
      .replace("worker_support", text.workerSupport)
      .replace("SharedArrayBuffer_as_param", text.sabSupport);

    const result = [color + name + ANSI.gray + " "];

    status
      .sort(sortRefs)
      .forEach(stat => {
        const history = stat.history[0];
        let v = utils.versionAddRem(history.add, history.removed);

        if (stat.noteIndex.length) {
          v += ANSI.cyan;
          stat.noteIndex.forEach(ref => {
            v += refs[ref % refs.length]
          });
        }

        v += ANSI.gray;
        result.push(v);
      });

    return result
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
    return a < b ? -1 : (a >  b ? 1 : 0)
  }


  //  // worker support ?
//  if (options.workers && mdnComp.workers) {
//    out.addLine(ANSI.cyan + "WEB WORKER SUPPORT:");
//    out.add(compatToLong(mdnComp.workers, true) + lf)
//  }
//
//  // SharedArrayBuffer as param support ?
//  if (options.sab && mdnComp.sharedAB) {
//    out.addLine(ANSI.cyan + "SHAREDARRAYBUFFER AS PARAM SUPPORT:");
//    out.add(compatToLong(mdnComp.sharedAB, true) + lf)
//  }

  return out.toString()
}

module.exports = formatterLong;
/*
  table module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

const utils = loadModule("core.utils");

function table(tbl, options) {
  const sizes = [];

  options = Object.assign({
    align       : [],
    alignDefault: "c",
    start       : "",
    end         : "",
    delimiter   : "|",
    headerLine  : true,
    padding     : 3,
    header      : true,
    stringLength: utils.ansiLength
  }, options);

  // get sizes
  tbl.forEach(line => {
    line.forEach((cell, i) => {
      let size = options.stringLength(cell);
      if (!sizes[i] || sizes[i] < size) sizes[i] = Math.max(options.padding, size, 3);
    })
  });

  // result
  let result = "";
  tbl.forEach((line, i) => {result += buildLine(line, i === 0 && options.header)});

  function buildLine(cells, isHeader) {
    let line = options.start;
    let hdr = isHeader ? options.start : "";

    cells.forEach((cell, i) => {
      const align = options.align[i] || options.alignDefault;
      const len = options.stringLength(cell);
      const cellLen = sizes[i];
      const padding = cellLen - len;

      switch(align) {
        case "l":
          line += cell + " ".repeat(padding);
          if (isHeader) hdr += ":" + "-".repeat(cellLen - 1);
          break;

        case "c":
          let diff = padding>>1;
          let start = Math.max(0, diff);
          let end = Math.max(0, padding - start);
          line += " ".repeat(start) + cell.padStart(options.padding) + " ".repeat(end);
          if (isHeader) hdr += ":" + "-".repeat(cellLen - 2) + ":";
          break;

        case "r":
          line += cell.padStart(options.padding);
          if (isHeader) hdr += "-".repeat(cellLen - 1) + ":";
          break;

        default:
          line += cell + " ".repeat(padding);
          if (isHeader) hdr += "-".repeat(cellLen);
      }

      if (i < cells.length - 1) {
        line += options.delimiter;
        if (isHeader) hdr += options.delimiter;
      }
    });

    return line + options.end + lf + (isHeader ? hdr + options.end + lf : "");
  }

  return result
}

module.exports = table;
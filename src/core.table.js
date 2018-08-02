/*
  table module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

"use strict";

function table(tbl, options) {
  const cellWidths = [];

  options = Object.assign({
    align         : [],
    alignDefault  : "c",
    start         : "",
    end           : "",
    delimiter     : "|",
    headerLine    : true,
    headerLineChar: "-",
    headerLineSep : "|",
    width         : 3,
    header        : true,
    lineEnding    : "\r\n",
    stringLength  : s => s.length
  }, options);

  const minWidth = options.header ? 3 : 1;

  // get cell sizes
  tbl.forEach(line => {
    line.forEach((cell, i) => {
      let size = Math.max(options.stringLength(cell), options.width, minWidth);
      if ( !cellWidths[ i ] || cellWidths[ i ] < size ) cellWidths[ i ] = size;
    });
  });

  // render table
  let result = "";
  tbl.forEach((line, i) => {
    result += buildLine(line, !i && options.header)
  });

  function buildLine(cells, isHeader) {
    const hdrChar = options.headerLineChar.substr(0, 1);
    let line = options.start;
    let hdr = isHeader ? options.start : "";

    cells.forEach((cell, i) => {
      const align = options.align[ i ] || options.alignDefault;
      const strLen = options.stringLength(cell);
      const cellLen = cellWidths[ i ];
      const padding = cellLen - strLen;

      if ( align === "c" ) {
        const diff = padding >> 1;
        const start = Math.max(0, diff);
        const end = Math.max(0, padding - start);
        line += " ".repeat(start) + cell + " ".repeat(end);
        if ( isHeader ) hdr += ":" + hdrChar.repeat(cellLen - 2) + ":";
      }
      else if ( align === "r" ) {
        line += cell.padStart(cell.length + padding);
        if ( isHeader ) hdr += hdrChar.repeat(cellLen - 1) + ":";
      }
      else {
        line += cell.padEnd(cell.length + padding);
        if ( isHeader ) hdr += (align === "l") ? hdr += ":" + hdrChar.repeat(cellLen - 1) : hdrChar.repeat(cellLen);
      }

      if ( i < cells.length - 1 ) {
        line += options.delimiter;
        if ( isHeader ) hdr += options.headerLineSep;
      }
    });

    return line + options.end + options.lineEnding + (isHeader ? hdr + options.end + options.lineEnding : "")
  }

  return result
}

module.exports = table;
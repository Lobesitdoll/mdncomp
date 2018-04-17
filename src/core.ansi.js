/*
  ANSI defs.
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

module.exports = {
  bright: "\x1b[1m",
  dim   : "\x1b[2m",

  clrToCursor: "\x1b[1K",
  cursorUp   : "\x1b[1A",

  black  : "\x1b[30m",
  red    : "\x1b[31;1m",
  green  : "\x1b[32;1m",
  yellow : "\x1b[33;1m",
  orange : "\x1b[33;2m",
  blue   : "\x1b[34;1m",
  magenta: "\x1b[35;2m",
  cyan   : "\x1b[36;1m",
  white  : "\x1b[37;1m",
  gray   : "\x1b[30;1m",
  reset  : "\x1b[0m"
};
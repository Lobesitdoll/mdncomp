/*
  ANSI defs.
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

module.exports = {
  bright: "\x1b[0;1m",
  dim   : "\x1b[0;2m",

  clrToCursor: "\x1b[2K",
  cursorUp   : "\x1b[1A",

  black  : "\x1b[0;30m",
  red    : "\x1b[0;1;31m",
  green  : "\x1b[0;1;32m",
  yellow : "\x1b[0;1;33m",
  orange : "\x1b[0;2;33m",
  blue   : "\x1b[0;1;34m",
  magenta: "\x1b[0;2;35m",
  cyan   : "\x1b[0;1;36m",
  white  : "\x1b[0;1;37m",
  gray   : "\x1b[0;1;30m",
  reset  : "\x1b[0m"/*,

  bg1    : "\x1b[49m",
  bg2    : "\x1b[44m"*/
};
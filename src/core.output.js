/*
  Output object module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const utils = loadModule("core.utils");

/**
 * Output object collecting strings and
 * produces a final string.
 * @constructor
 */
function Output(indent, lf) {
  this.string = "";
  this.indent = "".padStart(indent|0);
  this.linefeed = lf;
}

Output.prototype = {
  /**
   * Add text. Can contain formatting using %n where n is a number.
   * The arguments are appended to the call.
   * @example
   *     o.add("Some %0 text", "cool");
   *     o.add("this ", "will ", "be ", "joined");
   *
   * @param txt - text, format string
   */
  add: function(txt) {
    txt = txt ? txt : "";
    if (arguments.length > 1) {
      let format = txt.indexOf("%0") >= 0;
      for(let i = 1; i < arguments.length; i++) {
        let regEx = new RegExp("%" + (i - 1), "g");
        txt = format ? txt.replace(regEx, arguments[i]) : txt + arguments[i];
      }
    }
    this.string += this.indent + (txt || "");
  },

  /**
   * Same as add() but with an additional linefeed at the end.
   * @param txt
   */
  addLine: function(txt) {
    this.add.apply(this, arguments);
    this.string += this.linefeed;
  },

  /**
   * Trim n chars off the end
   * @param n
   */
  trimEnd: function(n) {
    this.string = this.string.substr(0, Math.max(0, this.string.length - n))
  },

  replace: function(keyword, newText) {
    let regEx = new RegExp(keyword, "g");
    this.string = this.string.replace(regEx, newText);
  },

  toString: function() {
    return utils.parseColorCodes(this.string)
  }
};

module.exports = Output;
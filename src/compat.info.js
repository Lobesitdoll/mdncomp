/**
 * This object formats and stores information per browser.
 * It is used to normalize the API to address future changes.
 * @param obj
 * @constructor
 */
function Info(obj) {
  this.added = this.toStatus(obj.version_added);
  this.removed = this.toStatus(obj.version_removed);
  this.notes = obj.notes ? (Array.isArray(obj.notes) ? obj.notes : [obj.notes]) : [];
  this.partial = !!obj.partial_implementation;
  this.altName = obj.alternative_name || "";
  this.flags = obj.flags || []; // todo add to notes

  if (obj.prefix) this.notes.unshift("Prefix: " + obj.prefix);

  this.flags.forEach(flag => {
    this.notes.push(breakLine(cleanHTML(this.flagToString(flag), true), options.maxWidth))
  });
}

Info.prototype = {

  getVersion: function() {
    return this.removed ? this.added + "-" + this.removed.replace(yes, "?") : this.added
  },

  flagToString: function(flag) {
    switch(flag.type) {
      case "preference": return line("Behind flag " + ANSI.cyan);
      case "compile_flag": return line("Compile with " + ANSI.cyan);
      case "runtime_flag": return line("Run with " + ANSI.cyan);
    }

    function line(prefix) {
      return prefix + flag.name + ANSI.white + (flag.value_to_set ? " set to " + flag.value_to_set + "" : "") + ".";
    }

    return ""
  },

  /**
   *
   * @param ref
   * @returns {string}
   */
  toString: function(ref) {
    let
      prefix = (ref ? ref + ") " : "") + (isNaN(this.added) ? "" : this.getVersion() + ": "),
      indent = "",
      out = new Output(0), hasInfo = false;

//    if (this.altName.length) {
//      hasInfo = true;
//      out.addLine("- Alternative name: " + this.altName);
//    }
//
//    if (this.partial) {
//      hasInfo = true;
//      out.addLine("- Is a partial implementation");
//    }

    if (this.notes.length > 1) {
      prefix += lf;
      indent = "- ";
    }

    this.notes.forEach(note => {
      hasInfo = true;
      out.addLine(breakLine(cleanHTML(indent + note, true), options.maxWidth))
    });

    return hasInfo ? prefix + out.toString() : ""
  },

  /**
   * Convert machine status to human readable status
   * @param {*} status - input
   * @returns {*} if input = "true" (string or boolean) then output is "Yes", otherwise original input
   */
  toStatus: function(status) {
    if (typeof status === "boolean") return status ? yes : no;
    else if (null === status) return "?";
    return status ? status : null
  }
};
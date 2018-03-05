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
  this.flags = obj.flags || [];

  if (obj.prefix)
    this.notes.unshift("Prefix: " + obj.prefix);

  if (obj.partial_implementation)
    this.notes.unshift("Is partial implementation.");

  if (obj.alternative_name)
    this.notes.unshift("Uses a non-standard name: " + obj.alternative_name);

  this.flags.forEach(flag => {
    this.notes.push(this.flagToString(flag));
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
  // todo should be neutral or produce per context (text, svg etc. => move to formatter)
  toString: function(ref) {
    let
      prefix = (ref ? ref + ") " : "") + (isNaN(this.added) ? "" : this.getVersion() + ": "),
      indent = "",
      out = new Output(0), hasInfo = false;

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
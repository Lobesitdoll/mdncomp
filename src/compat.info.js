/**
 * This object formats and stores information per browser.
 * It is used to normalize the API to address future changes.
 * @param obj
 * @constructor
 */
function Info(obj) {
  this.prefix = obj.prefix || "";
  this.added = this.toStatus(obj.version_added);
  this.removed = this.toStatus(obj.version_removed);
  this.notes = obj.notes ? (Array.isArray(obj.notes) ? obj.notes : [obj.notes]) : [];
  this.partial = !!obj.partial_implementation;
  this.altName = obj.alternative_name || "";
  this.desc = obj.description || "";              //check for future use
  this.flags = obj.flags || [];
}

Info.prototype = {

  getVersion: function() {
    return this.removed ? this.added + "-" + this.removed.replace(yes, "?") : this.added
  },

  flagToString: function(flag) {
    switch(flag.type) {
      case "preference": return line("- Behind flag ");
      case "compile_flag": return line("- Compile with ");
      case "runtime_flag": return line("- Run with ");
    }

    function line(prefix) {
      return prefix + flag.name + (flag.value_to_set ? " set to " + flag.value_to_set + "" : "") + ".";
    }

    return ""
  },

  /**
   *
   * @param ref
   * @returns {string}
   */
  toString: function(ref) {
    ref = ref ? ref + ") " : "";
    let
      out = new Output(0),
      prefix = ref + (isNaN(this.added) ? "" : this.getVersion() + ":") + lf,
      hasInfo = false;

    if (this.prefix.length) {
      hasInfo = true;
      out.addLine("- Prefix: " + this.prefix);
    }

    if (this.altName.length) {
      hasInfo = true;
      out.addLine("- Alternative name: " + this.altName);
    }

    if (this.partial) {
      hasInfo = true;
      out.addLine("- Is a partial implementation");
    }

    this.flags.forEach(flag => {
      hasInfo = true;
      out.addLine(breakLine(cleanHTML(this.flagToString(flag)), options.maxWidth))
    });

    this.notes.forEach(note => {
      hasInfo = true;
      out.addLine(breakLine(cleanHTML("- " + note), options.maxWidth))
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
/**
 * Formats and stores information objects per browser
 * via the Info object.
 * @param obj - __compat
 * @param name - machine name of browser
 * @constructor
 */
function Browser(obj, name) {
  this.name = name;
  this.info = [];
  //this.isDesktop = true;

  // support_statement for this browser (by machine name)
  let support = obj.support[name];
  if (!Array.isArray(support)) support = [support];

  support.forEach(supportItem => {
    this.info.push(new Info(supportItem));
  })
}

Browser.prototype = {

  hasNotes: function() {
    for(let i = 0; i < this.info.length; i++) {
      if (this.info[i].notes.length) return true;
    }
    return false
  },

  hasFlags: function() {
    for(let i = 0; i < this.info.length; i++) {
      if (this.info[i].flags.length) return true;
    }
    return false
  },

  hasPrefix: function() {
    for(let i = 0; i < this.info.length; i++) {
      if (this.info[i].prefix.length) return true;
    }
    return false
  },

  getNotes: function(ref) {
    let out = new Output(0);
    this.info.forEach(info => {
      out.add(info.toString(ref))
    });

    return out.toString()
  }

};
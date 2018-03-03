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

  // support_statement for this browser (by machine name)
  let support = obj.support[name];
  if (!Array.isArray(support)) support = [support];

  // sort support objects based on version
  //support.sort(_cmp);

  this.prefix = (support[support.length - 1] || {}).prefix || "";

  support.forEach(supportItem => {
    this.info.push(new Info(supportItem));
  });

  function _cmp(b, a) {
    let
      aArr = (a.version_added ? a.version_added + "" : "").split("."),
      bArr = (b.version_added ? b.version_added + "" : "").split("."),
      aNum = (aArr[0]|0) + (aArr[1]|0) * 0.0001 + (aArr[2]|0) * 0.000001 + (aArr[3]|0) * 0.000000001,
      bNum = (bArr[0]|0) + (bArr[1]|0) * 0.0001 + (bArr[2]|0) * 0.000001 + (bArr[3]|0) * 0.000000001;

    return aNum > bNum ? 1 : (aNum < bNum ? -1 : 0)
  }
}

Browser.prototype = {

  hasNotes: function() {
    for(let info of this.info) {
      if (info.notes.length) return true;
    }
    return false
  },

  hasFlags: function() {
    for(let info of this.info) {
      if (info.flags.length) return true;
    }
    return false
  },

  hasPrefix: function() {
    return this.prefix.length > 0
  },

  getNotes: function(ref) {
    let out = new Output(0);
    this.info.forEach(info => {
      out.add(info.toString(ref))
    });

    return out.toString()
  }

};
/**
 * Formats and stores information objects per browser
 * via the Info object.
 * @param obj
 * @param name
 * @constructor
 */
function Browser(obj, name) {
  this.name = name;
  this.isDesktop = true;
  this.info = [];

  let browser = obj.support[name];

  if (!Array.isArray(browser)) browser = [browser];

  browser.forEach(browserItem => {
    this.info.push(new Info(browserItem));
  })

}

Browser.prototype = {

  hasNotes: function() {
    let count = 0;
    this.info.forEach(info => {count += info.notes.length});
    return count > 0
  },

  getNotes: function(ref) {
    let out = new Output(0);
    this.info.forEach(info => {
      out.add(info.toString(ref))
    });

    return out.toString()
  }

};
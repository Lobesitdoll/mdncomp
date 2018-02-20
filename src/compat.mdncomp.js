/**
 * This object formats and stores browser compatibility
 * information for this path.object.
 * @param path
 * @constructor
 */
function MDNComp(path) {
  let
    obj = getPathAsObject(path).__compat,
    names = ["webview_android", "chrome", "chrome_android", "edge", "edge_mobile", "firefox", "firefox_android", "ie", "opera", "opera_android", "safari", "safari_ios"],
    isDesktop = [false, true, false, true, false, true, false, true, true, false, true, false],
    status = obj.status || {},
    keys = Object.keys(obj.support);

  this.path = path;
  this.prePath = prePathFromPath(path),
  this.name = nameFromPath(path);
  this.url = obj.mdn_url || "";
  this.experimental = !!status.experimental;
  this.standard = !!status.standard_track;
  this.deprecated = !!status.deprecated;
  this.browsers = [];

  // Main loop parsing all attached information
  keys.forEach(key => {
    let nameIndex = names.indexOf(key);
    if (nameIndex >= 0) {
      let browser = new Browser(obj, key);
      browser.isDesktop = isDesktop[nameIndex];
      this.browsers.push(browser)
    }
  });

}

MDNComp.prototype = {
  /**
   * Get a browser entry by machine name
   * @param name
   * @returns {*}
   */
  getBrowser: function(name) {
    for(let i = 0; i < this.browsers.length; i++) {
      if (this.browsers[i].name === name) return this.browsers[i];
    }
    return null
  },

  getStatus: function() {
    let txt = "(";
    if (this.experimental) txt += ANSI.fgYellow + "EXPERIMENTAL" + ANSI.reset + ", ";
    if (this.deprecated) txt += ANSI.fgRed + "DEPRECATED" + ANSI.reset + ", ";
    if (this.standard) txt += ANSI.fgGreen + ANSI.bright + "On Standard Track" + ANSI.reset + ", ";
    txt = txt.substr(0, Math.max(1, txt.length - 2)) + ")";
    return txt === "()" ? "" : txt
  },

  hasFlags: function() {
    for(let i = 0; i < this.browsers.length; i++) {
      if (this.browsers[i].hasFlags()) return true;
    }
    return false
  }

};

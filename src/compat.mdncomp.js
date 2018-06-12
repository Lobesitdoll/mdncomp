//const utils = require("./utils");

/**
 * This object formats and stores browser compatibility
 * information for this path.object.
 *
 * Note: This is a normalizing object until schema and BCD format
 * is out of alpha. It also extends the final format mdncomp uses
 * with features such as spec list.
 *
 * @param path
 * @constructor
 */
function MDNComp(path) {
  let
    compat = getPathAsObject(path).__compat,
    names = ["webview_android", "chrome", "chrome_android", "edge", "edge_mobile", "firefox", "firefox_android", "ie", "opera", "opera_android", "safari", "safari_ios"],
    isDesktop = [false, true, false, true, false, true, false, true, true, false, true, false],
    status = compat.status || {},
    supportKeys = Object.keys(compat.support);

  this.path = path;
  this.prePath = prePathFromPath(path);
  this.name = nameFromPath(path);
  this.url = compat.mdn_url && compat.mdn_url.length ? "https://developer.mozilla.org/docs/" + compat.mdn_url : null;
  this.specs = compat.specs || [];
  this.experimental = status.experimental;
  this.standard = status.standard_track;
  this.deprecated = status.deprecated;
  this.browsers = [];
  this.description = compat.description || "";

  // Main loop parsing all attached information
  supportKeys.forEach(key => {
    let nameIndex = names.indexOf(key);
    if (nameIndex >= 0) {
      let browser = new Browser(compat, key);
      browser.isDesktop = isDesktop[nameIndex]; //todo reconsider
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
    for(let browser of this.browsers) {
      if (browser.name === name) return browser;
    }
    return null
  },

  getStatus: function() {
    let txt = "(";
    if (this.deprecated) {
      txt += ANSI.red + "DEPRECATED" + ANSI.reset + ", ";
    }
    else {
      if (this.experimental)
        txt += ANSI.yellow + "EXPERIMENTAL" + ANSI.reset + ", ";
      if (this.standard)
        txt += ANSI.green + "On Standard Track" + ANSI.reset + ", ";
    }

    txt = txt.substr(0, Math.max(1, txt.length - 2)) + ")";

    return txt === "()" ? "" : txt
  },

  hasFlags: function() {
    for(let browser of this.browsers) {
      if (browser.hasFlags()) return true;
    }
    return false
  }

};

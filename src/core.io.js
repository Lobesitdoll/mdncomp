/*
  I/O module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const fs = require("fs");
const path = require("path");
const https = require("https");
const ANSI = global.ANSI;

module.exports = {

  /**
   * Request data from an URL
   * @param {string} url - the (HTTPS) url to load
   * @param {function} onResp - must return true, response header available, no data at this stage
   * @param {function} [onProgress] - onData callback
   * @param {function} onData - gets the data itself
   * @param {function} [onError] - if any errors
   * @param {boolean} [rawBuffer=false] - if true send back raw buffer to callback, otherwise string
   */
  request: function(url, onResp, onProgress, onData, onError, rawBuffer) {
    onResp = onResp || function() {return true};

    let _res;

    const req = https.get(url, res => {
      let buffer = [], current = 0;
      _res = res;

      // handle redirects

      if (!res || !res.statusCode) {
        onError("Could not connect");
      }
      else if (res.statusCode === 301 || res.statusCode === 302) {
        return this.request(res.headers.location, onResp, onProgress, onData, onError);
      }
      else if (res.statusCode === 200 && onResp({headers: res.headers})) {
        let length = res.headers["content-length"]|0;
        res.on("data", d => {
          buffer.push(d);
          current += d.length;
          if (onProgress) onProgress(length ? current / length : (current % 7) / 7);
        }).on("end", () => {
          onData(rawBuffer ? Buffer.concat(buffer) : Buffer.concat(buffer).toString());
        });
      }
      else if (onError) _error(res, "");

    }).on("error", err => _error(_res, err));

    req.end();

    function _error(res, err) {
      if (onError) onError({statusCode: res && res.statusCode ? res.statusCode : -1, error: err});
      else log("Error", res, err);
    }
  },

  /**
   * Open default program on the system based on the argument (cmd).
   * @param {string} cmd - an URL or path
   * @returns {*}
   */
  run: function(cmd) {
    return require("opn")(cmd);
  },

  getConfigRootPath: function() {
    let app = process.platform === "win32" ? path.resolve(process.env.APPDATA, "../../") : process.env.HOME;
    return (process.platform === "darwin")
           ? require("path").resolve(app, "/Library/Preferences") : app
  },

  getConfigPath: function() {
    return path.resolve(this.getConfigRootPath(), ".mdncomp")
  },

  /**
   * Get config path and/or sub folders within the config path.
   * Will create the directories that are missing.
   *
   * @example
   *
   *    getConfigData()         --> [userdata]/.mdncomp
   *    getConfigData("cache")  --> [userdata]/.mdncomp/cache
   *    etc.
   *
   * @returns {string}
   */
  getConfigDataPath: function() {
    // root config path, using . for *nix systems
    let root = this.getConfigPath();
    _check(root);

    // check/create sub-folders if defined
    for(let i = 0; i < arguments.length; i++) {
      _check(root = path.resolve(root, arguments[i]));
    }

    function _check(root) {
      if (!fs.existsSync(root)) {
        try {
          fs.mkdirSync(root);
        }
        catch(err) {
          log(`${ANSI.red}Could not create config folder:\n${root}\n${err.message}${ANSI.reset}`);
        }
      }
    }

    return root
  },

  getCachedFilename: function(str) {
    return path.resolve(this.getConfigDataPath("cache"), this.calcMD5(str))
  },

  getCachedData: function(str) {
    let data = null;
    try {
      data = fs.readFileSync(this.getCachedFilename(str)).toString();
    }
    catch(err) {}

    return data
  },

  setCachedData: function(str, data) {
    let filename = this.getCachedFilename(str);
    try {
      fs.writeFileSync(filename, data);
    }
    catch(err) {
      log(ANSI.red + "Could not save file: " + filename + ANSI.reset + lf + err)
    }
  },

  calcMD5: function(data) {
    return require("crypto").createHash("md5").update(data).digest("hex") + ""
  }

};

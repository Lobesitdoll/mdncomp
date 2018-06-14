/*
  I/O module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const
  ANSI = require("./ansi"),
  https = require("https"),
  fs = require("fs"),
  path = require("path");

module.exports = {

  /**
   * Request data from an URL
   * @param {string} url - the (HTTPS) url to load
   * @param {function} onResp - must return true, response header available, no data at this stage
   * @param {function} [onProgress] - onData callback
   * @param {function} onData - gets the data itself
   * @param {function} [onError] - if any errors
   */
  request: function(url, onResp, onProgress, onData, onError) {
    onResp = onResp || function() {return true};

    let _res;

    const req = https.get(url, res => {
      let data = "";
      _res = res;

      // handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return this.request(res.headers.location, onResp, onProgress, onData, onError);
      }
      else if (res.statusCode === 200 && onResp({headers: res.headers})) {
        let length = res.headers["content-length"]|0;
        res.on("data", d => {
          data += d;
          if (onProgress) onProgress(length ? data.length / length : (data.length % 7) / 7);
        }).on("end", () => {
          onData(data);
        });
      }
      else if (onError) _error(res, "");

    }).on("error", err => _error(_res, err));

    req.end();

    function _error(res, err) {
      if (onError) onError({statusCode: res.statusCode, error: err});
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

//  exist: function(path) {
//    return fs.existsSync(path)
//  },

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

  /**
   *
   * @param {Array} list - holding items: {path, data}
   * @param callback - results array with {path, err} err is non-null if any error occurred
   */
  writeAll: function(list, callback) {
    let results = [], count = list.length, errors = false;

    for(let item of list) {
      fs.writeFile(item.path, item.data, "utf8", err => {
        _handler({path: item.path, err: err})
      })
    }

    function _handler(o) {
      results.push(o);
      if (o.err) errors = true;
      if (!--count) callback(results, errors)
    }
  },

  calcMD5: function(data) {
    return require("crypto").createHash("md5").update(data).digest("hex") + ""
  }

};

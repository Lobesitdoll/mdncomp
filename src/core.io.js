
let https, fs, path;

const io = {

  /**
   * Request data from an URL
   * @param {string} url - the (HTTPS) url to load
   * @param {function} onResp - must return true, response header available, no data at this stage
   * @param {function} [onProgress] - ondata callback
   * @param {function} onData - gets the data itself
   * @param {function} [onError] - if any errors
   */
  request: function(url, onResp, onProgress, onData, onError) {
    if (!https) https = require("https");
    onResp = onResp || function() {return true};

    const req = https.get(url, res => {
      let data = "";

      // handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return io.request(res.headers.location, onResp, onProgress, onData, onError);
      }
      else if (res.statusCode === 200 && onResp({headers: res.headers})) {
        let length = res.headers["content-length"]|0;
        res.on("data", (d) => {
          data += d;
          if (onProgress) onProgress(length ? data.length / length : (data.length % 7) / 7);
        }).on("end", () => {
          onData(data);
        });
      }
      else if (onError) _error(res, "");

    }).on("error", err => _error(res, err));
    req.end();

    function _error(res, err) {
      if (onError) onError({statusCode: res.statusCode, error: err});
      else log("Error", res, err);
    }
  },

  getUrlStatus: function(url, callback, followRedirects) {
    if (!https) https = require("https");
    const
      { URL } = require('url'),
      url2 = new URL(url),
      options = {
        method: "HEAD",
        host: url2.hostname,
        port: url2.port,
        path: url2.pathname
      };

    let req = https.request(options, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        if (followRedirects) {
          io.getUrlStatus(res.headers.location, callback, followRedirects);
        }
        else {
          callback({
            statusCode: res.statusCode,
            location: res.headers.location
          })
        }
      }
      else callback({statusCode: res.statusCode});
    });

    req.end();
  },

  /**
   * Open default program on the system based on the argument (cmd).
   * @param {string} cmd - an URL or path
   * @returns {*}
   */
  run: function(cmd) {
    return require("opn")(cmd);
  },

  exist: function(path) {
    if (!fs) fs = require("fs");
    return fs.existsSync(path)
  },

//  getDataPath: function() {
//    return path.normalize(path.dirname(process.mainModule.filename) + "/../data");
//  },

  getConfigRootPath: function() {
    let app = process.env.HOME || path.resolve(process.env.APPDATA, "../../");
    return (process.platform === "darwin")
           ? require("path").resolve(app, "/Library/Preferences") : app
  },

  getConfigPath: function() {
    if (!path) path = require("path");
    return path.resolve(io.getConfigRootPath(), ".mdncomp")
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
    if (!path) path = require("path");
    if (!fs) fs = require("fs");

    // root config path, using . for *nix systems
    let root = io.getConfigPath();
    _check(root);

    // check/create sub-folders if defined
    for(let i = 0; i < arguments.length; i++) {
      _check(root = path.resolve(root, arguments[i]));
    }

    function _check(root) {
      if (!fs.existsSync(root)) {
        try {
          fs.mkdirSync(root);
        } catch(err) {
          log(`${ANSI.red}Could not create config folder:\n${root}\n${err.message}${ANSI.reset}`);
        }
      }
    }

    return root
  },

  getCachedFilename: function(str) {
    return path.resolve(io.getConfigDataPath("cache"), calcMD5(str))
  },

  getCachedData: function(str) {
    if (!fs) fs = require("fs");
    let data = null;
    try {
      data = fs.readFileSync(io.getCachedFilename(str)).toString();
    } catch(err) {}

    return data
  },

  setCachedData: function(str, data) {
    if (!fs) fs = require("fs");
    let filename = io.getCachedFilename(str);
    try {
      fs.writeFileSync(filename, data);
    } catch(err) {
      log(ANSI.red + "Could not save file: " + filename + ANSI.reset + lf + err)
    }
  },

  /**
   *
   * @param {Array} list - holding items: {path, data}
   * @param callback - results array with {path, err} err is non-null if any error occurred
   */
  writeAll: function(list, callback) {
    if (!fs) fs = require("fs");
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
  }

};



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

    https.get(url, res => {
      let data = "";

      // handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return this.request(res.headers.location, onResp, onProgress, onData, onError);
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

  exist: function(path) {
    if (!fs) fs = require("fs");
    return fs.existsSync(path)
  },

//  mkdir: function(path) {
//    let
//      parts = path.split(path.sep),
//      cPath = "";
//    parts.forEach(part => {
//      cPath = path.resolve(cPath, part);
//      if (!fs.existsSync(cPath)) {
//        fs.mkdirSync(cPath);
//      }
//    })
//  },

  getCachedPath: function(str) {
    if (!path) path = require("path");
    if (!fs) fs = require("fs");

    let root = path.resolve(cfgPath, "mdncomp");
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root);
    }

    root = path.resolve(root, "cache");
    if (!fs) fs = require("fs");
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root);
    }

    return path.resolve(root, calcMD5(str))
  },

  getCached: function(str) {
    //if (!fs) fs = require("fs");
    let data = null;
    try {
      data = fs.readFileSync(io.getCachedPath(str)).toString();
    } catch(err) {}

    return data
  },

  setCached: function(str, data) {
    //if (!fs) fs = require("fs");
    try {
      fs.writeFileSync(io.getCachedPath(str), data);
    } catch(err) {
      log(ANSI.red + "Could not save file: " + str + ANSI.reset + lf + err)
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



let https, fs;

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
    https.get(url, (res) => {
      let data = "";
      if (res.statusCode === 200 && onResp({headers: res.headers})) {
        res.on("data", (d) => {
          data += d;
          if (onProgress) onProgress(d)
        }).on("end", () => {
          onData(data);
        });
      }
      else if (onError) _error(res, "");
    }).on("error", err => {_error(res, err)});

    function _error(res, err) {
      if (onError) onError({statusCode: res.statusCode, error: err});
      else log("Error", res, err);
    }
  },

  /**
   *
   * @param {Array} list - holding items: {path, data}
   * @param callback - results array with {path, err} err is non-null if any error occurred
   */
  writeAll: function(list, callback) {
    let results = [], count = list.length, errors = false;
    list.forEach(item => {
      io.write(item.path, item.data, _handler)
    });

    function _handler(o) {
      results.push(o);
      if (o.err) errors = true;
      if (!--count) callback(results, errors)
    }
  },

  /**
   *
   * @param {string} path - holding items: {path, data}
   * @param data - the data to write
   * @param callback - result object with {path, err} err is non-null if any error occurred
   */
  write: function(path, data, callback) {
    if (!fs) fs = require("fs");
    fs.writeFile(path, data, "utf8", err => {
      callback({path: path, err: err ? err : null})
    })
  }

};



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
    onResp = onResp || function() {return true};

    https.get(url, res => {
      let data = "";

      if (res.statusCode === 200 && onResp({headers: res.headers})) {
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
   *
   * @param {Array} list - holding items: {path, data}
   * @param callback - results array with {path, err} err is non-null if any error occurred
   */
  writeAll: function(list, callback) {
    let results = [], count = list.length, errors = false;
    if (!fs) fs = require("fs");

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


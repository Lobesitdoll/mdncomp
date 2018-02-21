
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
  }

};


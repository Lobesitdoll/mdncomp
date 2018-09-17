/*
  I/O module
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const fs = require("fs");
const path = require("path");
const https = require("https");

module.exports = {

  /**
   * Request data from an URL
   * @param {string} url - the (HTTPS) url to load
   * @param {function} onResp - must return true, response header available, no data at this stage
   * @param {function} [onProgress] - onData callback
   * @param {function} onData - gets the data itself
   * @param {function} [onError] - if any errors
   * @param {boolean} [rawBuffer=false] - if true send back raw buffer to callback, otherwise string
   * @param {number} [rLimit=2] - recursive limit for redirects
   */
  request: function(url, onResp, onProgress, onData, onError, rawBuffer, rLimit = 2) {
    onResp = onResp || (() => true);

    let response;

    https
      .get(url, _response => {
        const buffer = [];
        let current = 0;
        response = _response;

        if ( !_response || !_response.statusCode || !rLimit ) {
          onError("Could not connect");
        }
        // handle redirects
        else if ( _response.statusCode === 301 || _response.statusCode === 302 ) {
          return this.request(_response.headers.location, onResp, onProgress, onData, onError, --rLimit);
        }
        else if ( _response.statusCode === 200 && onResp({ headers: _response.headers }) ) {
          const length = _response.headers[ "content-length" ] | 0;
          _response
            .on("data", data => {
              buffer.push(data);
              current += data.length;
              if ( onProgress ) onProgress(length ? current / length : (current % 7) / 7);
            })
            .on("end", () => {
              onData(rawBuffer ? Buffer.concat(buffer) : Buffer.concat(buffer).toString());
            });
        }
        else if ( onError ) _error(_response, "");
      })
      .on("error", err => _error(response, err))
      .end();

    function _error(res, error) {
      if ( onError ) onError({ statusCode: res && res.statusCode ? res.statusCode : -1, error: error });
      else err("Error", res, error);
    }
  },

  getConfigRootPath: function() {
    if ( process.platform === "win32" ) {
      return path.resolve(process.env.APPDATA, "../..");
    }
    else if ( process.platform === "darwin" ) {
      return path.resolve(process.env.HOME, "Library/Preferences");
    }
    else {
      return process.env.HOME;
    }
  },

  getConfigPath: function() {
    return path.resolve(this.getConfigRootPath(), ".mdncomp");
  },

  getConfigFilePath: function() {
    return path.resolve(this.getConfigDataPath(), ".config.json");
  },

  /**
   * Get config path and/or sub folders within the config path.
   * Will try to create directories that are missing.
   *
   * This is the main method to use for configs/data etc.
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
    let root = this.getConfigPath();
    _check(root);

    // check/create sub-folders if defined
    for(let i = 0; i < arguments.length; i++) {
      _check(root = path.resolve(root, arguments[ i ]));
    }

    function _check(root) {
      if ( !fs.existsSync(root) ) {
        try {
          fs.mkdirSync(root);
        }
        catch(err) {
          log(`${ANSI.red}Could not create config folder:\n${root}\n${err.message}${ANSI.reset}`);
          if ( process.platform === "darwin" || process.platform === "linux" ) {
            err(`Try using "sudo mdncomp --set <kv>" to write config.`);
          }
          process.exitCode = 1;
        }
      }
    }

    return root;
  }
};

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
   */
  request: function(url, onResp, onProgress, onData, onError, rawBuffer) {
    onResp = onResp || (() => true);

    let _res;

    const req = https
      .get(url, res => {
        const buffer = [];
        let current = 0;
        _res = res;

        // handle redirects

        if ( !res || !res.statusCode ) {
          onError("Could not connect");
        }
        else if ( res.statusCode === 301 || res.statusCode === 302 ) {
          return this.request(res.headers.location, onResp, onProgress, onData, onError);
        }
        else if ( res.statusCode === 200 && onResp({ headers: res.headers }) ) {
          let length = res.headers[ "content-length" ] | 0;
          res.on("data", d => {
            buffer.push(d);
            current += d.length;
            if ( onProgress ) onProgress(length ? current / length : (current % 7) / 7);
          }).on("end", () => {
            onData(rawBuffer ? Buffer.concat(buffer) : Buffer.concat(buffer).toString());
          });
        }
        else if ( onError ) _error(res, "");

      })
      .on("error", err => _error(_res, err));

    req.end();

    function _error(res, error) {
      if ( onError ) onError({ statusCode: res && res.statusCode ? res.statusCode : -1, error: error });
      else err("Error", res, error);
    }
  },

  getConfigRootPath: function() {
    let app = process.platform === "win32"
              ? path.resolve(process.env.APPDATA, "../../")
              : process.env.HOME;

    return process.platform === "darwin"
           ? path.resolve(app, "/Library/Preferences")
           : app;
  },

  getConfigPath: function() {
    return path.resolve(this.getConfigRootPath(), ".mdncomp");
  },

  getConfigFilePath: function(check = true) {
    return path.resolve(this.getConfigDataPath(check), ".config.json");
  },

  /**
   * Get config path and/or sub folders within the config path.
   * Will create the directories that are missing.
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
  getConfigDataPath: function(check = true) {
    // root config path, using . for *nix systems
    let root = this.getConfigPath();

    if (check) {
      _check(root);

      // check/create sub-folders if defined
      for(let i = 0; i < arguments.length; i++) {
        _check(root = path.resolve(root, arguments[ i ]));
      }
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

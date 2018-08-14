/*
  Update module v2 for mdncomp
  (c) 2018 epistemex.com
 */

const fs = require("fs");
const Path = require("path");
const zlib = require("zlib");
const rfc6902 = require("rfc6902");
const io = loadModule("core.io");

const filePrefix = Path.join(__dirname, "../data") + Path.sep;                                      // Local data/ path
const urlPrefix = "https://raw.githubusercontent.com/epistemex/mdncomp-data/master/";               // Main server
const urlPrefixR = "https://gitlab.com/epistemex/mdncomp-data/raw/master/";                         // Redundancy server

const clr = ANSI.clrToCursor + ANSI.cursorUp;
const PWIDTH = 40;

let wasRedundant = false;

// Clear line in terminal
function clrLine() {
  log(clr + ("").padStart(options.maxChars, " "));
}

// Compare MD5 to see if there is any change in data content
function compareMD5(callback, redundant) {
  const _urlPrefix = redundant || wasRedundant ? urlPrefixR : urlPrefix;
  let local;
  try {
    local = fs.readFileSync(filePrefix + "data.md5", "utf-8");
  }
  catch(err) {err(err)}

  // remote MD5
  io.request(_urlPrefix + "data.md5", null, null, (remote) => {
    callback({ local, remote });
  }, (err) => {
    wasRedundant = true;
    if ( redundant ) {
      err("?rAn error occurred:?R", err.statusCode, err.error);
    }
    else {
      log("?yUsing redundancy...?R\n");
      setImmediate(compareMD5, callback, true);
    }
  });
}

// Download patch file between current and update version
function getPatch(md5, callback) {
  let rFile = urlPrefix + "patches/" + md5.remote + "_" + md5.local;
  io
    .request(rFile, null, null,
      (patch) => {
        callback(null, zlib.gunzipSync(patch));
      },
      (err) => callback(err),
      true);
}

// Download compressed data json
function getRemoteData(callback, redundant) {
  const _urlPrefix = redundant || wasRedundant ? urlPrefixR : urlPrefix;
  let lastUpdate = 0;
  let update;
  let prog;

  io.request(_urlPrefix + "data.gz", () => !clrLine(),
    (pct) => {
      prog = Math.ceil(PWIDTH * pct);
      update = Date.now();
      if ( update - lastUpdate > 250 ) {
        lastUpdate = update;
        _progressBar();
      }
    },
    (data) => {
      _progressBar();
      callback(null, zlib.gunzipSync(data));
    },
    (err) => {
      wasRedundant = true;
      if ( redundant ) callback(err);
      else {
        log("?Trying redundancy...?R\n");
        setImmediate(getRemoteData, callback, true);
      }
    },
    true
  );

  function _progressBar() {
    log(clr + "?wDownloading data [?b" + char.progressBar.repeat(prog) + " ".repeat(PWIDTH - prog) + "?w]?R");
  }
}

// Get current data json from disk
function getCurrentData() {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(filePrefix + "data.json", "utf-8"));
  }
  catch(err) {}

  return data;
}

/**
 * Update data
 * @param {boolean} force - ignore patch file
 * @param {boolean} checkOnly - check if an update is available, but don't update
 */
function update(force, checkOnly) {
  const noData = "?gNo new data available.?R";

  compareMD5(md5 => {
    if ( force ) {
      _remote();
    }
    else if ( md5.local === md5.remote ) {
      log(noData);
    }
    else if ( checkOnly ) {
      log(noData);
    }
    else {
      getPatch(md5, (err, patchStr) => {
        if ( err ) {
          log("?yNo patch available - Loading full dataset...?R");
          _remote();
        }
        else {
          let data = getCurrentData();
          let hasErrors = false;

          log("Applying patch...\n");

          let patch = JSON.parse(patchStr);
          rfc6902
            .applyPatch(data, patch)
            .forEach(err => {
              if ( err ) {
                err(`?rError with "${err.name}": ${err.message}?R`);
                hasErrors = true;
              }
            });

          if ( hasErrors ) {
            err(`?rError during patching ${md5.local} -> ${md5.remote}.?y${lf}Downloading full dataset...?R`);
            _remote();
          }
          else {
            _diff(patch);
            _save(JSON.stringify(data), md5.remote);
          }
        }
      });
    }

    function _diff(patch) {
      let adds = 0, removes = 0, updates = 0;
      patch.forEach(entry => {
        if ( entry.op === "add" ) adds++;
        else if ( entry.op === "remove" ) removes++;
        else if ( entry.op === "replace" ) updates++;
      });
      log(`?RDiff summary: ${adds} adds, ${updates} updates, ${removes} removes\n`)
    }

    function _remote() {
      getRemoteData((_err, data) => {
        if ( _err ) err(_err);
        else {
          _save(data, md5.remote);
        }
      });
    }

    function _save(data, remoteMD5) {
      try {
        fs.writeFileSync(filePrefix + "data.json", data, "utf-8");
        fs.writeFileSync(filePrefix + "data.md5", remoteMD5, "utf-8");
      }
      catch(_err) {err(_err)}

      clrLine();
      log("?gData updated!?R")
    }
  });
}

module.exports = update;
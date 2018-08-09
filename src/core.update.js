/*
  Update module v2 for mdncomp
  (c) 2018 epistemex.com
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const io = require("./core.io");
const rfc6902 = require("rfc6902");

const urlPrefix = "https://raw.githubusercontent.com/epistemex/mdncomp-data/master/";               // Main server
const urlPrefixR = "https://gitlab.com/epistemex/mdncomp-data/raw/master/";                         // Redundancy server
const filePrefix = path.normalize(path.dirname(process[ "mainModule" ].filename) + "/../data/");    // Local data/ path

const clr = ANSI.clrToCursor + ANSI.cursorUp;
const PWIDTH = 40;

let wasRedundant = false;

// Clear line in terminal
function clrLine() {
  console.log(clr + ("").padStart(options.maxChars, " "));
}

// Compare MD5 to see if there is any change in data content
function compareMD5(callback, redundant) {
  const _urlPrefix = redundant || wasRedundant ? urlPrefixR : urlPrefix;
  let local;
  try {
    local = fs.readFileSync(filePrefix + "data.md5", "utf-8");
  }
  catch(err) {console.error(err)}

  // remote MD5
  io.request(_urlPrefix + "data.md5", null, null, (remote) => {
    callback({ local, remote });
  }, (err) => {
    wasRedundant = true;
    if ( redundant ) {
      console.error("An error occurred:", err.statusCode, err.error);
    }
    else {
      console.warn("Using redundancy...\n");
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

  io.request(_urlPrefix + "data.gz",
    () => !clrLine(),
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
        console.warn("Using redundancy...\n");
        setImmediate(getRemoteData, callback, true);
      }
    },
    true
  );

  function _progressBar() {
    console.log(clr + ANSI.white + "Downloading data " + ANSI.white + "[" + ANSI.blue + "#".repeat(prog) + " ".repeat(PWIDTH - prog) + ANSI.white + "]" + ANSI.reset);
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
 * @param {boolean} [force=false] - ignore diff file (todo)
 * @param {boolean} checkOnly - check if an update is available, but don't update
 */
function update(force, checkOnly) {
  const noData = "No new data available.";

  compareMD5(md5 => {
    if ( force ) {
      _remote();
    }
    else if ( md5.local === md5.remote ) {
      console.log(noData);
    }
    else if ( checkOnly ) {
      console.log(noData);
    }
    else {
      getPatch(md5, (err, patchStr) => {
        if ( err ) {
          console.log("No patch available - Loading full dataset...");
          _remote();
        }
        else {
          let data = getCurrentData();
          let hasErrors = false;

          console.log("Applying patch...\n");

          let patch = JSON.parse(patchStr);
          rfc6902.applyPatch(data, patch).forEach(err => {
            if ( err ) {
              console.error(`Error with "${err.name}": ${err.message}`);
              hasErrors = true;
            }
          });

          if ( hasErrors ) {
            console.error(`Error during patching ${md5.local} -> ${md5.remote}.\nDownloading full dataset...`);
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
      console.log(`Diff: ${adds} adds, ${updates} updates, ${removes} removes\n`)
    }

    function _remote() {
      getRemoteData((err, data) => {
        if ( err ) console.error(err);
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
      catch(err) {console.error(err)}

      clrLine();
      console.log("Data updated!")
    }
  });
}

module.exports = update;
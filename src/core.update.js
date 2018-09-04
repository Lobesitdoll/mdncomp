/*
  Update module v2 for mdncomp
  (c) 2018 epistemex.com
 */

const fs = require("fs");
const Path = require("path");
const zlib = require("zlib");
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
    local = fs.readFileSync(filePrefix + filenameMD5, "utf-8");
  }
  catch(_err) {
    err(_err);
  }

  // remote MD5
  io.request(_urlPrefix + "data.md5", null, null, (remote) => {
    callback({ local, remote });
  }, (_err) => {
    wasRedundant = true;
    if ( redundant ) {
      err(`?r${text.error}:?R`, _err.statusCode, _err.error);
    }
    else {
      log(`?y${text.tryingRedundancy}...?R\n`);
      setImmediate(compareMD5, callback, true);
    }
  });
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
    (_err) => {
      wasRedundant = true;
      if ( redundant ) callback(_err);
      else {
        err(`?${text.tryingRedundancy}...?R\n`);
        setImmediate(getRemoteData, callback, true);
      }
    },
    true
  );

  function _progressBar() {
    log(`${clr}?w${text.downloadingData} [?b${char.progressBar.repeat(prog) + " ".repeat(PWIDTH - prog)}?w]?R`);
  }
}

/**
 * Update data
 * @param {boolean} force - ignore patch file
 */
function update(force) {
  const noData = `?g${text.noNewData}.?R\n`;

  log();

  compareMD5(md5 => {
    if ( force ) {
      _remote();
    }
    else if ( md5.local === md5.remote ) {
      log(noData);
    }
    else {
      _remote();
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
        fs.writeFileSync(filePrefix + filenameData, data, "utf-8");
        fs.writeFileSync(filePrefix + filenameMD5, remoteMD5, "utf-8");
      }
      catch(_err) {
        err(_err);
      }

      clrLine();
      log(`?g${text.dataUpdated}!?R`);
    }
  });
}

module.exports = update;
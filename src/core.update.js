/*
  Update module v2 for mdncomp
  (c) 2018 epistemex.com
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const io = require("./io");
const ANSI = require("./ansi");
const rfc6902 = require("rfc6902");

const log = console.log.bind(console);
const urlPrefix = "https://raw.githubusercontent.com/epistemex/mdncomp-data/master/";
const filePrefix = path.normalize(path.dirname(process["mainModule"].filename) + "/../data/");
const clr = ANSI.clrToCursor + ANSI.cursorUp;
const PWIDTH = 40;

function clrLine() {
  log(clr + ("").padStart(72, " "));
}
function compareMD5(callback) {
  let local;
  try {
    local = fs.readFileSync(filePrefix + "data.md5", "utf-8");
  }
  catch(err) {}

  // remote MD5
  io.request(urlPrefix + "data.md5", null, null, (remote) => {
    callback({local, remote})
  }, (err) => {
    log("An error occurred:", err.statusCode, err.error)
  })
}
function getPatch(md5, callback) {
  let rFile = urlPrefix + "patches/" + md5.remote + "_" + md5.local;
  io
    .request(rFile, null, null,
      (patch) => {callback(null, zlib.gunzipSync(patch))},
      (err) => {callback(err)},
      true)
}
function getRemoteData(callback) {
  let lastUpdate = 0, update, prog;
  io.request(urlPrefix + "data.gz",
    () => !clrLine(),
    (pct) => {
      prog = Math.ceil(PWIDTH * pct);
      update = Date.now();
      if (update - lastUpdate > 250) {
        lastUpdate = update;
        _progressBar();
      }
    },
    (data) => {
      _progressBar();
      callback(null, zlib.gunzipSync(data))
    },
    (err) => {callback(err)},
    true); // as Buffer

  function _progressBar() {
    log(clr + ANSI.white + "Downloading data " + ANSI.white + "[" + ANSI.blue + "#".repeat(prog) + " ".repeat(PWIDTH - prog) + ANSI.white + "]" + ANSI.reset);
  }
}
function getCurrentData() {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(filePrefix + "data.json", "utf-8"));
  }
  catch(err) {}
  return data
}

module.exports = function(force, checkOnly) {

  compareMD5(md5 => {
    if (force) {
      _remote()
    }
    else if (md5.local === md5.remote) {
      log("No new data available.")
    }
    else if (checkOnly) {
      log("New data is available.")
    }
    else {
      getPatch(md5, (err, patchStr) => {
        if (err) {
          log("No patch available - Loading full dataset...");
          _remote()
        }
        else {
          let data = getCurrentData();
          let hasErrors = false;

          log("Applying patch...\n");
          let patch = JSON.parse(patchStr);
          rfc6902.applyPatch(data, patch).forEach(err => {
            if (err) {
              log(`Error with "${err.name}": ${err.message}`);
              hasErrors = true;
            }
          });

          if (hasErrors) {
            log(`Error during patching ${md5.local} -> ${md5.remote}.\nDownloading full dataset...`);
            _remote()
          }
          else {
            _diff(patch);
            _save(JSON.stringify(data), md5.remote)
          }
        }
      })
    }

    function _diff(patch) {
      let adds = 0, removes = 0, updates = 0; //, moves = 0, copies = 0, entries = [];
      patch.forEach(entry => {
        if (entry.op === "add") adds++;
        else if (entry.op === "remove") removes++;  //entries.push(entry);
        else if (entry.op === "replace") updates++;
      });
      log(`Diff: ${adds} adds, ${updates} updates, ${removes} removes`); //, ${copies} copies, ${moves} moves.`)
//      entries.forEach(entry => {
//        log(`Removed: ${entry.path.replace("__compat/", "")}`)
//      });
//      log("\n")
    }
    function _remote() {
      getRemoteData((err, data) => {
        if (err)
          log(err);
        else
          _save(data, md5.remote)
      })
    }
    function _save(data, remoteMD5) {
      try {
        fs.writeFileSync(filePrefix + "data.json", data, "utf-8");
        fs.writeFileSync(filePrefix + "data.md5", remoteMD5, "utf-8")
      }
      catch(err) {log(err)}

      clrLine();
      log("Data updated!");
    }
  })
};

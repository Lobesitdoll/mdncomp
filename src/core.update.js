const
  io = require("./io"),
  ANSI = require("./ansi"),
  fs = require("fs"),
  path = require("path"),
  log = console.log.bind(console),
  urlPrefix = "https://raw.githubusercontent.com/epistemex/data-for-mdncomp/master/";

module.exports = function(force, checkOnly, showDiff) {
  const
    clr = ANSI.clrToCursor + ANSI.cursorUp,
    filePathRoot = path.normalize(path.dirname(process.mainModule.filename) + "/../data/data."),
    filePathDat = filePathRoot + "json",
    filePathMD5 = filePathRoot + "md5";

  log("Connecting...");

  if (force) serverData();
  else {
    serverMD5(md5 => {
      let md5f = getCachedMD5(filePathMD5, filePathDat);
      clrLine();
      log(clr + ANSI.white + (md5 === md5f ? "No change in data - cancelling (or use the --fupdate option)." : "Update is available (" + md5 + ")."));
      if (!(checkOnly || md5 === md5f)) serverData();
    });
  }

  function serverData() {
    io.request(urlPrefix + "data2.json",
      () => !clrLine(),
      pct => {
        let width = 50, prog = Math.round(width * pct), rem = width - prog;
        log(clr + ANSI.white + "Downloading data " + ANSI.white + "[" + ANSI.green + "#".repeat(prog) + " ".repeat(rem) + ANSI.white + "]" + ANSI.reset + ANSI.black);
      },
      data => {
        // get diff
        let diff = showDiff ? getDiff(data) : "";

        // write new data to disk
        io.writeAll([{path: filePathDat, data: data}, {path: filePathMD5, data: calcMD5(data)}], (results, hasErrors) => {
          if (hasErrors)
            results.forEach(error => {
              if (error.err) logErr("An error occurred writing data to file. Please retry: " + lf + error.path + ": " + error.err + ANSI.reset);
            });
          else
            log(clr + ANSI.white + ("Updated with " + data.length + " bytes. All systems are GO!").padEnd(72, " ") + ANSI.reset);
            if (diff.length) log(diff);
        })
      },
      err => logErr(lf + "An error occurred -" + lf + "Status code: " + err.statusCode + (err.error ? lf + "Message: " + err.error : "") + ANSI.reset)
    )
  }

  function getDiff(newData) {
    let res;
    try {
      let oldPaths = buildTable(require("../data/data.json"));
      let newPaths = buildTable(JSON.parse(newData));
      let diff = [];

      // make diff
      oldPaths.forEach(path => {
        if (!newPaths.includes(path)) diff.push(path)
      });

      res = `--diff-- New features (${diff.length}):\n` + diff.join("\n")
    }
    catch(err) {
      res = ANSI.red + "Could not perform diff:\n" + err.message + ANSI.reset
    }

    return res
  }

  function clrLine() {
    log(clr + ("").padStart(72, " "));
  }

  function logErr(txt) {
    log(clr + ANSI.red + txt + ANSI.white)
  }
};

function buildTable(mdn) {
  const result = [];

  listTopLevels(mdn)
    .forEach(key => {if (key !== "browsers") _iterateNode(mdn, key, key)});

  function _iterateNode(node, inKey, branch) {
    const subNode = node[inKey];
    if (typeof subNode === "object") {
      Object.keys(subNode).forEach(key => {
        if (key !== "__compat") {
          result.push(branch + "." + key);
          _iterateNode(subNode, key, branch + "." + key);
        }
      });
    }
  }

  return result
}

function listTopLevels(mdn) {
  let keys = Object.keys(mdn), i = keys.indexOf("browsers");
  if (i >= 0) keys.splice(i, 1);
  return keys
}

function serverMD5(callback) {
  io.request(urlPrefix + "data2.md5", null, null, callback, (err) => {
    log("An error occurred:", err.statusCode, err.error)
  })
}

/**
 * Will try to load the cached MD5 hash. If not found the data is loaded
 * and a MD5 is calculated.
 * @param path - md5 cached file
 * @param path2 - data file path if md5 isn't not found
 * @returns {string} empty is MD5 couldn't be calc.
 */
function getCachedMD5(path, path2) {
  try {
    return fs.readFileSync(path) + "";
  } catch(err) {return calcFileMD5(path2)}
}

function calcFileMD5(path) {  // todo this can go in the future (now@v1.3.3a)
  try {
    return calcMD5(fs.readFileSync(path)) + "";
  } catch(err) {return ""}
}

function calcMD5(data) {
  return require("crypto").createHash("md5").update(data).digest("hex") + ""
}


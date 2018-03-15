
function update(force, checkOnly) {
  const
    path = require("path"),
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
    io.request(urlPrefix + "data.json",
      () => !clrLine(),
      pct => {
        let width = 50, prog = Math.round(width * pct), rem = width - prog;
        log(clr + ANSI.white + "Downloading data " + ANSI.white + "[" + ANSI.green + "#".repeat(prog) + " ".repeat(rem) + ANSI.white + "]" + ANSI.reset + ANSI.black);
      },
      data => {
        io.writeAll([{path: filePathDat, data: data}, {path: filePathMD5, data: calcMD5(data)}], (results, hasErrors) => {
          if (hasErrors)
            results.forEach(error => {
              if (error.err) logErr("An error occurred writing data to file. Please retry: " + lf + error.path + ": " + error.err + ANSI.reset);
            });
          else
            log(clr + ANSI.white + ("Updated with " + data.length + " bytes. All systems are GO!").padEnd(72, " ") + ANSI.reset);
        })
      },
      err => logErr(lf + "An error occurred -" + lf + "Status code: " + err.statusCode + (err.error ? lf + "Message: " + err.error : "") + ANSI.reset)
    )
  }

  function clrLine() {
    log(clr + ("").padStart(72, " "));
  }

  function logErr(txt) {
    log(clr + ANSI.red + txt + ANSI.white)
  }
}

function serverMD5(callback) {
  io.request(urlPrefix + "data.md5", null, null, callback, (err) => {
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
  if (!fs) fs = require("fs");
  try {
    return fs.readFileSync(path) + "";
  } catch(err) {return calcFileMD5(path2)}
}

function calcFileMD5(path) {  // todo this can go in the future (now@v1.3.3a)
  if (!fs) fs = require("fs");
  try {
    return calcMD5(fs.readFileSync(path)) + "";
  } catch(err) {return ""}
}

function calcMD5(data) {
  return require("crypto").createHash("md5").update(data).digest("hex") + ""
}


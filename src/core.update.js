
function update(force) {
  const
    path = require("path"),
    clr = ANSI.clrToCursor + ANSI.cursorUp,
    filePath = path.normalize(path.dirname(process.mainModule.filename) + "/../data/data.json");

  let count = 0;

  log(ANSI.fgGreen + ANSI.bright+ "Connecting...");

  if (force) serverData();
  else {
    serverMD5(md5 => {
      if (md5 === fileMD5(filePath))
        log(clr + ANSI.reset + ANSI.fgWhite + "No change in data - cancelling (or use the --fupdate option).");
      else
        serverData();
    });
  }

  function serverData() {
    io.request("https://raw.githubusercontent.com/epistemex/data-for-mdncomp/master/data.json",
      () => {
        clrLine();
        return true
      },
      () => {
        log(clr + ANSI.fgWhite + "Downloading data " + ANSI.fgGreen + ANSI.bright + ("").padEnd(((count += 0.25)|0) % 50, ".") + ANSI.fgBlack);
      },
      data => {
        if (!fs) fs = require("fs");
        fs.writeFile(filePath, data, "utf8", err => {
          if (err) log(clr + ANSI.fgRed + "Could not write new data to file...", err, ANSI.fgWhite);
          else {
            log(clr + ANSI.fgWhite + ("Updated with " + data.length + " bytes. All systems are GO!").padEnd(72, " "))
          }
        })
      },
      err => {
        log(ANSI.fgRed + "An error occurred:" + lf + "Status code: " + err.statusCode + lf + "Message: " + err.error + ANSI.fgWhite + ANSI.reset);
      })
  }

  function clrLine() {
    log(clr + ("").padStart(72, " "));
  }
}

function serverMD5(callback) {
  io.request("https://raw.githubusercontent.com/epistemex/data-for-mdncomp/master/data.md5",
    () => {return true}, null, callback, (err) => {
      log("An error occurred:", err.statusCode, err.error)
    })
}

function fileMD5(path) {
  if (!fs) fs = require("fs");
  try {
    return getMD5(fs.readFileSync(path));
  } catch(err) {return ""}
}

function getMD5(data) {
  return require("crypto").createHash("md5").update(data).digest("hex")
}


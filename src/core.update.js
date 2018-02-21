

function update(force) {
  const
    https = require("https"),
    path = require("path"),
    clr = ANSI.clrToCursor + ANSI.cursorUp;

  let
    data = "",
    count = 0,
    filePath = path.normalize(path.dirname(process.mainModule.filename) + "/../data/data.json");
    //filePath = path.normalize(path.dirname(require.resolve("../package.json")) + "/data/data.json");

  log(ANSI.fgGreen + ANSI.bright+ "Connecting...");

  https.get("https://raw.githubusercontent.com/epistemex/data-for-mdncomp/master/data.json", (res) => {
    const fs = require("fs");
    let dataLength = res.headers["content-length"]|0;
    let fileLength = fs.statSync(filePath).size;

    // todo length is not a safe check, but it'll work for now.. -> simple MD5 checksum.
    if (!force && dataLength === fileLength) {
      log(clr + ANSI.reset + ANSI.fgWhite + "No change - cancelling.");
    }
    else {
      if (res.statusCode === 200) {
        res.on("data", (d) => {
          data += d;
          log(clr + ANSI.fgWhite + "Downloading data " + ANSI.fgGreen + ANSI.bright + ("").padStart(((count += 0.25)|0) % 50, "."));
        });
        res.on("end", () => {
          // compare and save data if different
          log(clr + ("").padStart(72, " "));
          log(clr + ANSI.fgWhite + "Saving to: " + filePath);
          fs.writeFile(filePath, data, "utf8", err => {
            if (err) log(ANSI.fgRed + "Could not write new data to file...", err, ANSI.fgWhite);
            else {
              log("Updated with " + data.length + " bytes. All systems are GO!")
            }
          })
        });
      }
      else {
        log("An unknown error occurred. Status code:", res.statusCode);
      }
    }
  }).on("error", (err) => {
    log("An error occurred:", err, ANSI.reset + ANSI.fgWhite);
  });

}

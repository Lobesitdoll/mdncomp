const fs = require("fs");
const path = require("path");

// todo some of these (mobil/dt, random options..)

function go(path) {

  io = require("./io");

  // fixing non-valid args produced by f.ex "\*"
  if ( typeof path !== "string" ) path = ".";

  // both dt and mob -> cancel out the not options
  if ( options.desktop && options.mobile )
    options.desktop = options.mobile = false;

  /*
      Random ?
   */
  if ( options.random ) {
    path = randomCompat(path);
    options.index = 0;
  }

  /*------------------------------------------------------------------------------------------------------------------*

      MAIN USE: Show info based on keyword (wildcard, fuzzy, regexp)

  *------------------------------------------------------------------------------------------------------------------*/

  let result = search(path, options.caseSensitive);  // done



  if ( !result.length ) {
    outInfo("Not found.");
  }
  else {
    if ( result.length === 1 || (options.index >= 0 && options.index < result.length) || options.all ) {

      if ( options.shorthand )
        shortPad = getMaxLength(result);

      if ( options.index >= 0 && options.index < result.length )
        result = result.splice(options.index, 1);

      result.forEach(entry => {
        outResult(entry);
      });

      if ( result.length === 1 ) {
        let compat = new MDNComp(result[ 0 ]);

        // check --doc link
        if ( options.doc || options.docforce ) {
          if ( compat.url && compat.url.length ) {
            getDoc(compat.url, _commit);
          }
          else {
            outInfo(ANSI.red + "Documentation URL is not defined for this feature." + ANSI.reset + lf);
            _commit();
          }
        }
        else {
          _commit();
        }

        // check --mdn link
        if ( options.mdn ) {
          if ( compat.url.length ) {
            io.run(compat.url);
          }
          else {
            log("No URL is defined for this entry.");
          }
        }

      }
    }
    else {
      let pad = (result.length + "").length;
      result.forEach((item, i) => {
        outInfo(ANSI.yellow + "[" + ANSI.green + (i + "").padStart(pad) + ANSI.yellow + "] " + ANSI.white + item + ANSI.reset);
      });
    }
  }

  function _commit() {
    addFooter();
    commit();
    if ( options.waitkey ) {
      console.log(ANSI.cursorUp + ANSI.cursorUp);
      setTimeout(() => console.log("Waiting for ENTER key..." + ANSI.cursorUp), 3000);
      process.stdin.on("data", () => process.exit());
    }
  }

  function addFooter() {
    outStore(ANSI.magenta + "Data from MDN - `npm i -g mdncomp` by epistemex" + ANSI.white + lf + ANSI.reset);
  }

  function outResult(entry) {
    let compat = new MDNComp(entry);
    outStore(options.shorthand
             ? compatToShort(compat, global.shortPad)
             : compatToLong(compat));
  }

  /**
   * If --out is specified, commit all data (if any) to a single file.
   */
  function commit() {
    if ( options.out && saves.length ) {
      // race cond. in this scenario is theoretically possible..
      if ( fs.existsSync(options.out) && !options.overwrite ) {
        const readLine = require("readline"),
          rl = readLine.createInterface({
            input : process.stdin,
            output: process.stdout
          });

        rl.question(ANSI.yellow + "A file with this name already exists. Overwrite? (y(es), default: no)? " + ANSI.white, resp => {
          if ( resp.startsWith("y") ) _save(() => {
            rl.close();
          });
          else {
            log("File not saved.");
            rl.close();
            process.exit();
          }
        });
      }
      else
        _save();
    }

    function _save(callback) {
      fs.writeFile(options.out, saves.join("\n"), "utf8", function(err) {
        if ( err ) return log("An error occurred:" + lf + err);
        log(ANSI.green + `Saved output to file "${ANSI.cyan + options.out + ANSI.green}"!` + ANSI.reset);
        if ( callback ) callback();
      });
    }
  }

} // :go
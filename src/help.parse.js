
function parseHelp(args) {

  if (args.length < 4) {
    log();
    log("  Examples:");
    log("    mdncomp arcTo                   show information for arcTo");
    log("    mdncomp html*toblob.            will find HTMLCanvasElement.toBlob");
    log("    mdncomp -z hctbb.               will find HTMLCanvasElement.toBlob (fuzzy)");
    log("    mdncomp --list .                list all top-level paths");
    log()
  }
  else {
    let
      option = (args[2].toLowerCase() === "-h" || args[2].toLowerCase() === "--help") ? args[3] : args[2],
      text = require("./help").help[option];

    log();
    log(`${ANSI.yellow}Help for option "${option}"${ANSI.reset}`);
    log(text ? text : "Unknown option.");
    log();
  }

}
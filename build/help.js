const help={};help["-v"]=help["--version"]="\nList version information for this release in semver format.",help["-l"]=help["--list"]='\nThis will list *branches* and not objects (unless they are branches as\nwell). This can help you navigate to a specific object in a branch.\n\nThere are currently 3 "special" branches:\n\n"." (a single dot) will list the top-level branches, the roots if\nyou will:\n\n    mdncomp -l .\n    ->\n    api\n    css\n    html\n    http\n    javascript\n    webdriver\n    webextensions\n\nFrom there you can list all branches on for example "css":\n\n    mdncomp -l css\n    ->\n    css.at-rules\n    css.properties\n    css.selectors\n    css.types\n\nand so on.\n\n"experimental" will list all APIs and objects that are marked \nexperimental:\n\n    mdncomp -l experimental\n    ->\n    api.AbortController\n    api.AbortSignal\n    api.Animation\n    api.AnimationEffectReadOnly\n    --X8--\n\n"deprecated" will list all APIs and objects that are obsolete or\ndeprecated from the standard.',help["-o"]=help["--out"]='\nOutputs the results to a file. The extension of the file can currently be\n"txt" or "ansi", and will determine output type. Any other extension will be\nconsidered ansi.\n\nIf a file with the same name already exists you will be prompted if you\nwant to override or not. This unless the -x, --overwrite option is used\n(see below).',help["-x"]=help["--overwrite"]="\nWhen outputting a file, using this option will override an existing\nfile with the same name.",help["-d"]=help["--desktop"]="\nOnly show information about desktop browsers.",help["-m"]=help["--mobile"]="\nOnly show information about mobile device browsers.",help["-c"]=help["--case-sensitive"]="\nWhen searching determine that the search should be\nconducted using case-sensitive comparison.\nDefault is case-insensitive.",help["-a"]=help["--all"]="\nIf there are multiple results for a search term, this will allow \nshowing information for all the results.\n\nNote: currently not supported with SVG output.",help["-z"]=help["--fuzzy"]='\nSearch using a "fuzzy" search term. This simply mean expressing the\nsearch term as chosen letters from the target path:\n\n    mndcomp -z htcetblb.\n\nwill produce the result for "HTMLCanvasElement.toBlob".\n\nThe option can be stored in the "config file" if you want to use it\npermanently.',help["-i"]=help["--index"]='\nWhen multiple results are listed they are assigned a index number in \nthe result list. To list one particular result from that list, use this\noption:\n\n    $ mdncomp blob\n    [0] api.Blob\n    [1] api.Blob.Blob\n    [2] api.Blob.size\n    [3] api.Blob.type\n    [4] api.Blob.slice\n    [5] api.BlobBuilder\n    [6] api.BlobEvent\n    --X8--\n\nTo list index 6, "api.BlobEvent" do:\n\n    $ mdncomp blob -i 6',help["-s"]=help["--shorthand"]="\nList a textual shorthand version of API information.\n\nFor example:\n\n $ mdncomp blobbuilder -s\n ->\n BlobBuilder: DT: C:8 E:Y F:?-18* IE:10 O:- S:- MOB: CA:? FA:?-18* EM:Y OA:- Si:- WA:-",help["-h"]=help["--split"]='\nUsed with the "-s, --shorthand" option to split a line into two.\nFor example:\n\n mdncomp blob -ash\n ->\n Blob:\n   D: C:5 E:Y F:4 IE:10 O:11 S:5.1  M: CA:? FA:14 EM:Y OA:? Si:? WA:-\n Blob.Blob:\n   D: C:20 E:? F:13* IE:10 O:12 S:8  M: CA:? FA:14* EM:? OA:? Si:? WA:-\n Blob.size:\n   D: C:5 E:Y F:4 IE:10 O:11 S:5.1  M: CA:- FA:- EM:Y OA:- Si:- WA:-\n --X8--',help["-b"]=help["--browser"]='\nThis will list release and status information for a *browser* based on\nthe given ID.\n\nUsing "." (a single dot) will list all the currently valid IDs:\n\n    mdncomp --browser .\n    ->\n    chrome\n    edge\n    edge_mobile\n    firefox\n    firefox_android\n    ie\n    nodejs\n    opera\n    safari\n    safari_ios\n    samsunginternet_android\n\nThen pick an ID to obtain information about it:\n\n    mdncomp -b edge\n    ->\n    edge  12  Rel: 2015-07-15  retired\n    edge  13  Rel: 2015-11-05  retired\n    edge  14  Rel: 2016-08-02  retired\n    edge  15  Rel: 2017-04-11  retired\n    edge  16  Rel: 2017-09-26  current\n    edge  17  Rel: -           nightly\n\nYou can also get a list of browser bases on status. The following\nstatus keywords are supported:\n\n    current, retired, planned, beta, nightly, esr\n\nSo to list for example the current active browsers:\n\n    mdncomp --browser current\n    ->\n    chrome           65   Rel: 2018-03-06\n    edge             16   Rel: 2017-09-26\n    edge_mobile      16   Rel: -\n    firefox          57   Rel: 2017-11-14\n    firefox_android  57   Rel: 2017-11-28\n    ie               11   Rel: 2013-10-17\n    nodejs            4   Rel: 2015-09-08\n    --X8--',help["-W"]=help["--no-workers"]="\nDon't show information about support in Web Workers.",help["-N"]=help["--no-notes"]="\nDon't list footnotes with the information. A browser will still be\nmarked having footnotes but with a generic astrix symbol instead.\n\nFor the --browser option the links will not be shown.",help["-e"]=help["--noteend"]="\nFootnotes are collected and shown at the end when information about\nboth desktop and mobile are shown in the textual output.\n\nBy default footnotes are shown separately for each section.",help["-f"]=help["--markdown"]="\nFormats the MDN link as markdown in the textual output.",help["--ext"]="\nShows an additional table for less common browsers.",help["--desc"]="\nWill include a short description of the feature after the link in the\ndefault long output format, if available.",help["--specs"]="\nShow specification links and status, if available.",help["--sab"]="\nShow support for SharedArrayBuffer as param (usually with WebGL).",help["--no-colors"]="\nTurns off ANSI colors and codes in the terminal.",help["--max-chars"]='\nSet max number of characters on a (textual) line. Default is 72 but if\nyou prefer longer lines this can be set here. Using "-1" (negative one)\nas value means no line limit.\n\nNote that width is ignored for links.',help["--doc"]='\nShow an excerpt from the official documentation for this feature.\n\nThe documentation is loaded from MDN server and parsed into text in the\nterminal. The HTML excerpt is cached to the \n"[installation folder]/cached" with a MD5 as filename based on the URL.\n\nTo update cache either delete the folder, an entry or use the\n--docforce option',help["--docforce"]="\nSame as --doc but will force fetch the content, re-parse and update \nthe cache.",help["--mdn"]="\nIf a documentation link is defined for the feature this option will \nattempt opening the link in the default browser.",help["--waitkey"]='\nWait for the ENTER key before continuing/exiting. This can be useful if mdncomp is used in\na "popup" terminal so the terminal stays open until the ENTER key is hit before closing.',help["--random"]="\nFeel like exploring? Discover new features using this option. You can \nspecify either all by using a dot (.) or a keyword or search term \n(which of course can be combined with fuzzy search).\n\n    $ mdncomp --random .\n    $ mdncomp --random audio\n    $ mdncomp --random ht*blob\n    $ mdncomp --random --fuzzy hblb\n\nIt can be combined with documentation excerpts (if the URL for it is\navailable) or short descriptions:\n\n    $ mdncomp --random . --doc\n    $ mdncomp --random . --desc\n    $ mdncomp --random --desc audio\n\nAs well as `--mdn` (opens browser for this feature if URL for it is\navailable) etc.\n\nNote that some options are ignored using this option.",help["--configpath"]="\nShow the path to the root folder used to store the optional config file\nand the documentation excerpts cache.",help["--no-config"]="\nIgnores the config file if specified. As the config file will override\noptions this option will allow bypassing those overrides.\n\nOptions that will be ignored regardless are:\n--no-config, --out, --all, --index, --browser, --list,\n--version, --update, --cupdate, --fupdate and --help.",help["--update"]=help["--cupdate"]=help["--fupdate"]='\nUpdate the precompiled Browser Compatibility Data object. If the data\nis considered to be the same (using MD5 hash against server file) no\ndata will be downloaded.\n\nTo just check if there is new data use the check option "--cupdate".\n\nTo force update regardless if the data is the same you can use\nthe "--fupdate" variant.\n\nNo other options are allowed with the update options:\n\n    mdncomp --update\n    mdncomp --fupdate\n\n**NOTE:** Data is checked (MD5) and downloaded from the following \nGitHub repository:\n\n    https://github.com/epistemex/data-for-mdncomp\n\nwhich must be allowed through your firewall.\n\nTwo files in the root directory (this may change in the future) are\nloaded:\n\n    data.json\n    data.md5\n\nThese are saved locally to "[npm-install-folder]/mdncomp/data/".',help["-h"]=help["--help"]="\nList options, or show more detailed help per option (no options will\ndefault to `--help`):\n\n    mdncomp\n    mdncomp --help\n    mdncomp -h -l      # shows help for the --list option",module.exports.help=help;
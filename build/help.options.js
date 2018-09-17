const help={};help["-v"]=help["--version"]="\nList version information for this release in semver format.",help["-l"]=help["--list"]='\nThis will list *branches* and not objects (unless they are branches as\nwell). This can help you navigate to a specific object in a branch.\n\nIf no argument or a single dot (.) a root list will be outputted.\nFrom there you can list all branches on for example "webextensions":\n\n    mdncomp -l webextensions\n    ->\n    [0] B webextensions.api\n    [1] P webextensions.manifest\n    [2] F webextensions.match_patterns\n\nThe list shows index number for each entry, type (B = Branch, P = non-feature parent\nbut with feature children, and F which is a feature itself).\n\nYou can extent the search term using the name as typed fully or partly, or combine\nthe --index option, or simple add a number (from the list) as argument (these do\nthe same):\n\n    mdncomp -l webextensions.manifest\n    mdncomp -l webextensions --index 1\n    mdncomp -l webextensions -i 1\n    mdncomp -l webextensions 1\n    \nand so on. Note: using the index will list the next resulting list without indices.\n\nUsing status "experimental" will list all APIs and objects that are marked \nexperimental, "deprecated" will list all APIs and objects that are obsolete or\ndeprecated from the standard etc.',help["-D"]=help["--no-desktop"]="\nDon't show information for desktop browsers.",help["-M"]=help["--no-mobile"]="\nDon't show information for mobile device browsers.",help["-c"]=help["--case-sensitive"]="\nWhen searching determine that the search should be conducted using case-sensitive \ncomparison.",help["-z"]=help["--fuzzy"]='\nSearch using a "fuzzy" search term. This simply mean expressing the\nsearch term as chosen letters from the target path:\n\n    mndcomp -z ahcb.\n\nwill produce the result for "HTMLCanvasElement.toBlob".\n\nFrom version 2 fuzzy is automatically applied on a second pass if no result was found in the first\n(unless option --deep is used). The option can be stored in the "config file" if you want to use it\npermanently.',help["-d"]=help["--deep"]="\nDo a deep search using the search term for descriptions, title, footnotes,\nhistory and metadata branches as well.\n\nNote: The search may take significantly more time to execute. We recommend using\ncustom regular expressions when doing deep searches.",help["-i"]=help["--index"]='\nWhen multiple results are listed they are assigned a index number in \nthe result list. To list one particular result from that list, use this\noption:\n\n    mdncomp blob\n    [ 0] api.Blob\n    [ 1] api.BlobBuilder\n    [ 2] api.BlobEvent\n    [ 3] api.Body.blob\n    --X8--\n\nTo list "api.BlobEvent" at index 2:\n\n    $ mdncomp blob -i 2\n    \nTip: you can use a shorthand version of this option, simply omit the option name and\ntype in the number directly as an argument:\n\n    $ mdncomp blob 2\n',help["-s"]=help["--shorthand"]="\nList a compact shorthand table version of the support information.",help["-b"]=help["--browser"]="\nThis will list release and status information for a *browser* based on\nthe given ID.\n\nIf no argument or a single dot (.) it list all the currently valid IDs. Then pick \nan ID to obtain information about it.\n\n    mdncomp -b edge\n\nYou can also list browsers based on status.\n\n    mdncomp -b current\n\nTo not list links combine the -N, --no-notes option.",help["-N"]=help["--no-notes"]="\nDon't list footnotes with the information. A browser will still be\nmarked having footnotes but with a generic astrix symbol instead.\n\nFor the --browser option the links will not be shown.",help["--ext"]=help["-x"]="\nShows an additional table for less common browsers.",help["--desc"]="\nWill include a short description of the feature after the link in the\ndefault long output format, if available.",help["--specs"]="\nShow specification links and status, if available.",help["--json"]=help["-j"]="\nOutput search result as raw JSON. This is useful for piping the entry to other tools\nor to locate errors.",help["--no-obsolete"]="\nHide obsolete, non-standard and deprecated child features.\n\nIf ANSI colors are enabled it will show as darker gray in the output.",help["--custom"]=help["-u"]='\nDefine custom columns (see option -b, --browser for a list of valid ids).\n\n    mdncomp -u "chrome edge firefox" html*toblob\n    mdncomp -u "chrome,edge,firefox;safari_ios" html*toblob\n    \nYou can separate the ids with space, comma, semi-column or column.\nThe columns will automatically be be sorted and segmented.',help["--no-colors"]="\nTurns off ANSI colors and codes in the terminal.",help["--max-chars"]='\nSet max number of characters on a (textual) line. Default is 84 but if\nyou prefer longer lines this can be set here. Using "-1" as value means \nno line limit.\n\nNote that width is ignored for URLs.',help["--random"]="\nFeel like exploring? Discover new features using this option. You can \nspecify either all by omitting any argument, or a keyword or search term \n(which can be combined with the --fuzzy option) to limit scope.\n\n    $ mdncomp --random\n    $ mdncomp --random audio\n    $ mdncomp --random ht*blob\n    $ mdncomp --random hblb --fuzzy\n\nIt can be combined with documentation excerpts (if the URL for it is\navailable) or short descriptions:\n\n    $ mdncomp --random . --doc\n    $ mdncomp --random . --desc\n    $ mdncomp --random --desc audio\n\nAs well as `--mdn` (opens browser for this feature if URL for it is\navailable) etc.\n\nNote that some options are ignored using this option.",help["--configpath"]="\nShow the path to the root folder used to store the optional config file\nand the documentation excerpts cache.",help["-G"]=help["--no-config"]="\nIgnores the config file if specified. As the config file will override\noptions this option will allow bypassing those overrides.",help["--set"]="\nSet or clear a value in the config file. If no config exists, one will be created.\n\nExample: define permanent custom columns:\n\n  mdncomp --set columns=edge,chrome,firefox\n\nClear the setting from the config file entirely:\n\n  mdncomp --set columns=\n\nList valid keys:\n\n  mdncomp --set ?\n\nThe settings can be manually edited directly in the JSON config file. See --configpath.",help["--lang"]="\nUse a specific language for the user interface. Language is an ISO code, for example:\n\n  mdncomp --lang en\n  mdncomp --lang en-us\n  mdncomp --lang es\n  mdncomp --lang no\n\nLanguages can be set permanently using the --set option:\n\n  mdncomp --set lang=en\n\nAnd removed (in which case the default en-us will be used):\n\n  mdncomp --set lang=\n\nThe language setting affects the user interface and descriptions (where available).",help["--update"]=help["--fupdate"]='\nUpdate the precompiled Browser Compatibility Data object as full dataset or \npatches. If the data is considered to be the same no data will be downloaded.\n\nTo force update regardless if the data is the same you can use "--fupdate".\n\nNo other options are allowed with the update options:\n\n    mdncomp --update\n    mdncomp --fupdate\n\nmdncomp first checks if there is a patch file available and will use\nthat, otherwise a full update of the data file will be invoked.\n\nmdncomp has built-in redundancy in case main data server is down.',help["-y"]=help["--history"]="\nShow detailed list of version history for each browser.",help["--expert"]="\nDisables output of hints information including legends.",help["-h"]=help["--help"]="\nList options, or show more detailed help per option (no options will\ndefault to `--help`):\n\n    mdncomp\n    mdncomp --help\n    mdncomp -h -l      # shows help for the --list option",module.exports.help=help;
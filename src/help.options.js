/*
  Help information per object.
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const help = {};

// Use string literals and start on the -next- line to prepend a line-feed. Likewise DON'T allow linefeed at the end (is added by parser).

/*--------------------------------------------------------------------------------------------------*/
help[ "-v" ] = help[ "--version" ] = `
List version information for this release in semver format.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-l" ] = help[ "--list" ] = `
This will list *branches* and not objects (unless they are branches as
well). This can help you navigate to a specific object in a branch.

If no argument or a single dot (.) a root list will be outputted.
From there you can list all branches on for example "webextensions":

    mdncomp -l webextensions
    ->
    [0] B webextensions.api
    [1] P webextensions.manifest
    [2] F webextensions.match_patterns

The list shows index number for each entry, type (B = Branch, P = non-feature parent
but with feature children, and F which is a feature itself).

You can extent the search term using the name as typed fully or partly, or combine
the --index option, or simple add a number (from the list) as argument (these do
the same):

    mdncomp -l webextensions.manifest
    mdncomp -l webextensions --index 1
    mdncomp -l webextensions -i 1
    mdncomp -l webextensions 1
    
and so on. Note: using the index will list the next resulting list without indices.

Using status "experimental" will list all APIs and objects that are marked 
experimental, "deprecated" will list all APIs and objects that are obsolete or
deprecated from the standard etc.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-D" ] = help[ "--no-desktop" ] = `
Don't show information for desktop browsers.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-M" ] = help[ "--no-mobile" ] = `
Don't show information for mobile device browsers.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-c" ] = help[ "--case-sensitive" ] = `
When searching determine that the search should be conducted using case-sensitive 
comparison.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-z" ] = help[ "--fuzzy" ] = `
Search using a "fuzzy" search term. This simply mean expressing the
search term as chosen letters from the target path:

    mndcomp -z ahcb.

will produce the result for "HTMLCanvasElement.toBlob".

From version 2 fuzzy is automatically applied on a second pass if no result was found in the first
(unless option --deep is used). The option can be stored in the "config file" if you want to use it
permanently.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-d" ] = help[ "--deep" ] = `
Do a deep search using the search term for descriptions, title, footnotes,
history and metadata branches as well.

Note: The search may take significantly more time to execute. We recommend using
custom regular expressions when doing deep searches.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-i" ] = help[ "--index" ] = `
When multiple results are listed they are assigned a index number in 
the result list. To list one particular result from that list, use this
option:

    mdncomp blob
    [ 0] api.Blob
    [ 1] api.BlobBuilder
    [ 2] api.BlobEvent
    [ 3] api.Body.blob
    --X8--

To list "api.BlobEvent" at index 2:

    $ mdncomp blob -i 2
    
Tip: you can use a shorthand version of this option, simply omit the option name and
type in the number directly as an argument:

    $ mdncomp blob 2
`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-s" ] = help[ "--shorthand" ] = `
List a compact shorthand table version of the support information.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-b" ] = help[ "--browser" ] = `
This will list release and status information for a *browser* based on
the given ID.

If no argument or a single dot (.) it list all the currently valid IDs. Then pick 
an ID to obtain information about it.

    mdncomp -b edge

You can also list browsers based on status.

    mdncomp -b current

To not list links combine the -N, --no-notes option.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-N" ] = help[ "--no-notes" ] = `
Don't list footnotes with the information. A browser will still be
marked having footnotes but with a generic astrix symbol instead.

For the --browser option the links will not be shown.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--ext" ] = help[ "-x" ] = `
Shows an additional table for less common browsers.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--desc" ] = `
Will include a short description of the feature after the link in the
default long output format, if available.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--specs" ] = `
Show specification links and status, if available.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--json" ] = help[ "-j" ] = `
Output search result as raw JSON. This is useful for piping the entry to other tools
or to locate errors.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--no-obsolete" ] = `
Hide obsolete, non-standard and deprecated child features.

If ANSI colors are enabled it will show as darker gray in the output.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--custom" ] = help[ "-u" ] = `
Define custom columns (see option -b, --browser for a list of valid ids).

    mdncomp -u "chrome edge firefox" html*toblob
    mdncomp -u "chrome,edge,firefox;safari_ios" html*toblob
    
You can separate the ids with space, comma, semi-column or column.
The columns will automatically be be sorted and segmented.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--no-colors" ] = `
Turns off ANSI colors and codes in the terminal.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--max-chars" ] = `
Set max number of characters on a (textual) line. Default is 84 but if
you prefer longer lines this can be set here. Using "-1" as value means 
no line limit.

Note that width is ignored for URLs.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--random" ] = `
Feel like exploring? Discover new features using this option. You can 
specify either all by omitting any argument, or a keyword or search term 
(which can be combined with the --fuzzy option) to limit scope.

    $ mdncomp --random
    $ mdncomp --random audio
    $ mdncomp --random ht*blob
    $ mdncomp --random hblb --fuzzy

It can be combined with documentation excerpts (if the URL for it is
available) or short descriptions:

    $ mdncomp --random . --doc
    $ mdncomp --random . --desc
    $ mdncomp --random --desc audio

As well as \`--mdn\` (opens browser for this feature if URL for it is
available) etc.

Note that some options are ignored using this option.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--configpath" ] = `
Show the path to the root folder used to store the optional config file
and the documentation excerpts cache.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-G" ] = help[ "--no-config" ] = `
Ignores the config file if specified. As the config file will override
options this option will allow bypassing those overrides.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--set" ] = `
Set or clear a value in the config file. If no config exists, one will be created.

Example: define permanent custom columns:

  mdncomp --set columns=edge,chrome,firefox

Clear the setting from the config file entirely:

  mdncomp --set columns=

List valid keys:

  mdncomp --set ?

The settings can be manually edited directly in the JSON config file. See --configpath.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--lang" ] = `
Use a specific language for the user interface. Language is an ISO code, for example:

  mdncomp --lang en
  mdncomp --lang en-us
  mdncomp --lang es
  mdncomp --lang no

Languages can be set permanently using the --set option:

  mdncomp --set lang=en

And removed (in which case the default en-us will be used):

  mdncomp --set lang=

The language setting affects the user interface and descriptions (where available).`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--update" ] = help[ "--fupdate" ] = `
Update the precompiled Browser Compatibility Data object as full dataset or 
patches. If the data is considered to be the same no data will be downloaded.

To force update regardless if the data is the same you can use "--fupdate".

No other options are allowed with the update options:

    mdncomp --update
    mdncomp --fupdate

mdncomp first checks if there is a patch file available and will use
that, otherwise a full update of the data file will be invoked.

mdncomp has built-in redundancy in case main data server is down.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-y" ] = help[ "--history" ] = `
Show detailed list of version history for each browser.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "--expert" ] = `
Disables output of hints information including legends.`;

/*--------------------------------------------------------------------------------------------------*/
help[ "-h" ] = help[ "--help" ] = `
List options, or show more detailed help per option (no options will
default to \`--help\`):

    mdncomp
    mdncomp --help
    mdncomp -h -l      # shows help for the --list option`;

/*--------------------------------------------------------------------------------------------------*/
module.exports.help = help;

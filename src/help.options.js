/*
  Help information per object.
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const help = {};

// Use string literals and start on the -next- line to prepend a line-feed. Likewise DON'T allow linefeed at the end (is added by parser).

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-v"] = help["--version"] = `
List version information for this release in semver format.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-l"] = help["--list"] = `
This will list *branches* and not objects (unless they are branches as
well). This can help you navigate to a specific object in a branch.

There are currently 3 "special" branches:

"." (a single dot) will list the top-level branches, the roots if
you will:

    mdncomp -l .
    ->
    api
    css
    html
    http
    javascript
    webdriver
    webextensions

From there you can list all branches on for example "css":

    mdncomp -l css
    ->
    css.at-rules
    css.properties
    css.selectors
    css.types

and so on.

"experimental" will list all APIs and objects that are marked 
experimental:

    mdncomp -l experimental
    ->
    api.AbortController
    api.AbortSignal
    api.Animation
    api.AnimationEffectReadOnly
    --X8--

"deprecated" will list all APIs and objects that are obsolete or
deprecated from the standard.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-o"] = help["--out"] = `
Outputs the results to a file. The extension of the file can currently be
"txt" or "ansi", and will determine output type. Any other extension will be
considered ansi.

If a file with the same name already exists you will be prompted if you
want to override or not. This unless the -x, --overwrite option is used
(see below).`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-x"] = help["--overwrite"] = `
When outputting a file, using this option will override an existing
file with the same name.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-d"] = help["--desktop"] = `
Only show information about desktop browsers.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-m"] = help["--mobile"] = `
Only show information about mobile device browsers.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-c"] = help["--case-sensitive"] = `
When searching determine that the search should be
conducted using case-sensitive comparison.
Default is case-insensitive.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-a"] = help["--all"] = `
If there are multiple results for a search term, this will allow 
showing information for all the results.

Note: currently not supported with SVG output.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-z"] = help["--fuzzy"] = `
Search using a "fuzzy" search term. This simply mean expressing the
search term as chosen letters from the target path:

    mndcomp -z htcetblb.

will produce the result for "HTMLCanvasElement.toBlob".

The option can be stored in the "config file" if you want to use it
permanently.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-i"] = help["--index"] = `
When multiple results are listed they are assigned a index number in 
the result list. To list one particular result from that list, use this
option:

    $ mdncomp blob
    [0] api.Blob
    [1] api.Blob.Blob
    [2] api.Blob.size
    [3] api.Blob.type
    [4] api.Blob.slice
    [5] api.BlobBuilder
    [6] api.BlobEvent
    --X8--

To list index 6, "api.BlobEvent" do:

    $ mdncomp blob -i 6`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-s"] = help["--shorthand"] = `
List a textual shorthand version of API information.

For example:

 $ mdncomp blobbuilder -s
 ->
 BlobBuilder: DT: C:8 E:Y F:?-18* IE:10 O:- S:- MOB: CA:? FA:?-18* EM:Y OA:- Si:- WA:-`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-h"] = help["--split"] = `
Used with the "-s, --shorthand" option to split a line into two.
For example:

 mdncomp blob -ash
 ->
 Blob:
   D: C:5 E:Y F:4 IE:10 O:11 S:5.1  M: CA:? FA:14 EM:Y OA:? Si:? WA:-
 Blob.Blob:
   D: C:20 E:? F:13* IE:10 O:12 S:8  M: CA:? FA:14* EM:? OA:? Si:? WA:-
 Blob.size:
   D: C:5 E:Y F:4 IE:10 O:11 S:5.1  M: CA:- FA:- EM:Y OA:- Si:- WA:-
 --X8--`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-b"] = help["--browser"] = `
This will list release and status information for a *browser* based on
the given ID.

Using "." (a single dot) will list all the currently valid IDs:

    mdncomp --browser .
    ->
    chrome
    edge
    edge_mobile
    firefox
    firefox_android
    ie
    nodejs
    opera
    safari
    safari_ios
    samsunginternet_android

Then pick an ID to obtain information about it:

    mdncomp -b edge
    ->
    edge  12  Rel: 2015-07-15  retired
    edge  13  Rel: 2015-11-05  retired
    edge  14  Rel: 2016-08-02  retired
    edge  15  Rel: 2017-04-11  retired
    edge  16  Rel: 2017-09-26  current
    edge  17  Rel: -           nightly

You can also get a list of browser bases on status. The following
status keywords are supported:

    current, retired, planned, beta, nightly, esr

So to list for example the current active browsers:

    mdncomp --browser current
    ->
    chrome           65   Rel: 2018-03-06
    edge             16   Rel: 2017-09-26
    edge_mobile      16   Rel: -
    firefox          57   Rel: 2017-11-14
    firefox_android  57   Rel: 2017-11-28
    ie               11   Rel: 2013-10-17
    nodejs            4   Rel: 2015-09-08
    --X8--`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-N"] = help["--no-notes"] = `
Don't list footnotes with the information. A browser will still be
marked having footnotes but with a generic astrix symbol instead.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-e"] = help["--noteend"] = `
Footnotes are collected and shown at the end when information about
both desktop and mobile are shown in the textual output.

By default footnotes are shown separately for each section.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-f"] = help["--markdown"] = `
Formats the MDN link as markdown in the textual output.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--ext"] = `
Shows an additional table for less common browsers.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--desc"] = `
Will include a short description of the feature after the link in the
default long output format, if available.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--specs"] = `
Show specification links and status, if available.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--no-colors"] = `
Turns off ANSI colors and codes in the terminal.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--max-chars"] = `
Set max number of characters on a (textual) line. Default is 72 but if
you prefer longer lines this can be set here. Using "-1" (negative one)
as value means no line limit.

Note that width is ignored for links.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--doc"] = `
Show an excerpt from the official documentation for this feature.

The documentation is loaded from MDN server and parsed into text in the
terminal. The HTML excerpt is cached to the 
"[installation folder]/cached" with a MD5 as filename based on the URL.

To update cache either delete the folder, an entry or use the
--docforce option`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--docforce"] = `
Same as --doc but will force fetch the content, re-parse and update 
the cache.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--mdn"] = `
If a documentation link is defined for the feature this option will 
attempt opening the link in the default browser.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--random"] = `
Feel like exploring? Discover new features using this option. You can 
specify either all by using a dot (.) or a keyword or search term 
(which of course can be combined with fuzzy search).

    $ mdncomp --random .
    $ mdncomp --random audio
    $ mdncomp --random ht*blob
    $ mdncomp --random --fuzzy hblb

It can be combined with documentation excerpts (if the URL for it is
available) or short descriptions:

    $ mdncomp --random . --doc
    $ mdncomp --random . --desc
    $ mdncomp --random --desc audio

As well as \`--mdn\` (opens browser for this feature if URL for it is
available) etc.

Note that some options are ignored using this option.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--configpath"] = `
Show the path to the root folder used to store the optional config file
and the documentation excerpts cache.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--no-config"] = `
Ignores the config file if specified. As the config file will override
options this option will allow bypassing those overrides.

Options that will be ignored regardless are:
--no-config, --out, --all, --index, --browser, --list,
--version, --update, --cupdate, --fupdate and --help.`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["--update"] = help["--cupdate"] = help["--fupdate"] = `
Update the precompiled Browser Compatibility Data object. If the data
is considered to be the same (using MD5 hash against server file) no
data will be downloaded.

To just check if there is new data use the check option "--cupdate".

To force update regardless if the data is the same you can use
the "--fupdate" variant.

No other options are allowed with the update options:

    mdncomp --update
    mdncomp --fupdate

**NOTE:** Data is checked (MD5) and downloaded from the following 
GitHub repository:

    https://github.com/epistemex/data-for-mdncomp

which must be allowed through your firewall.

Two files in the root directory (this may change in the future) are
loaded:

    data.json
    data.md5

These are saved locally to "[npm-install-folder]/mdncomp/data/".`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
help["-h"] = help["--help"] = `
List options, or show more detailed help per option (no options will
default to \`--help\`):

    mdncomp
    mdncomp --help
    mdncomp -h -l      # shows help for the --list option`;

/*----------------------------------------------------------------------------------------------------------------------------------*/
module.exports.help = help;

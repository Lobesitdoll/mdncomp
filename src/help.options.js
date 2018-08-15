/*
  Help information per object.
  Copyright (c) 2018 Epistemex
  www.epistemex.com
*/

const help = {};

// Use string literals and start on the -next- line to prepend a line-feed. Likewise DON'T allow linefeed at the end (is added by parser).

/*--------------------------------------------------------------------------------------------------*/
help["-v"] = help["--version"] = `
List version information for this release in semver format.`;

/*--------------------------------------------------------------------------------------------------*/
help["-l"] = help["--list"] = `
This will list *branches* and not objects (unless they are branches as
well). This can help you navigate to a specific object in a branch.

There are currently 3 "special" branches:

If no argument or a single dot (.) a root list will be outputted:

    mdncomp -l
    ->
    Valid path roots:                 
    api                               
    css                               
    html                              
    http                              
    javascript                        
    mathml                            
    svg                               
    webdriver                         
    webextensions                     
                                      
    Valid statuses:                   
    standard, experimental, deprecated

From there you can list all branches on for example "css":

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
    
and so on. Note: using the index will list the resulting list without indices.

Using status "experimental" will list all APIs and objects that are marked 
experimental:

    mdncomp -l experimental
    ->
    api.AbortController
    api.AbortPaymentEvent
    api.AbortSignal
    api.AmbientLightSensor
    --X8--

"deprecated" will list all APIs and objects that are obsolete or
deprecated from the standard.`;

/*--------------------------------------------------------------------------------------------------*/
help["-D"] = help["--no-desktop"] = `
Don't show information for desktop browsers.`;

/*--------------------------------------------------------------------------------------------------*/
help["-M"] = help["--no-mobile"] = `
Don't show information for mobile device browsers.`;

/*--------------------------------------------------------------------------------------------------*/
help["-c"] = help["--case-sensitive"] = `
When searching determine that the search should be
conducted using case-sensitive comparison.
Default is case-insensitive.`;

/*--------------------------------------------------------------------------------------------------*/
help["-z"] = help["--fuzzy"] = `
Search using a "fuzzy" search term. This simply mean expressing the
search term as chosen letters from the target path:

    mndcomp -z htcetblb.

will produce the result for "HTMLCanvasElement.toBlob".

The option can be stored in the "config file" if you want to use it
permanently.`;

/*--------------------------------------------------------------------------------------------------*/
help["-i"] = help["--index"] = `
When multiple results are listed they are assigned a index number in 
the result list. To list one particular result from that list, use this
option:

    $ mdncomp blob
    [ 0] api.Blob
    [ 1] api.BlobBuilder
    [ 2] api.BlobEvent
    [ 3] api.Body.blob
    [ 4] api.HTMLCanvasElement.toBlob
    --X8--

To list "api.BlobEvent" at index 2:

    $ mdncomp blob -i 2
    
Tip: you can use a shorthand version of this option, simply omit the option name and
type in the number directly as an argument:

    $ mdncomp blob 2`;

/*--------------------------------------------------------------------------------------------------*/
help["-s"] = help["--shorthand"] = `
List a textual shorthand version of API information.

For example:

 $ mdncomp blobbuilder -s
 ->
 BlobBuilder: DT: C:8 E:Y F:?-18* IE:10 O:- S:- MOB: CA:? FA:?-18* EM:Y OA:- Si:- WA:-`;

/*--------------------------------------------------------------------------------------------------*/
help["-b"] = help["--browser"] = `
This will list release and status information for a *browser* based on
the given ID.

If no argument or a single dot (.) it list all the currently valid IDs:

    mdncomp --browser
    ->
    chrome                                       
    edge                                         
    edge_mobile                                  
    firefox                                      
    firefox_android                              
    ie                                           
    nodejs                                       
    opera                                        
    qq_android                                   
    safari                                       
    safari_ios                                   
    samsunginternet_android                      
    uc_android                                   
    uc_chinese_android                           
                                                 
    Valid statuses:                              
    beta, current, esr, nightly, planned, retired

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

    beta, current, esr, nightly, planned, retired

So to list for example the current active browsers:

    mdncomp --browser current
    ->
    STATUS: CURRENT                                                       
    Chrome              68           2018-07-24  https://chromereleases.go...
    Edge                17           2018-04-30  https://docs.microsoft.co...
    Edge Mobile         17           2018-04-30                           
    Firefox             61           2018-06-26  https://developer.mozilla...
    Firefox Android     61           2018-06-26  https://developer.mozilla...
    Internet Explorer   11           2013-10-17                           
    Opera               53           2018-05-10  https://dev.opera.com/blo...
    --X8--
 
 To not list links combine the -N, --no-notes option.`;

/*--------------------------------------------------------------------------------------------------*/
help["-w"] = help["--worker"] = `
Show detailed information about Worker support (if any).`;

/*--------------------------------------------------------------------------------------------------*/
help["-N"] = help["--no-notes"] = `
Don't list footnotes with the information. A browser will still be
marked having footnotes but with a generic astrix symbol instead.

For the --browser option the links will not be shown.`;

/*--------------------------------------------------------------------------------------------------*/
help["--ext"] = help["-x"] = `
Shows an additional table for less common browsers.`;

/*--------------------------------------------------------------------------------------------------*/
help["--desc"] = `
Will include a short description of the feature after the link in the
default long output format, if available.`;

/*--------------------------------------------------------------------------------------------------*/
help["--specs"] = `
Show specification links and status, if available.`;

/*--------------------------------------------------------------------------------------------------*/
help["--no-obsolete"] = `
Hide obsolete, non-standard and deprecated child features.

If ANSI colors are enabled it will show as darker gray in the output.`;

/*--------------------------------------------------------------------------------------------------*/
help["--custom"] = help["-u"] = `
Define custom columns (see option -b, --browser for a list of valid ids).

    mdncomp -u "chrome edge firefox" html*toblob
    mdncomp -u "chrome,edge,firefox;safari_ios" html*toblob
    
You can separate the ids with space, comma, semi-column or column.
The columns will automatically be be sorted and segmented.`;

/*--------------------------------------------------------------------------------------------------*/
help["--sab"] = `
Show detailed support for SharedArrayBuffer as param (usually with WebGL) (if any).`;

/*--------------------------------------------------------------------------------------------------*/
help["--no-colors"] = `
Turns off ANSI colors and codes in the terminal.`;

/*--------------------------------------------------------------------------------------------------*/
help["--max-chars"] = `
Set max number of characters on a (textual) line. Default is 84 but if
you prefer longer lines this can be set here. Using "-1" (negative one)
as value means no line limit.

Note that width is ignored for URLs.`;

/*--------------------------------------------------------------------------------------------------*/
help["--random"] = `
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
help["--configpath"] = `
Show the path to the root folder used to store the optional config file
and the documentation excerpts cache.`;

/*--------------------------------------------------------------------------------------------------*/
help["-G"] = help["--no-config"] = `
Ignores the config file if specified. As the config file will override
options this option will allow bypassing those overrides.`;

/*--------------------------------------------------------------------------------------------------*/
help["--set"] = `
Set or clear a value in the config file. If no config exists, one will be created.

Example: define permanent custom columns:

  mdncomp --set columns=edge,chrome,firefox

Clear the setting from the config file entirely:

  mdncomp --set columns=

List valid keys:

  mdncomp --set ?

The settings can be manually edited directly in the JSON config file. See --configpath.`;

/*--------------------------------------------------------------------------------------------------*/
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

mdncomp first checks if there is a patch file available and will use
that, otherwise a full update of the data file will be invoked.

mdncomp has built-in redundancy in case main data server is down.

Two files in the root directory (this may change in the future) are
loaded:

    data.json
    data.md5

These are saved locally to "[npm-install-folder]/mdncomp/data/".
Always run a --update when (re)installing mdncomp from NPM.`;

/*--------------------------------------------------------------------------------------------------*/
help["-y"] = help["--history"] = `
Show detailed list of version history for each browser.`;

/*--------------------------------------------------------------------------------------------------*/
help["--expert"] = `
Disables output of hints information including legends.`;

/*--------------------------------------------------------------------------------------------------*/
help["-h"] = help["--help"] = `
List options, or show more detailed help per option (no options will
default to \`--help\`):

    mdncomp
    mdncomp --help
    mdncomp -h -l      # shows help for the --list option`;

/*--------------------------------------------------------------------------------------------------*/
module.exports.help = help;

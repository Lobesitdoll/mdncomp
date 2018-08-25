Options:
========

**mdncomp** comes with several options to get most out of the BCD data.
Many of the options has a shorthand version in addition to the long version.

You can combine several options, and order doesn't matter except in the case of
the `--help` option which must be first or second when used in combination with
another option you want help for. Also the `--*update`, `--version` options are
only used on their own.

In some cases an argument is not required, such as the above mentioned ones in addition
to options such as `--random`. Other options only works in combination with
results such as `--desc` (summary description), `--specs` (specifications) etc.

```text
-v, --version         Output the version number                                           
-l, --list [api]      List paths starting with given branch(es), ? for root list          
-b, --browser [id]    Show information about this browser, or list IDs if none            
-i, --index <index>   Show this index from a multiple result list (def.: -1)              
-D, --no-desktop      Don't show for desktop devices                                      
-M, --no-mobile       Don't show for mobile devices                                       
-x, --ext             Show extended table of browsers/servers                             
-R, --no-children     Don't show children object in table                                 
-c, --case-sensitive  Search in case-sensitive mode                                       
-z, --fuzzy           Use fuzzy method for search term                                    
-d, --deep            Do deep search (footnotes, history etc.)                            
-s, --shorthand       Show compact table format                                           
--desc                Show description of the feature (if any)                            
--specs               Show specification links                                            
--sub <index>         Show sub-feature with index n                                       
-N, --no-notes        Don't show footnotes                                                
-F, --no-flags        Don't show flags                                                    
-y, --history         List version history entries per browser.                           
-O, --no-obsolete     Hide obsolete, non-standard and deprecated child features.          
-u, --columns <cols>  Define custom columns using valid browser ids (see -b)              
--random [scope]      Show a random entry within optional scope                           
--no-colors           Don't use colors in output                                          
--max-chars <width>   Max number of chars per line before wrap (def.: 84)                 
-G, --no-config       Ignore config file                                                  
--set <kv>            Set key/value for config file. Use ? to list valid keys.            
--configpath          Show path to where config file is stored                            
--expert [level]      Expert mode, disables hints. (def.: 0)                              
--lang <isocode>      Language code for UI and descriptions. Use ? for list.
--update              Update data from remote if available                                
--fupdate             Force update full data-set from remote                              
-h, --help            Output usage information                                            
```

-v, --version
-------------
List version information for this release in semver format.

-h, --help
-------------
List options, or show more detailed help per option (no options will
default to `--help`):

    mdncomp
    mdncomp --help
    mdncomp -h -l      # shows help for the --list option

-l, --list [path|status]
------------------------
This will list paths and not features (unless they are a parent path as well).

A path is based on how the BCD data is structured. The data is normally a hierarchy 
of *branches*, and when flattened a path represent the end-branch. For example:

    "javascript": {
      statements: {
        "let": { ... }
      }    
    }

becomes a dot-separated path like:

     javascript.statements.let

This can help you navigate to a specific object in a path, or to see what branches
are attached at the different levels to find (or explore) features.

Using `--list` or `-l` on its own (or with a optional `?` or `.` as argument) will show 
a list of valid *root* paths:

```text
mdncomp --list
                                  
Valid root paths:                 
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

```

From here you can list all branches attached to one, for example say `css`:

```text
mdncomp -l css
                    
[0] P css.at-rules  
[1] P css.properties
[2] P css.selectors 
[3] P css.types     
                    
P = Parent branch   

```

And you can keep adding next branch using full name or part of it, or the index
when there are several:

    mdncomp -l css.selectors
    mdncomp -l css.sel
    mdncomp -l css --index 3
    mdncomp -l css --i 3
    mdncomp -l css 3

all do the same. Note that when you're not using the full name you will still
need to type it in full to go to the next branch level later on.

There are three types of branches which can be seen here:

```text
mdncomp -l webext

[0] B webextensions.api                                                           
[1] P webextensions.manifest                                                      
[2] F webextensions.match_patterns                                                
                                                                                  
F = Feature, P = Parent branch, B = Branch (not a feature, no direct sub-features)

```
Note: the actual letters used depends on the language used fore the user interface (see option
`--lang` and `--set` for details on how to set a user interface language).

- "F" here means the end branch represents a *feature*. It may or may not have sub-features.
- "P" means it's a parent branch to features or other branches
- "B" is just a branch but does not have direct features attached to it (just other branches).

There are currently 3 special status "paths":

    standard, experimental and deprecated

Using these will list features based on their status instead:

    mdncomp -l experimental

For very long results you can add additional filter arguments which only affects
the result:

    mdncomp -l api window navigator

This lists features on the api branch which contains the word "window" and
"navigator".

-b, --browser [id|status]
-------------------------

This option lists release and status information for browsers (incl. Node.js and Thunderbird).

Using no argument (or optionally `?` or `.`  as argument) will list all the currently valid browser IDs:
```text
mdncomp --browser .

Valid browser identifiers:
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

```

Then chose an ID to obtain information about it:
```text
mdncomp -b edge

Edge  12   2015-07-28  retired  https://docs.microso...
Edge  13   2015-11-12  retired  https://docs.microso...
Edge  14   2016-08-02  retired  https://docs.microso...
Edge  15   2017-04-05  retired  https://docs.microso...
Edge  16   2017-10-17  retired  https://docs.microso...
Edge  17   2018-04-30  current  https://docs.microso...                      
Edge  18   -           nightly
```

To not show the release links combine with the option `-N, --no-notes` (note that
`N` must come before `b` in this case as `b` requires the argument):

    mdncomp -Nb edge

You can get a list of browser bases on status as argument instead of a browser ID.
The following status keywords are supported:

```text
beta, current, esr, nightly, planned, retired
```

To list current active browsers then, use (here with the optional `--no-notes` option):

```text
mdncomp --browser current --no-notes

STATUS: CURRENT

Chrome              68           2018-07-24
Edge                17           2018-04-30
Edge Mobile         17           2018-04-30
Firefox             61           2018-06-26
Firefox Android     61           2018-06-26
Internet Explorer   11           2013-10-17
Opera               53           2018-05-10
QQ Browser           8.2         2018-02-01
Safari              11.1         2018-04-12
iOS Safari          11.1         -
Samsung Internet     7.2         2018-03-07
UC Browser          12.5.0.1109  2018-05-04
Chinese UC Browser  11.9.6.976   2018-05-04

```

-i, --index &lt;index&gt;
-------------------------

When multiple results are listed they are assigned a index number in the
result list. To list one particular result from that list you use this option:

```text
$ mdncomp blob
[ 0] api.Blob
[ 1] api.Blob.Blob
[ 2] api.Blob.size
[ 3] api.Blob.type
[ 4] api.Blob.slice
[ 5] api.BlobBuilder
[ 6] api.BlobEvent
...
```

To list index 6, `api.BlobEvent` do:

    mdncomp blob -i 6

TIP: `--index` has a shorthand `-i` but also a special mode where a number as
argument is treated as index. For example, this example does the same as the above:

    mdncomp blob 6

-D, --no-desktop
----------------

Hide information about desktop browsers which is enabled by default.

In version 1 this was `-d`.

This option can be stored permanently using the `--set` option.

-M, --no-mobile
----------------

Hide information about mobile browsers which is enabled by default.

In version 1 this was `-m`.

This option can be stored permanently using the `--set` option.

-x, --ext
----------------

Show extended set of browsers that are less common, or in case of Node.js
and Thunderbird.

Note: Node.js will only show up when querying a feature in the `javascript` 
branch, while Thunderbird only show in the `webextensions` branch.

This option can be stored permanently using the `--set` option.

-R, --no-children
-----------------

In version 2 any children (or sub-features) are listed in the table below the
main feature. For example:

```text
mdncomp t2d
--X8--

DESKTOP                   |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari    
:-------------------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
CanvasRenderingContext2D !|    1     |    Y     |   1.5    |    9     |    9     |    2     
canvas                    |    Y     |    12    |    Y     |    Y     |    Y     |    Y     
currentTransform !        |    YF    |    Y     |    -°    |    -     |    -     |    -¹    
direction !               |    YF    |    ?     |    -     |    -     |    -     |    Y     
fillStyle                 |    Y     |    12    |    Y     |    Y     |    Y     |    Y     
filter !                  |    52    |    ?     |    49    |    -     |    -     |    -     
font                      |    Y     |    12    |   3.5    |    9     |    Y     |    Y     
...
```

Combining this option will only list the feature. This can keep result lists short.
See [Using.md](Using.md) for how you can filter long result lists.

```text
mdncomp t2d --no-children
--X8--

DESKTOP                   |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari    
:-------------------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
CanvasRenderingContext2D !|    1     |    Y     |   1.5    |    9     |    9     |    2     
                                                                                            
MOBILE                    |Chrome/A  |Edge/mob  |Firefox/A |Opera/A   |Safari/iOS|Webview/A 
:-------------------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
CanvasRenderingContext2D !|    Y     |    Y     |    ?     |    ?     |    ?     |    Y     
...
```

-c, --case-sensitive
--------------------
Do search using case-sensitive queries.

This option can be stored permanently using the `--set` option.

-z, --fuzzy
-----------
Search using a "fuzzy" search term. This simply mean expressing the search
term as sequence of contracted letters found, in sequence, in the path:

```text
mndcomp -z htcetblbq
```

will produce the result for `HTMLCanvasElement.toBlob.Image_quality`.

Since the letters are existing various places but in the same order:

**HT**ML**C**anvas**E**lement.**t**o**Bl**o**b**.Image_**q**uality

while

```text
mndcomp -z ahcb.
```

will produce the result for `HTMLCanvasElement.toBlob` since we also added a
stop-dot (see Using.md for details on this) at the end which means the path
branch will end in the last letter, here "b".

In version 2 a fuzzy search is automatically perform in a second pass if no
result was found in the first. The exception is when the search term is a
wildcard or regular expression term, or if the option `--deep` is used.

This option can be stored permanently using the `--set` option.

-d, --deep
----------
The option `--deep` allow you in addition to search in paths, also search in
summary descriptions, footnotes, alternative names, prefix and flags.

Note that depending on the search term(s) this may take significantly more time
to finish than a regular path based search.

-s, --shorthand
----------------
List a compacted table output with minimal of information.

For example:

```text
mdncomp blobbuilder -s

api.BlobBuilder  [DEPR]
https://developer.mozilla.org/docs/Web/API/BlobBuilder

Browsers:  |C  |E  |F  |IE |O  |S  |C/a|E/m|F/a|O/a|S/i|W/a
:----------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:
BlobBuilder|8* | Y |Y* |10*| - | - | ? | Y |Y* | - | - |3*

*) Some entries has notes
Use full format to see details

```

This option can be stored permanently using the `--set` option.

--desc
------

This option will show a summary description of the feature after the MDN link in 
the default long output format, but only if available (a note is displayed if not).

```text
mdncomp t2d --desc

api.CanvasRenderingContext2D
Experimental
https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D

To get an object of this interface, call getContext() on a <canvas> element,
supplying "2d" as the argument:

DESKTOP                   |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari
---X8---
```

This option can be stored permanently using the `--set` option.

--specs
-------

Show specification links and status, if available.

```text
mdncomp t2d --desc

api.CanvasRenderingContext2D
---X8---
DESKTOP                   |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari
---X8---

SPECS
HTML Living Standard [Living Standard]
https://html.spec.whatwg.org/multipage/scripting.html#2dcontext:canvasrenderingcontext2d

```

This option can be stored permanently using the `--set` option.

--sub <index>
-------------

Some table results includes special metadata branches, or API specific sub-features which is not
a feature of its own, but has an description such as "Available in Workers", "SharedArrayBuffer accepted 
as buffer" and so on.

Normally most of the information is shown on the same line but it may occur in some cases that these has
flags and notes. To inspect these you can use this option to indicate which sub-feature you will inspect.

For example:
```text
mdncomp dataview

---X8---
DESKTOP          |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari    
:----------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
DataView         |    9     |    12    |    15    |    10    |   12.1   |   5.1    
Sub-feature 0    |    Y     |    Y     |    40    |    -     |    Y     |    ?     
Sub-feature 1    |    60    |    ?     |    55    |    ?     |    ?     |    ?     
buffer           |    9     |    12    |    15    |    10    |   12.1   |   5.1    
byteLength       |    9     |    12    |    15    |    10    |   12.1   |   5.1    
---X8---

SUB-FEATURES
0) DataView() without new throws
1) SharedArrayBuffer accepted as buffer

```

Here there are two sub-feature as we can see at the bottom. Simply add the option with an index
to include it in the result:

    mdncomp dataview --sub 1

-N, --no-notes
--------------

Don't list footnotes with the information. A browser will still be marked
having footnotes but with a generic astrix symbol instead.

For the [--browser](./Options.md#-b-browser) option the links will not be shown.

This option can be stored permanently using the `--set` option.

-F, --no-flags
--------------
hide flag section in the result, if any.

This option can be stored permanently using the `--set` option.
                                                            
-y, --history
-------------
Show a detailed version history section.

This option can be stored permanently using the `--set` option.
                           
-O, --no-obsolete
-----------------
Hide obsolete, non-standard and deprecated child features.

This option can be stored permanently using the `--set` option.
          
-u, --columns &lt;cols&gt;
--------------------------
Define custom columns using valid browser IDs (see option `--browser` for IDs). This is useful
when you only want to check or compare certain browsers.

Example, this will only show result for the browsers "Edge", "Chrome" and "Firefox":

```text
mdncomp html*toblob --columns edge,chrome,firefox

---X8---
DESKTOP          |Chrome    |Edge      |Firefox
:----------------|:--------:|:--------:|:--------:
toBlob           |    50    |    -     |    19
Sub-feature 0    |    50    |    -     |    25
---X8---

```

You can separate the browsers using column (":"), semi-column (";") and space, the latter
requires quotes:

    mdncomp --columns edge,chrome,firefox ...
    mdncomp --columns edge;chrome;firefox ...
    mdncomp --columns edge:chrome:firefox ...
    mdncomp --columns "edge chrome firefox" ...
 
Browsers in different sections (desktop, mobile, extended) are automatically sectioned.
The browser names are also being sorted.

This option can be stored permanently using the `--set` option.

--random
--------

This option is for pure exploration and discovery.

Simply run it standalone:

    mdncomp --random
    
and a random feature is shown. Combine it with a description:

    mdncomp --random --desc

to only show features that has one.

You can also limit the scope, say you want to show random features that contains
"audio" in it:

    mdncomp --random --desc audio

You can combine other options such as `--fuzzy` if you'd like to use a fuzzy term
to define the scope.
 
                           
--no-colors
-----------

Turns off ANSI colors in the terminal.

Note that in some cases ANSI codes will still be outputted such as with
progress bars (as during data updates).
 
This option can be stored permanently using the `--set` option.
                                          
--max-chars &lt;width&gt;
-------------------------
Set max number of characters on a (textual) line. Default is 84 but if you
prefer longer lines this can be set here. "-1" means no limit.

Note that width is ignored for *links*.

This option can be stored permanently using the `--set` option.
                 
-G, --no-config
---------------
Ignores the config file if any. As the config file will override options
this option will allow bypassing those overrides.

--set &lt;kv&gt;
----------------
Set key/value for config file. Use "?" as value to list valid keys.

For example, to always show a description in the result:

    mdncomp --set desc=true

Tip: You can also use 0 and 1 for boolean values.

Next time you run mdncomp a description is shown (if any) without having to
specify the `--desc` option.

There may be times you don't want permanent options from the config file to be applied.
You can suspend the use of the config file using the `-G, --no-config` option.

To see where the config file is located, use the option `--configpath`.
            
--configpath
------------

Show the path to the root folder used to store the optional config file.
                            
--expert [level]
----------------
Set "expert mode" which enable you to disable hints and legends in the result.

- Level 0 (default) shows all hints and legends
- Level 1 will hide usage hints, but shows legends
- Level 2 will hide both usage hints as well as legends.

This option can be stored permanently using the `--set` option.
                              
--lang &lt;isocode&gt;
----------------------
Language code for UI and descriptions. Use "?" for list valid languages.

This option will let you show the user interface and messages in one of the
preferred languages included with mdncomp.

For example, to show the user-interface in Spanish:

    mdncomp --lang es ... 

Currently the data itself is not available in other languages than English.
This may change in the future as these projects evolve.

This option can be stored permanently using the `--set` option.

--update
--------
Update data from remote location if any new data or data patches are available.

The update mechanism will first try to find a patch file for your current data
and the newest and download that. If none is found the full compressed dataset
is download instead.

Currently, the data is downloaded and stored inside the mdncomp installation
directory in a sub-folder "data". This may change in the future.

The update mechanism has built-in redundancy. If the main server is down a
second backup server will be used instead. The data is synchronized between the
two servers.

--fupdate
---------

Force update will download the full compressed dataset from the remote location.
                              
The update mechanism has built-in redundancy. If the main server is down a
second backup server will be used instead. The data is synchronized between the
two servers.

Note that this option is used automatically when mdncomp is installed, updated 
or reinstalled.

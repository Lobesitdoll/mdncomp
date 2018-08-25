`mdncomp` is designed for easy of use. The main purpose of `mdncomp` is to find
and display compatibility information for specific feature in browsers.

There are several ways to locate features:

- Using a simple search term
- Using a wildcard expression
- Using a fuzzy term
- Using regular expressions
- Using an absolute path
- Or even get a randomly picked feature for the purpose of exploring

`mdncomp` will in addition supply information about browsers themselves via the
`--b, -browser` option to see release history, statuses and notes for each browser,
version and status.

Direct Results
--------------

Direct results are when a search term has only one result and shows it right away.

Example:

    mdncomp dataview

Results in:

```text
javascript.builtins.DataView
On Standard Track
https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView

DESKTOP          |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari
:----------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
DataView         |    9     |    12    |    15    |    10    |   12.1   |   5.1
Sub-feature 0    |    Y     |    Y     |    40    |    -     |    Y     |    ?
Sub-feature 1    |    60    |    ?     |    55    |    ?     |    ?     |    ?
buffer           |    9     |    12    |    15    |    10    |   12.1   |   5.1
byteLength       |    9     |    12    |    15    |    10    |   12.1   |   5.1
byteOffset       |    9     |    12    |    15    |    10    |   12.1   |   5.1
getFloat32       |    9     |    12    |    15    |    10    |   12.1   |   5.1
getFloat64       |    9     |    12    |    15    |    10    |   12.1   |   5.1
getInt16         |    9     |    12    |    15    |    10    |   12.1   |   5.1
getInt32         |    9     |    12    |    15    |    10    |   12.1   |   5.1
getInt8          |    9     |    12    |    15    |    10    |   12.1   |   5.1
getUint16        |    9     |    12    |    15    |    10    |   12.1   |   5.1
getUint32        |    9     |    12    |    15    |    10    |   12.1   |   5.1
getUint8         |    9     |    12    |    15    |    10    |   12.1   |   5.1
setFloat32       |    9     |    12    |    15    |    10    |   12.1   |   5.1
setFloat64       |    9     |    12    |    15    |    10    |   12.1   |   5.1
setInt16         |    9     |    12    |    15    |    10    |   12.1   |   5.1
setInt32         |    9     |    12    |    15    |    10    |   12.1   |   5.1
setInt8          |    9     |    12    |    15    |    10    |   12.1   |   5.1
setUint16        |    9     |    12    |    15    |    10    |   12.1   |   5.1
setUint32        |    9     |    12    |    15    |    10    |   12.1   |   5.1
setUint8         |    9     |    12    |    15    |    10    |   12.1   |   5.1
prototype        |    9     |    12    |    15    |    10    |   12.1   |   5.1

MOBILE           |Chrome/A  |Edge/mob  |Firefox/A |Opera/A   |Safari/iOS|Webview/A
:----------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
DataView         |    Y     |    Y     |    15    |    12    |   4.2    |    4
Sub-feature 0    |    ?     |    ?     |    40    |    ?     |    ?     |    ?
---X8---

SUB-FEATURES
0) DataView() without new throws
1) SharedArrayBuffer accepted as buffer

Use option --desc to get a short description of the feature.
Use option --specs to see specifications.
Add additional search terms to filter result list.

Data from MDN - "npm i -g mdncomp" (c) epistemex

```

Here we get a lot of details about the feature itself, but also its sub-features
and separate details for desktop and mobile browsers. If we wanted to see support
in other browsers like Samsung internet, Node.js (in case of JavaScript features)
and so forth, we could add the option `-x, --ext` to the command line.

We can also limit data using switches.

Say we're only interested in the feature itself, not the sub-features. We can then
add the option `-R, --no-children`:

    mdncomp dataview -R

This gives us much less details:

```text

javascript.builtins.DataView
On Standard Track
https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView

DESKTOP          |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari
:----------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
DataView         |    9     |    12    |    15    |    10    |   12.1   |   5.1

MOBILE           |Chrome/A  |Edge/mob  |Firefox/A |Opera/A   |Safari/iOS|Webview/A
:----------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
DataView         |    Y     |    Y     |    15    |    12    |   4.2    |    4

Use option --desc to get a short description of the feature.
Use option --specs to see specifications.

Data from MDN - "npm i -g mdncomp" (c) epistemex

```

and if we're only interested in mobile browsers we could disable desktop using
the option `-D, --no-desktop` (please notice capital "D").

    mdncomp dataview -R -D

or as 

    mdncomp dataview -RD

```text

javascript.builtins.DataView
On Standard Track
https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView

MOBILE           |Chrome/A  |Edge/mob  |Firefox/A |Opera/A   |Safari/iOS|Webview/A
:----------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
DataView         |    Y     |    Y     |    15    |    12    |   4.2    |    4

Use option --desc to get a short description of the feature.
Use option --specs to see specifications.

Data from MDN - "npm i -g mdncomp" (c) epistemex

```

Filtering Result
----------------

If we go back to the first example:

    mdncomp dataview

we can instead of outputting the entire list of sub-features also filter the
ones we would be interested in by adding additional search terms behind the
main one.

For example, if we're only interested in "int32" sub-features we simply add that:

    mdncomp dataview int32

```text
---X8---
DESKTOP          |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari
:----------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
DataView         |    9     |    12    |    15    |    10    |   12.1   |   5.1
getInt32         |    9     |    12    |    15    |    10    |   12.1   |   5.1
getUint32        |    9     |    12    |    15    |    10    |   12.1   |   5.1
setInt32         |    9     |    12    |    15    |    10    |   12.1   |   5.1
setUint32        |    9     |    12    |    15    |    10    |   12.1   |   5.1
---X8---
```

or if we want to see both "int32" and "float32":

    mdncomp dataview int32 f*32

Notice you can use wildcards, regular expressions and also fuzzy terms here adding
the option `-z, --fuzzy`.

Notice that additional terms are used as **OR** terms, not AND.

Multiple Results
----------------

For many search terms we need to expect to receive multiple results. We can deal
with these in various way.

For example:

    mdncomp blob
    
currently gives us the following result:

```text
[0] api.Blob
[1] api.BlobBuilder
[2] api.BlobEvent
[3] api.Body.blob
[4] api.HTMLCanvasElement.toBlob
[5] api.OffscreenCanvas.toBlob
[6] api.PushMessageData.blob
[7] api.XMLHttpRequest.responseType.blob
[8] api.XMLHttpRequest.responseType.moz-blob

Add option '-i <n>' to list a specific feature using the same search.

```

We can now simply add the index of the line we want to inspect in one of the following ways,
say we want to check the `toBlob` for the `HTMLCanvasElement`.

    mdncomp blob 4
    mdncomp blob -i 4
    mdncomp blob --index 4

Tip: The first example is a shortcut version of index that can be used with all results 
that has a indexed list as result. This allow for applying next step quickly.

We can also use more specific search terms using wildcards:

    mdncomp html*blob

or fuzzy terms:

    mdncomp ahcb.

Notice that we didn't specify the option `-z, --fuzzy` here. If the search term by itself
doesn't produce any results a second attempt is invoked using fuzzy mode. This only applies
if we're not using wildcards or regular expressions, or the option `-d, --deep`. If you
want to use fuzzy term from the get go, then specify this option as well so it only searches
one time.

We can also use a absolute path if we already know it (and care to write the whole path or
at least enough of it so it becomes unique; in this case we could have gotten away with writing
`api.HTMLCanvasElement.tob`):

    mdncomp api.HTMLCanvasElement.toBlob
    mdncomp api.HTMLCanvasElement.tob

All these terms are by default case-insensitive. We can further refine by indicating that
our term is case-sensitive using the option `-c, --case-sensitive`.

**Regular Expressions (RegExp)**

And lastly, we can use regular expressions by indicating this providing an expression
with forward slashes:

    mdncomp /\blet\b/

this term will use word bounded (\b) "let" and finds:

    javascript.statements.let

You *can* also add RegExp options to the term, say if you want it to be case-insensitive (as an
example as it's already case-insensitive by default and very useful here):

    mdncomp /\blet\b/i

**IMPORTANT**: If you use pipe chars ("|", i.e. OR) in the regular expression you *need* to
enclose the expression in *quotes*. Otherwise it will be interpreted as a pipe
operation in the CLI which can potentially have undesired consequences.

    mdncomp "/audio|process|worklet/"

An error message is displayed in the RegExp is invalid.

Tip: If you're not familiar with regular expressions (or RegExp) there are many great
resources online that will introduce and can teach you how to use this powerful
concept.


Searching Numbers
-----------------

If you for some reason need to search for a specific number, you can enclose it in wildcards
or provide it as a regular expression (ref. shorthand `-i, --index` mentioned earlier):

    mdncomp *32*
    mdncomp /32/


Looking Deeper
--------------

There are cases where the opposite is true, we get no result, or we would
like to find features with special properties or description, flags etc.

For this the option `-d, --deep` is provided. This let us do search in summary descriptions,
footnotes, flags, prefix and alternative names, in current and historic data.

So, say we can't remember a special feature that uses "whitelist" in order to work.

Using a regular search like this:

    mdncomp whitelist

Gives us no result. However, doing a deep search:

    mdncomp whitelist --deep
    mdncomp -d whitelist

gives us:

```text
[ 0] api.HTMLVideoElement.getVideoPlaybackQuality
[ 1] api.MediaSource
[ 2] api.MediaSource.MediaSource
[ 3] api.MediaSource.sourceBuffers
[ 4] api.MediaSource.activeSourceBuffers
[ 5] api.MediaSource.readyState
---X8---
[37] api.VideoPlaybackQuality
[38] api.VideoPlaybackQuality.creationTime
[39] api.VideoPlaybackQuality.droppedVideoFrames
[40] api.VideoPlaybackQuality.corruptedVideoFrames
[41] api.VideoPlaybackQuality.totalVideoFrames
[42] api.VideoPlaybackQuality.totalFrameDelay
```  

Searching By Status
-------------------

If we want to see for example feature that has been deprecated or are experimental,
we can use the `-l, --list` option.

The option will on its own provide us with a way to find features by path, but it
can also be used to list API paths based on their current status.

    mdncomp -l experimental
 
 outputs:
 
 ```text
 
[   0] api.AbortController
[   1] api.AbortController.AbortController
[   2] api.AbortController.abort
[   3] api.AbortController.signal
[   4] api.AbortPaymentEvent
[   5] api.AbortPaymentEvent.AbortPaymentEvent
---X8---
[2139] svg.elements.hatchpath
[2140] svg.elements.solidcolor
[2141] svg.elements.textPath.path
[2142] svg.elements.textPath.side
 ```

That gave us more than 2000 entries, which is a bit much right, so also here we can add additional
search terms, one or several, to be more specific:

    mdncomp -l experimental hitregion
 
 This outputs a more edible list:
 
 ```text
 
[0] api.CanvasRenderingContext2D.addHitRegion
[1] api.CanvasRenderingContext2D.addHitRegion.control
[2] api.CanvasRenderingContext2D.addHitRegion.fillRule
[3] api.CanvasRenderingContext2D.addHitRegion.id
[4] api.CanvasRenderingContext2D.addHitRegion.other_hit_region_options
[5] api.CanvasRenderingContext2D.addHitRegion.path
[6] api.CanvasRenderingContext2D.clearHitRegions
[7] api.CanvasRenderingContext2D.removeHitRegion

 ```

Now simply add the index number to the command line to inspect:

    mdncomp -l experimental hitregion 0

Browsers
--------

`mdncomp` provides a lot of useful information for browsers as well. Such as
current and beta versions for each, release notes and so forth.

We can first get a list of valid browser IDs. This btw. are the same IDs you
would use with the `-u, --columns` option.

    mdncomp -b current 

Result:

```text

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

Now we can see release history for a browser by using the browser ID as argument:

    mdncomp -b edge 

Result:

```text

Edge  12   2015-07-28  retired  https://docs.microsoft.com/en-us/mic...
Edge  13   2015-11-12  retired  https://docs.microsoft.com/en-us/mic...
Edge  14   2016-08-02  retired  https://docs.microsoft.com/en-us/mic...
Edge  15   2017-04-05  retired  https://docs.microsoft.com/en-us/mic...
Edge  16   2017-10-17  retired  https://docs.microsoft.com/en-us/mic...
Edge  17   2018-04-30  current  https://docs.microsoft.com/en-us/mic...
Edge  18   -           nightly

```

Here we current version of the Edge browser, potentially when next release will
happen and which versions are retired as well as release notes for the versions.

Tip: You can disable the links by using the option `-N, --no-notes`.

If we want to see the current status for all the supported browsers we could use
a status keyword instead:

    mdncomp -b current 

Result:

```text

STATUS: CURRENT

Chrome              68           2018-07-24  https://chromereleases.goo...
Edge                17           2018-04-30  https://docs.microsoft.com...
Edge Mobile         17           2018-04-30
Firefox             61           2018-06-26  https://developer.mozilla....
Firefox Android     61           2018-06-26  https://developer.mozilla....
Internet Explorer   11           2013-10-17
Opera               53           2018-05-10  https://dev.opera.com/blog...
QQ Browser           8.2         2018-02-01
Safari              11.1         2018-04-12  https://developer.apple.co...
iOS Safari          11.1         -
Samsung Internet     7.2         2018-03-07
UC Browser          12.5.0.1109  2018-05-04
Chinese UC Browser  11.9.6.976   2018-05-04

```

And the same goes for when we want to see beta or nightly versions and so forth.


Saving Data To File
-------------------

If you want to save the output to file simply redirect the content to a file
and use the option `--no-colors` to remove ANSI color sequences:

    mdncomp blobuilder --no-colors > blob-builder.txt

If we *do* want to keep the ANSI codes:

    mdncomp blobuilder > blob-builder.ansi

Documentation
-------------

The dataset for `mdncomp` adds some metadata that is not found in the original BCD dataset,
such as summary descriptions and specifications.

These are short extra information that can be very useful in many cases where you want
to know a little more about the feature, or check the official specification documents
for updates and statuses.

To get a summary description you simply add the `--desc` option. If one exists it will
be displayed. A note is displayed instead if one does not exist:

    $ mdncomp ht*toblob --desc

To get a section showing various specifications where this feature is defined,
add the option `--specs` :

    $ mdncomp ht*toblob --specs

These can of course be combined and set permanently via the option `--set`.

Global Configuration
--------------------
 
If you find yourself using options very frequently you could consider setting
them permanently in a config file and instead suspend the config from time to
time when you're not.

In v2 there is a new strategy to setting options in the config file. Instead of
manually creating and editing one, the new option `--set` will do all this for you.

Use the option with "?" to see which keys can be used. Setting and clearing an
option is very easy.

If you for example always want to see a description you can do:

    mdncomp --set desc=true

(you can use 0 and 1 as boolean as well).

If you then want to suspend the config file you can run with the option `-G, --no-config`:

    mdncomp -G ...

or clear the option all together if you change your mind:

    mdncomp --set desc=
    mdncomp --set desc

(tip: the equal sign is not required to clear a setting).

Localization and Languages
--------------------------

`mdncomp` v2 comes with localizable user interface, and hopefully in time more localized
content as well.

For now there are some languages included, but more languages can be user provided (see
the [locale/](../locale/) folder for details).

To show options, tables, headers and messages in your language you would use the
option `--lang` with an short ISO code for the language. You can use "?" as argument
to see which languages are currently supported.

So, if you want to see the output in Spanish you would use:

    mdncomp --lang=es ...

However, this option makes more sense together with the `--set` option so that every
time you run `mdncomp` you won't have to add this option:

    mdncomp --set lang=es
 
Now the output will be in Spanish.
 
For languages that doesn't exist an error message is displayed. English is used
as the default language. 


Keeping Things Up-To-Date
-------------------------

**Regular updates**

The dataset is constantly improving and adding more details, corrections and features
by the Mozilla MDN team.

To stay up-to-date you should at least once a week run the option `--update`.

    mdncomp --update

The update mechanism will first try to find a patch file for your current data
and the newest and download that. If none is found the full compressed dataset
is download instead.

The update mechanism has built-in redundancy. If the main server is down a
second backup server will be used instead. The data is synchronized between the
two servers.

**Forced updates**

If you suspect a patching failed, or the dataset has been corrupted, you can
force download a full complete dataset using the `--fupdate` option instead:

    mdncomp --fupdate

This is the same command that is run when installing or updating `mdncomp`
via NPM.

The `mdncomp` version of the dataset will only include *validated* URLs to
MDN documentation. These are shown with results, and in many terminals you
can click or CTRL+click these links directly.

The`mdncomp` version of the dataset also has included summary description of
most features.

**Other updates**

You can normally check NPM for updates of the program itself. This is not a good
way to update the *dataset* though as there is no regular releases here. The
NPM version is only used for bug fixes, new features etc. Use the `--update`
option if the intent is updating the data only. 

Consider also to check the git repo at [GitLab](https://gitlab.com/epistemex/mdncomp)
from time to time for important changes, updates, messages and so forth.

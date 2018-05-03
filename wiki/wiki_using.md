`mdncomp` is designed to be easy to use.

To find information about an API you'll use `mdncomp` as a search tool, for example,
to find information about say `BlobBuilder` you would do:

```text
mdncomp blobbuilder
```

And that's pretty much it in this case.

In cases where you can have APIs and paths containing the keyword, for example,
`blob` would instead give us a list:

```text
[ 0] api.Blob
[ 1] api.Blob.Blob
[ 2] api.Blob.size
... etc.
[11] api.HTMLCanvasElement.toBlob
[12] api.HTMLCanvasElement.toBlob.Image_quality
[13] api.OffscreenCanvas.toBlob
[14] api.PushMessageData.blob
```

We have several options here:

- Be more specific using wildcards:

```text
mdncomp blob*qual
```

will only give us information for `api.HTMLCanvasElement.toBlob.Image_quality`.

- Or we can use the index to show a single result:

```text
mdncomp blob -i 11
```
 which will show information for `api.HTMLCanvasElement.toBlob`

- In this case we could use an absolute path:

```text
mdncomp api.HTMLCanvasElement.toBlob.image_quality
```

- Or we could simply list information for all of the APIs using the [`-a, --all` option](https://github.com/epistemex/mdncomp/wiki/Options-for-mdncomp#-a---all):

```text
mdncomp blob -a
```

In the latter case you may risk getting a lot of information in a very long page.
For these cases, or when you just want a quick glimpse on the details, you can
use the [`-s, --shorthand`](https://github.com/epistemex/mdncomp/wiki/Options-for-mdncomp#-s---shorthand) option:

```text
mdncomp blob -as
```

**Regular Expressions**

mdncomp can take a regular expression (regex) as path. To indicate a regex you will always
start and end the expression with forward-slash and optionally add flags at
the very end.

Depending on the expression, OS and terminal, you may have to
put the expression in quotes.

```text
mdncomp /blob/
mdncomp /blob/gi
```

Another simple example: list all objects that contains the words ".panner",
and ".analyser" in the path starting with a dot to reduce the
result list:

```text
$ mdncomp "/\.Panner|\.Analyse/gi"
[ 0] api.AnalyserNode
[ 1] api.AnalyserNode.AnalyserNode
[ 2] api.AnalyserNode.frequencyBinCount
[ 3] api.AnalyserNode.maxDecibels
[ 4] api.AnalyserNode.getFloatFrequencyData
[ 5] api.AnalyserNode.getFloatTimeDomainData
[ 6] api.PannerNode
[ 7] api.PannerNode.PannerNode
[ 8] api.PannerNode.coneOuterAngle
[ 9] api.PannerNode.distanceModel
[10] api.PannerNode.orientationX
[11] api.PannerNode.orientationZ
[12] api.PannerNode.positionX
[13] api.PannerNode.positionZ
[14] api.PannerNode.rolloffFactor
[15] api.PannerNode.setPosition
```

An error will be displayed if the regex is invalid.

**Special cases to consider:**

If we wanted to list information for just `Blob` you will notice, even using an absolute path,
that we still get multiple results. This is because `Blob` is also a branch in this case.

What we can do in these cases is to add a *period* to the keyword like this:

```text
mdncomp api.blob.
```

or using wildcards:

```text
mdncomp html*toblob.
```

or using fuzzy terms (add option [`--fuzzy` or `-z`](https://github.com/epistemex/mdncomp/wiki/Options-for-mdncomp#-z---fuzzy)):

```text
mdncomp -z hctblb.
-> will find HTMLCanvasElement.toBlob
```

This will block any child objects to be traversed.

Saving data to file
-------------------

We can also output the information to files instead of to the console.

Simply add the option [`-o, --out`](https://github.com/epistemex/mdncomp/wiki/Options-for-mdncomp#-o---out-):

```text
mdncomp blobuilder -o blob-builder.txt
```

Here we'll end up with a plain text file. If we wanted ANSI codes we could use:

```text
mdncomp blobuilder -o blob-builder.ansi
```

Using --list
------------
List can be powerful in two ways: it can navigate by branches which will give you a quick overview
of all the content in each API branch, and two: it can provide lists with status such as deprecated,
experimental, standard as well as list object that misses documentation links.

To get top-level use a dot:

```text
mdncomp --list .
-->
api
css
html
http
javascript
svg
webdriver
webextensions
```

Now we can list content in for example the javascript branch:

```text
mdncomp --list javascript
-->
javascript.builtins
javascript.classes
javascript.functions
javascript.grammar
javascript.operators
javascript.statements
```

And we can continue, say we want to list all objects on the builtins branch:

```text
mdncomp --list javascript.builtins
-->
javascript.builtins
javascript.builtins.Array
javascript.builtins.ArrayBuffer
javascript.builtins.AsyncFunction
javascript.builtins.Atomics
javascript.builtins.Boolean
javascript.builtins.DataView
javascript.builtins.Date
--X8--
```

and so on. We can use a full path to get status for that item if is itself a feature -
we'll add a dot since we know Array have many features attached to it. The dot will block
these as we mentioned earlier and only list the parent:

```text
mdncomp javascript.builtins.Array.
```

We can also list features that are for example deprecated:

```text
mdncomp -l deprecated
-->
api.AudioListener
api.AudioProcessingEvent
api.BatteryManager
api.BlobBuilder
api.FileError
--X8--
```

and so on.

Browser release status
----------------------
mdncomp will also list status of a browser, or all of a certain status using the
[`-b, --browser`](https://github.com/epistemex/mdncomp/wiki/Options-for-mdncomp#-b---browser) option.

To list supported browser names you can use a single dot:

```text
mdncomp -b .
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

Valid statuses:
beta, current, esr, nightly, planned, retired
```

You can see at the bottom that you can also list browsers by status. If you want
to list all current versions of browsers:

```text
mdncomp -b current
->
STATUS: CURRENT
chrome                   66           2018-04-17
edge                     16           2017-10-17
edge                     17           2018-05-01
edge_mobile              16           2017-09-26
edge_mobile              17           2018-05-01
firefox                  59           2018-03-13  https://developer.mozilla.org/Firefox/Releases/59
firefox_android          59           2018-03-13  https://developer.mozilla.org/Firefox/Releases/59
ie                       11           2013-10-17
nodejs                    6           2016-04-26  https://nodejs.org/en/blog/release/v6.0.0/
nodejs                    8           2017-05-30  https://nodejs.org/en/blog/release/v8.0.0/
nodejs                   10           2018-04-24  https://nodejs.org/en/blog/release/v10.0.0/
opera                    52           2018-03-22  https://dev.opera.com/blog/opera-52/
qq_android                8.2         2018-02-01
safari                   11.1         2018-04-12  https://developer.apple.com/library/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_11_1.html
safari_ios               11.1         -
samsunginternet_android   6.4         2018-02-19
uc_android               12.0.0.1088  2018-01-30
uc_android               12.2.0.1089  2018-03-09
uc_chinese_android       11.8.8.968   2018-02-06
uc_chinese_android       11.9.2.972   2018-03-21
```

If you want to show current, future and old released of a particular browser:

```text
mdncomp -b edge
->
edge  12  2015-07-28  retired
edge  13  2015-11-12  retired
edge  14  2016-08-02  retired
edge  15  2017-04-05  retired
edge  16  2017-10-17  current
edge  17  2018-05-01  current
edge  18  -           nightly
```

Documentation
-------------
mdncomp can also show short descriptions for a feature as well as a MDN doc entry,
all directly on the command line.

    $ mdncomp ht*toblob. --desc

Short descriptions are now part of the data file itself, while doc excerpts are
downloaded and cached. The latter can be updated at any time:

    $ mdncomp ht*toblob. --doc       # download and cache
    $ mdncomp ht*toblob. --docforce  # force update

You can also get links to specifications by using the [--specs](https://github.com/epistemex/mdncomp/wiki/Options-for-mdncomp#--specs) option:

    $ mdncomp ht*toblob. --specs     # show links to specification (if available)

Combining this with the option --random can allow to explore less known APIs
and features:

    $ mdncomp --random .             # show status for any feature
    $ mdncomp --random --doc .       # from any feature with documentation link
    $ mdncomp --random --desc audio  # short desc. for any feat. incl. "audio"


Testing
-------

For testing documentation links on MDN, see the tool [mdn-linkchecker](https://github.com/epistemex/mdn-linkchecker).

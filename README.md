mdncomp v2
=========

![Announcement](https://i.imgur.com/thxTAqD.png?1) Announcement
===

***Next Generation mdncomp (v2) is currently being built - 
[have your say](https://github.com/epistemex/mdncomp/issues/8) about features you would like to see.***  
<hr>

Show [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data) on the command line.

    $ mdncomp html*toblob

![xterm color + languages output](https://i.imgur.com/hSbng4R.gif)<br>
<sup>*cygwin/xterm snapshot (English, Spanish, Norwegian)*</sup>

Features
--------

New main core with improved search algorithm to get you faster and more flexible
to the compatibility data.

- Browser Compatibility Data (BCD from Mozilla Developer Network)
  - Search **API**, **CSS**, **HTML**, **HTTP**, **JavaScript**, **MathML**, **SVG**,
   **WebDriver** and **WebExtensions**.
  - Search and list features using paths, wildcards, fuzzy terms or regular expressions
  - Search case (in)sensitive
  - Navigate by path and branches
  - Shows data on the command line as a ANSI colored ASCII formatted table
  - Lists children features
  - Get feature status (standard, experimental or deprecated).
  - Show notes, flags, vendor prefix, history and security issues.
  - Show additional links for information in notes
  - Show optional detailed Web Worker support for a feature
  - Show optional detailed SharedArrayBuffer support for a feature
  - Show information for desktop, mobile and other browsers.
  - Show information for Node.js where relevant.
  - All data available offline (only --*update require a internet connection)

- Browser status
  - List **current** browser versions
  - List current, esr, beta, nightly, planned and retired versions *per browser*.
  - List current, esr, beta, nightly, planned and retired versions *per status*.
  - List status and release dates per browser, including release notes (if available).

- Additional documentation:
  - Show title text per feature.
  - Show a summary **description** per feature *(included in the dataset for mdncomp only)*.
  - Provides a *verified* URL to the feature's documentation page on [MDN](https://developer.mozilla.org/).
  - Show standards/specification references, status and links (W3C, WHATWG, KHRONOS, ECMA, IETF etc.)
   *(included in the dataset for mdncomp only)*.

- Integrated update mechanism
  - Lighting fast update process
  - Updates with patch files (RFC 6902 / 6901) with support for several versions back.
  - Optional forced data update to reinitialize with a full clean data set, f.ex. with data corruption.
  - Compressed data transfers

- Define permanent/often used options in a config file (which can be suspended via option).
- Built-in help per option.
- Documented with [wiki](https://gitlab.com/epistemex/mdncomp/wikis/home) pages (todo for v2)
- Locale/language support for user interface and descriptions (where available) (English, Spanish, Norwegian, ...)
- Cross-platform (where node and npm is available).

**Note to users of older version 1.x.x**: some options has been removed (and some added) to 
make the tool more focused and lightweight for what it is intended to do. Please see the 
[Change.log](./Change.log) for details. Also see announcement at the top of this file. 

Install
-------
Make sure to have [Node.js](https://nodejs.org/en/) and `npm` installed (included with node).

To install **current development** version (**ALPHA**):

    $ npm i -g mdncomp

To install the **latest stable version**, install `mdncomp` using:

    $ npm i -g mdncomp@1.23.0
    
These latest version includes a recent precompiled dataset. However, make sure to run mdncomp
with the option `--update` the first time to get the latest data. It's recommended that you run
this command weekly (data is usually updated every Thursday evening US time).


Examples
--------

Using wildcard:

```text
$ mdncomp html*toblob

api.HTMLCanvasElement.toBlob                                                       
On Standard Track                                                                  
https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob                
                                                                                   
DESKTOP          |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari    
:----------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
toBlob           |    50    |    -     |    19    |   10°    |    37    |    Y¹    
Image_quality    |    50    |    -     |    25    |    -     |    Y     |    -     
                                                                                   
MOBILE           |Chrome/A  |Edge/mob  |Firefox/A |Opera/A   |Safari/iOS|Webview/A 
:----------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
toBlob           |    50    |    -     |    4     |    37    |    -     |    50    
Image_quality    |    -     |    -     |    25    |    -     |    ?     |    50    
                                                                                   
NOTES                                                                              
°: Vendor prefix: ms                                                               
¹: See WebKit bug 71270. Ref link 1.                                               
                                                                                   
LINKS                                                                              
1: https://bugs.webkit.org/show_bug.cgi?id=71270
```

or using the absolute feature path (case-insensitive, see option `-c`):

    $ mdncomp api.HTMLCanvasElement.toBlob
    $ mdncomp api.htmlcanvaselement.toblob

or as an regular expression:

    $ mdncomp /.*html.*toblob/

or as an fuzzy expression:

    $ mdncomp -z ahcb.
    
From version 2 you can run without the `--fuzzy` option: if a result is not found 
using the regular search method, a fuzzy search with the same expression (unless 
the term contains astrix or starts with forward-slash) using the fuzzy method.

<h3>Show data in a compact shorthand format using option `-s, --shorthand`:</h3>

    $ mdncomp html*toblob -s

![Shorthand format](https://i.imgur.com/UbsfBNv.png)<br>
<sup>*cygwin/xterm snapshot*</sup>

You can now do a local filtering of the result by simply adding one or more keywords (or search-terms)
to the argument list. For example - this will only list child features containing "line" in the 
`CanvasRenderingContext2D` API:

```text
$ mdncomp t2d line

api.CanvasRenderingContext2D                                                                
Experimental                                                                                
https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D                         
                                                                                            
DESKTOP                   |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari    
:-------------------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
CanvasRenderingContext2D !|    1     |    Y     |   1.5    |    9     |    9     |    2     
lineCap                   |    Y     |    12    |    Y     |    Y     |    Y     |    Y     
lineDashOffset            |    Y     |    12    |    27    |    11    |    Y     |    Y     
lineJoin                  |    Y     |    12    |    Y     |    Y     |    Y     |    Y     
lineWidth                 |    Y     |    12    |    Y     |    Y     |    Y     |    Y     
textBaseline              |    Y     |    12    |   3.5    |    9     |    Y     |    Y     
createLinearGradient      |    Y     |    12    |    Y     |    Y     |    Y     |    Y     
getLineDash               |    Y     |    12    |    27    |    11    |    Y     |    Y     
lineTo                    |    Y     |    12    |    Y     |    Y     |    Y     |    Y     
scrollPathIntoView !      |    YF    |    ?     |    -     |    -     |    Y     |    -     
setLineDash               |    Y     |    12    |    27    |    11    |    Y     |    Y     
---8X---
! = Experimental
```

<h3>List results using Custom Columns</h3>

You can now define custom columns using a comma (or space, semi-column, column)
separated list with the new option "-u, --columns":

```text
mdncomp t2d path --columns "chrome,edge,firefox"
--8X--
DESKTOP                   |Chrome    |Edge      |Firefox   
:-------------------------|:--------:|:--------:|:--------:
CanvasRenderingContext2D !|    1     |    Y     |   1.5    
beginPath                 |    Y     |    12    |    Y     
closePath                 |    Y     |    12    |    Y     
isPointInPath             |    Y     |    12    |    Y     
--8X--
```

<h3>List feature branches and status</h3>

You can navigate using branches and dot notation to find where a feature resides.

To list root simply add the option `--list` (or shorthand `-l`) with no argument:

```text
mdncomp --list
->
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

List using one of the root branches:

```text
mdncomp --list api
->
[  0] F api.ANGLE_instanced_arrays
[  1] F api.AbortController
[  2] F api.AbortPaymentEvent
[  3] F api.AbortSignal
[  4] F api.AbstractWorker
[  5] F api.AmbientLightSensor
[  6] F api.AnalyserNode
[  7] F api.Animation
[  8] F api.AnimationEffect
[  9] F api.AnimationEvent
[ 10] F api.AnimationPlaybackEvent
[ 11] F api.AnimationTimeline
[ 12] F api.Attr
[ 13] F api.AudioBuffer
--8X--
```

You can go to next branch by adding the name of the branch, fully or partly (if unique):

    mdncomp --list api.audiobu

or simply by adding the index number in one of the following ways:

    mdncomp --list api --index 13
    mdncomp --list api -i 13
    mdncomp -l api 13

(this usage of index also applies to the regular search).

List per status, for example: list all features with "experimental" status:

```text
mdncomp -l experimental
->
[  0] api.AbortController
[  1] api.AbortPaymentEvent
[  2] api.AbortSignal
[  3] api.AmbientLightSensor
--8X--
```

<h3>List current browser versions:</h3>

```text
mdncomp --browser current
->
STATUS: CURRENT
Chrome              68   2018-07-24  https://chromereleases.googleblog.c...
Edge                17   2018-04-30  https://docs.microsoft.com/en-us/mi...
Edge Mobile         17   2018-04-30
Firefox             61   2018-06-26  https://developer.mozilla.org/Firef...
Firefox Android     61   2018-06-26  https://developer.mozilla.org/Firef...
Internet Explorer   11   2013-10-17
--8X--
```

Tip: You can combine the option with `--no-notes, -N` to not show the links at the end.

List release history for a single browser:
```text
mdncomp -Nb edge
->
Edge  12   2015-07-28  retired
Edge  13   2015-11-12  retired
Edge  14   2016-08-02  retired
Edge  15   2017-04-05  retired
Edge  16   2017-10-17  retired
Edge  17   2018-04-30  current
Edge  18   -           nightly
```

<h3>Rich output, here additionally using the --desc and --specs options:</h3>

    mdncomp sharedarraybuffer. --desc --specs
    
![Description and specifications summary example](https://i.imgur.com/aElwsBg.png)<br>
<sup>*cygwin snapshot*</sup>

<h3>Or as minimal, turning off extra information (here with options `-NRF`)</h3>

    # -R = no-children, -N = no-notes, -F = no-flags (also see --help, -h)
    
    mdncomp sharedarraybuffer. -RNF
    
![Minimalistic example](https://i.imgur.com/0LBDDrb.png)<br>
<sup>*cygwin snapshot*</sup>

Markdown enabled tables
-----------------------

The ASCII tabled can be pasted directly into a markdown documents and will show
as rendered HTML tables in markdown-flavors which support tables - **live preview:**

Desktop           |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari
:-----------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
HTMLCanvasElement |     4    |     Y    |    3.6   |     9    |    9°    |    3.1
height            |     4    |    12    |    3.6   |     9    |     9    |    3.1
mozOpaque         |     -    |     -    |    3.5   |     -    |     -    |     -
width             |     4    |    12    |    3.6   |     9    |     9    |    3.1
captureStream     |    51    |     ?    |    43    |     -    |    36    |     ?
getContext        |     Y    |    12    |    3.6   |     9    |     9    |    3.1
mozFetchAsStream  |     -    |     -    |   13-43  |     -    |     -    |     -
mozGetAsFile      |     -    |     -    |     4    |     -    |     -    |     -
toBlob            |    50    |     -    |    19    |    10    |    37    |     Y
toDataURL         |     4    |    12    |    3.6   |     9    |     9    |     4

And in compact shorthand format:

Browsers:    |C  |E  |F  |IE |O  |S  |ca |em |fa |oa |si |wa
:------------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:
toBlob       | 50| - | 19|10*| 37| Y*| 50| - | 4 | 37| - | 50
Image quality| 50| - | 25| - | Y | - | - | - | 25| - | ? | 50


Exploration
-----------
Feel like exploring? try:

    $ mdncomp --random

Or try combining the `--random` option with `--desc`:

    $ mdncomp --random --desc

You can also create a scope by providing a keyword or search term:

    $ mdncomp --random audio
    $ mdncomp --random abc --fuzzy --desc

Global Configuration
--------------------
Often used options can be permanently stored in a config file in the user's home
directory in JSON format.

To set or clear an option you can do:

    mdncomp --set lang=es
    mdncomp --set lang=en-us

A config file is created automatically if none exist.

To clear a setting from the config file use an empty value:

    mdncomp --set lang=
    mdncomp --set lang

To see a list of valid keys that can be used:

    mdncomp --set ?

You can also edit the config file directly. Use the option`--configpath` to get 
the location to the config folder.

Tip: You can as an alternative, define alias commands in some terminals with 
specific settings for different purposes.

Wiki
----

(**NOTE: TODO** Not yet updated for version 2.x.x).

See the [wiki pages](https://gitlab.com/epistemex/mdncomp/wikis/home) for more details on each options,
how to create a config file and for usage examples.

The wiki is also included as markdown files in the included [wiki folder](./wiki/Home.md).

Want to help the MDN Team?
--------------------------
The MDN team is working hard to convert all the Browser Compatibility Data to 
their new format as used by this and other tools. For this reason some APIs and 
objects are WIP and may still not be available quite yet.

[Click here to help them out](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Structures/Compatibility_tables).

Requirements
------------
- **Node v8** or newer (for older Node version use mdncomp version 1.23.0).
- NPM to install `mdncomp i -g mdncomp`
- Internet connection when updating (via the `--update` option)

Additional information
----------------------
Development IDE: JetBrains' [WebStorm](https://www.jetbrains.com/webstorm/).

Test environments: Windows 8.1+, Linux (Ubuntu) 

The software is provided AS-IS.

License
-------

[MIT License](https://choosealicense.com/licenses/mit/)

Copyright (c) 2018 Epistemex

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

![Epistemex](https://i.imgur.com/GP6Q3v8.png)

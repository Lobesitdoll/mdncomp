mdncomp v2
=========

Show [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data) on the command line.

![xterm color output](https://i.imgur.com/hsvEpWo.png)<br>
<sup>*cmder snapshot*</sup>

Features
--------

Rebuilt core with improved search algorithm to get you faster and more flexible
to the compatibility data.

- Browser Compatibility Data (BCD)
  - Search in APIs, CSS, HTML, HTTP, JavaScript, MathML, SVG, WebDriver and WebExtensions.
  - Shows data on command line as a table or as a shorthand list
  - Shows children features in same table (optional)
  - Get status for standard, experimental and deprecated features.
  - Show notes, vendor prefix, security issues, flags, history and more.
  - Show detailed Web Worker support for a feature
  - Show detailed SharedArrayBuffer as param support for a feature
  - Find features using paths, wildcards, fuzzy terms or regular expressions
  - Navigate by path and branches
  - Search case (in)sensitive
  - Show desktop and/or mobile information for the most common browsers.
  - Option to show extended set of browsers including Node.js.
  - Works offline (only --*update requires internet connection)

- Browser status
  - List current browser versions
  - List beta and nightly versions per browser
  - List status and release dates per browser
  - List browsers per status

- Additional documentation:
  - Show a summary description for each feature (included in the dataset).
  - Provides the URL to the feature's documentation page on [MDN](https://developer.mozilla.org/).
  - Specification references and status (W3C, WHATWG, KHRONOS, ECMA, IETF etc.)

- Integrated update mechanism (--update)
  - Compressed data transfers
  - Patch/diff (RFC-6902) support for several versions back
  - Force update to reinitialize/clean all data, or with data corruption
  
- Define permanent/often used options in a config file (which can be suspended at will).
- Built-in help per option.
- Documented with [wiki](https://gitlab.com/epistemex/mdncomp/wikis/home) pages
- Cross-platform (where node and npm is available).

**Note to users of older version 1.x.x**: some options has been removed (and some 
added) to make the tool more focused and lightweight for what it is intended to do.
Please see the [Change.log](./Change.log) for details.

Install
-------
Make sure to have [Node.js](https://nodejs.org/en/) and `npm` installed (included with node), then install `mdncomp` using:

    $ npm i -g mdncomp
    
If you prefer to stay with version 1 you can specify a tag:

    $ npm i -g mdncomp@1.23.0

This includes a precompiled dataset which can be updated at any time.


Examples
--------

Using wildcard:

```text
$ mdncomp html*toblob

HTMLCanvasElement.toBlob
On Standard Track
https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob

Desktop       |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari
:-------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
toBlob        |    50    |     -    |    19    |    10°   |    37    |    Y¹
Image quality |    50    |     -    |    25    |     -    |     Y    |     -

Mobile        |Chrome/A  |Edge/mob  |Firefox/A |Opera/A   |Safari/iOS|Webview/A 
:-------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
toBlob        |    50    |     -    |     4    |    37    |     -    |    50
Image quality |     -    |     -    |    25    |     -    |     ?    |    50

NOTES:
°: Vendor prefix: ms
¹: See WebKit bug 71270. Ref link 1.

LINKS:
1: https://bugs.webkit.org/show_bug.cgi?id=71270

Data from MDN - `npm i -g mdncomp` by epistemex
```

Or using the absolute path:

    $ mdncomp api.HTMLCanvasElement.toBlob

Or an regular expression:

    $ mdncomp /.*html.*toblob$/

Or an fuzzy expression:

    $ mdncomp -z ahcb.

**Show data in shorthand format using option `-s, --shorthand`:**

    $ mdncomp html*toblob -s
    
![Shorthand format](https://i.imgur.com/B1C4fBA.png)<br>
<sup>*cmder snapshot*</sup>

Rendered in markdown as well (live preview for viewers supporting tables
in markdown):

Browsers:    |C  |E  |F  |IE |O  |S  |ca |em |fa |oa |si |wa
:------------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:
toBlob       | 50| - | 19|10*| 37| Y*| 50| - | 4 | 37| - | 50
Image quality| 50| - | 25| - | Y | - | - | - | 25| - | ? | 50

**List branches and status**

You can navigate using branches and dot notation to find parent objects, or to list status of a feature,
for example: list all features with "experimental" status:

```text
mdncomp -l experimental
->
api.AbortController
api.AbortPaymentEvent
api.AbortSignal
api.AmbientLightSensor
--8X--
```

**List current browser versions:**

```text
mdncomp --browser current
->
Chrome             67  2018-05-29  https://chromereleases.googleblog....
Edge               17  2018-04-30  https://docs.microsoft.com/en-us/m...
Edge Mobile        17  2018-04-30
Firefox            61  2018-06-26  https://developer.mozilla.org/Fire...
Firefox Android    61  2018-06-26  https://developer.mozilla.org/Fire...
Internet Explorer  11  2013-10-17
Opera              53  2018-05-10  https://dev.opera.com/blog/opera-5...
STATUS: CURRENT
--8X--
```

Tip: You can combine the option with `--no-notes, -N` to not show the 
links at the end.

List release history for a single browser:
```text
mdncomp -Nb edge
->
Edge  12  2015-07-28  retired
Edge  13  2015-11-12  retired
Edge  14  2016-08-02  retired
Edge  15  2017-04-05  retired
Edge  16  2017-10-17  retired
Edge  17  2018-04-30  current
Edge  18  -           nightly
```

**Rich output, here additionally using the --desc and --specs options:**

    mdncomp  sharedarraybuffer --desc --specs
    
![Description and specifications summary example](https://i.imgur.com/uNnCGG6.png)<br>
<sup>*cygwin snapshot*</sup>

**Or as minimal, turning off extra information (here with options `-NRF`)**

    # -R = no-children, -N = no-notes, -F = no-flags (also see --help, -h)
    mdncomp sharedarraybuffer -RNF
    
![Minimalistic example](https://i.imgur.com/8HhBeOZ.png)<br>
<sup>*cygwin snapshot*</sup>

**The tables are also markdown enabled**

In other words: they can be pasted directly into a markdown document and will show
as rendered table in markdown flavors which support tables -  **live preview:**

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

Exploration
-----------
Feel like exploring? try:

    $ mdncomp --random

Or try combining the `--random` option with `--desc`:

    $ mdncomp --random --desc

You can also create a limited scope by providing a keyword or search term:

    $ mdncomp --random audio
    $ mdncomp --random abc --fuzzy --desc

Optional Config file
--------------------
Often used options can be permanently stored in a config file in user's home
directory in JSON format.

A sample config file is included. Use the option`--configpath` to get
location to the config folder.

Wiki
----
See the [wiki pages](https://gitlab.com/epistemex/mdncomp/wikis/home) for more details on each options, how to create
a config file and for usage examples.

The wiki is also included as markdown files in the included [wiki folder](./wiki/Home.md).

Want to help the MDN Team?
--------------------------
The MDN team is working hard to convert all the Browser Compatibility Data to 
their new format as used by this and other tools. For this reason some APIs and 
objects are WIP and may still not be available quite yet.

[How you can help them out](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Structures/Compatibility_tables).

Requirements
------------
- Node v8 or newer (for older Node version you can try out version 1.x.x).
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

mdncomp
=======

Show [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data) on the command line.

![xterm color output](https://i.imgur.com/BXgAPb1.png)<br>
<sup>*cygwin/xterm snapshot*</sup>

Features
--------

- Browser Compatibility Data (BCD)
  - Shows data on command line as a table or as a shorthand list
  - Search in APIs, CSS, HTML, HTTP, JavaScript, MathML, SVG, WebDriver and WebExtensions.
  - Get status for standard, experimental and deprecated features.
  - Show notes, prefix use, security issues, flags and more.
  - Show Web Worker support
  - Show SharedArrayBuffer as param support (WebGL)
  - Find features using paths, wildcards, fuzzy terms or regular expressions
  - Navigate by path and branches
  - Search case (in)sensitive
  - Show desktop and/or mobile information for the most common browsers.
  - Option to also show extended set of browsers and Node.js.
  - Works offline (only --doc(force) requires internet connection)

- Browser status
  - List current browser versions
  - List beta and nightly versions per browser
  - List status and release dates per browser
  - List browsers per status

- Additional documentation:
  - Show a summary description for each feature (included in the dataset).
  - Provides the URL to the feature's documentation page on [MDN](https://developer.mozilla.org/).
  - Specification references and status (W3C, WHATWG, KHRONOS, ECMA, IETF etc.)
  - Downloads and show documentation excerpt on the command line (with built-in data cache).
  - Open documentation link in the default browser from the command line.

- Integrated update mechanism (--update)
  - (NEW) Compressed data transfers (v.1.22)
  - (NEW) Patch/diff (RFC-6902) support for several versions back (v.1.22)
  - Force update to reinitialize/clean all data, or with data corruption
  
- Define permanent/often used options in a config file (which can be suspended at will).
- Output can now be used directly in markdown flavors that support inline tables.
- Built-in help per option.
- Documented with [wiki](https://gitlab.com/epistemex/mdncomp/wikis/home) pages
- Cross-platform (where node and npm is available).


Install
-------
Make sure to have [Node.js](https://nodejs.org/en/) and `npm` installed (included with node), then install `mdncomp` using:

    $ npm i -g mdncomp

This includes a precompiled dataset which can be updated at any time (see [options](https://gitlab.com/epistemex/mdncomp/wikis/Options.md#-update-fupdate-cupdate)).


Examples
--------

Using wildcard:

```text
$ mdncomp html*toblob.

 HTMLCanvasElement.toBlob (On Standard Track)
 https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob

 Chrome    | Edge      | Firefox   | IE        | Opera     | Safari
 ----------|-----------|-----------|-----------|-----------|-----------
     50    |     -     |     19    |    10°    |     37    |     Y¹

°) 10: Prefix: ms
¹) See WebKit bug 71270.

 Chrome/A  | Edge/mob  | Firefox/A | Opera/A   |Safari/iOS | Webview/A
 ----------|-----------|-----------|-----------|-----------|-----------
     50    |     -     |     4     |     37    |     -     |     50

Data from MDN - `npm i -g mdncomp` by epistemex
```

(the dot at the end indicates you want to stop at this object and not consider its children objects).

Or using the absolute path:

    $ mdncomp api.HTMLCanvasElement.toBlob

Or an regular expression:

    $ mdncomp /.*html.*toblob$/

Or an fuzzy expression:

    $ mdncomp -z hcb.

Show data in shorthand format:

```text
$ mdncomp html*toblob. -s
->
HTMLCanvasElement.toBlob:  DT: C:50 E:- F:19 IE:10* O:37 S:Y*  MOB: CA:50 FA:4 EM:- OA:37 Si:- WA:-
```

Combined with the `-a` option to list all results with shorthand information:
```text
$ mdncomp blob -sa
->
Blob       :  D: C:5 E:Y F:4 IE:10 O:11 S:5.1   M: CA:? FA:14 EM:Y OA:? Si:? WA:-
Blob.Blob  :  D: C:20 E:? F:13* IE:10 O:12 S:8   M: CA:? FA:14* EM:? OA:? Si:? WA:-
Blob.size  :  D: C:5 E:12 F:4 IE:10 O:11 S:5.1   M: CA:- FA:- EM:Y OA:- Si:- WA:-
Blob.type  :  D: C:5 E:12 F:4 IE:10 O:11 S:5.1   M: CA:- FA:- EM:Y OA:- Si:- WA:-
Blob.slice :  D: C:21* E:12 F:13* IE:10 O:12 S:5.1*   M: CA:? FA:14 EM:Y OA:? Si:? WA:-
BlobBuilder:  D: C:8* E:Y F:Y-18* IE:10* O:- S:-   M: CA:? FA:Y-18* EM:Y OA:- Si:- WA:-
BlobEvent  :  D: C:49 E:? F:22 IE:- O:36 S:-   M: CA:49 FA:22 EM:? OA:36 Si:- WA:-
--8X--
```

**List branches and status**

You can navigate using branches and dot notation to find parent objects, or to list status of a feature,
for example: list all features with "experimental" status:

```text
mdncomp -l experimental
->
api.AbortController
api.AbortSignal
api.Animation
api.AnimationEffectReadOnly
--8X--
```

**List current browser versions:**

```text
mdncomp --browser current
->
Chrome             67  2018-05-29  https://chromereleases.googleblog.com/2018/05/stable-channel-update-for-desktop_58.html
Edge               17  2018-04-30  https://docs.microsoft.com/en-us/microsoft-edge/dev-guide
Edge Mobile        17  2018-04-30
Firefox            61  2018-06-26  https://developer.mozilla.org/Firefox/Releases/61
Firefox Android    61  2018-06-26  https://developer.mozilla.org/Firefox/Releases/61
Internet Explorer  11  2013-10-17
Node.js             6  2016-04-26  https://nodejs.org/en/blog/release/v6.0.0/
--8X--
```

List release history for a single browser:

```text
mdncomp -b edge
->
Edge  12  2015-07-28  retired  https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/whats-new/edgehtml-12
Edge  13  2015-11-12  retired  https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/whats-new/edgehtml-13
Edge  14  2016-08-02  retired  https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/whats-new/edgehtml-14
Edge  15  2017-04-05  retired  https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/whats-new/edgehtml-15
Edge  16  2017-10-17  current  https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/whats-new/edgehtml-16
Edge  17  2018-04-30  current  https://docs.microsoft.com/en-us/microsoft-edge/dev-guide
Edge  18  -           nightly
```

And if release notes are available (as shown above) they are listed (you can use
[`--no-notes, -N`](https://gitlab.com/epistemex/mdncomp/wikis/Options.md#-n-no-notes) to ignore these).

**Get feature description summary:**

![Description summary example](https://i.imgur.com/9l3kyeB.png)

**Get documentation excerpts:**

![documentation excerpts](https://i.imgur.com/EK8I6TA.png)

Documentation excerpts are loaded from the MDN site and cached locally.

**Get specification links:**

![Specification option](https://i.imgur.com/Ix3G07g.png)


Exploration
-----------
Feel like exploring? Try combining the `--random` option with `--desc`:

    $ mdncomp --random --desc .

Or maybe you prefer more details? Then try `--doc` instead which will download
and cache details about syntax, properties, methods etc.:

    $ mdncomp --random --doc .

You can also limit it to certain keywords:

    $ mdncomp --random --desc audio

Open the documentation link in the default browser (in terminals such as xterm
you can also try <kbd>CTRL</kbd>-click the displayed link):

    $ mdncomp html*toblob. --mdn

Option file
-----------
Often used options can be permanently stored in a config file in user's home
directory in JSON format.

Wiki
----
See the [wiki pages](https://gitlab.com/epistemex/mdncomp/wikis/home) for more details on each options, how to create
a config file and for usage examples.

Also included as markdown files in the included [wiki folder](./wiki/Home.md).

How to Help the MDN Team
------------------------
The MDN team is working hard to convert all the Browser Compatibility Data to 
their new format as used by this and other tools. For this reason some APIs and 
objects are WIP and may not be available quite yet.

[How you can help them out](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Structures/Compatibility_tables).

Additional information
----------------------
Disclaimer: This tool is a independent tool not affiliated with any third-parties.

Build environment: [Node 8](https://nodejs.org/) and JetBrains' [WebStorm](https://www.jetbrains.com/webstorm/) on Windows.

There is no guarantee it will work with earlier versions of Node.js v8 but a simple polyfill is added to 
iron out some issues with earlier versions.

The software is provided AS-IS.

License
-------

[MIT](https://choosealicense.com/licenses/mit/).

*&copy; Epistemex 2018*

![Epistemex](https://i.imgur.com/GP6Q3v8.png)

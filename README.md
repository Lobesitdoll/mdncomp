mdncomp
=======

Show [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data) on the command line.

![termx color output](https://i.imgur.com/mhXWklc.png)<br>
<sup>*cygwin/xterm snapshot*</sup>

**Note: ALPHA release. Fairly stable but its API and behavior are subject to change without prior notice.**
This would also be a good time for [feature requests](https://github.com/epistemex/mdncomp/issues)!

Features
--------

- Browser Compatibility Data (BCD)
  - Search in APIs, CSS, HTML, HTTP, JavaScript, SVG, WebDriver and WebExtensions.
  - Get status for standard, experimental and deprecated features.
  - Show status notes, prefix status, flags and more.
  - Find features using paths, wildcards, fuzzy terms or regular expressions
  - Navigate by path and branches
  - Search case (in)sensitive
  - Show desktop and/or mobile information for the most common browsers
  - Works offline for the main data
- Browser status
  - List status and release dates per browser
  - List browsers per status
- Additional documentation:
  - Shows URL to documentation page for the feature on [MDN](https://developer.mozilla.org/).
  - Can show a short description (summary) for each feature (works offline).
  - Download and show documentation excerpt on the command line as well as cache the data.
  - Open documentation links in the default browser from the command line.
- Basic test tools:
  - Test documentation URL status (404 missing pages, connectivity).
  - List features with missing documentation URLs
- List to terminal as table or as shorthand formats
- Export as SVG
- Define permanent/often used options in a config file (can be suspended at will).
- Built-in help per option.
- Documented with [wiki](https://github.com/epistemex/mdncomp/wiki) pages
- Runs on Windows, Mac, Linux and other platforms where node and npm is available.


Install
-------
Make sure to have [Node.js](https://nodejs.org/en/) and `npm` installed (included with node), then install `mdncomp` using:

    $ npm i -g mdncomp

This includes a precompiled dataset which can be updated at any time (see [options](https://github.com/epistemex/mdncomp/wiki/Options-for-mdncomp#--update---fupdate---cupdate)).


Examples
--------

```text
$ mdncomp html*toblob.

 HTMLCanvasElement.toBlob (On Standard Track)
 https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob

 Chrome    | Edge      | Firefox   | IE        | Opera     | Safari
 ----------+-----------+-----------+-----------+-----------+-----------
     50    |     -     |     19    |    10°    |     37    |     Y¹

°) 10: Prefix: ms
¹) See WebKit bug 71270.

 Chrome/A  | Edge/mob  | Firefox/A | Opera/A   |Safari/iOS | Webview/A
 ----------+-----------+-----------+-----------+-----------+-----------
     50    |     -     |     4     |     37    |     -     |     50

Data from MDN - `npm i -g mdncomp` by epistemex
```

Or using the absolute path method:

    $ mdncomp api.HTMLCanvasElement.toBlob

Or as a regular expression:

    $ mdncomp /.*html.*toblob$/

Or as a fuzzy expression:

    $ mdncomp -z htctblb.

Export as a SVG file:

```text
$ mdncomp html*toblob. -o toBlob.svg
```

[![SVG Example](https://i.imgur.com/O1eCOeF.png)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)

In shorthand format in the terminal:

```text
$ mdncomp html*toblob. -s
->
HTMLCanvasElement.toBlob:  DT: C:50 E:- F:19 IE:10* O:37 S:Y*  MOB: CA:50 FA:4 EM:- OA:37 Si:- WA:-
Data from MDN - `npm i -g mdncomp` by epistemex
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
chrome            65  Rel: 2018-03-06
edge              16  Rel: 2017-10-17
edge_mobile       16  Rel: 2017-09-26
firefox           59  Rel: 2018-03-13
firefox_android   59  Rel: 2018-03-13
ie                11  Rel: 2013-10-17
nodejs             4  Rel: 2015-09-08
--8X--
```

List release history for a single browser:

```text
mdncomp -b edge
->
edge  12  Rel: 2015-07-28  retired
edge  13  Rel: 2015-11-12  retired
edge  14  Rel: 2016-08-02  retired
edge  15  Rel: 2017-04-05  retired
edge  16  Rel: 2017-10-17  current
edge  17  Rel: -           nightly
```

**Get feature description summary:**

![Descripotion summary example](https://i.imgur.com/up2RgWq.png)

**Get documentation excerpts:**

![documentation excerpts](https://i.imgur.com/JVZ4wgF.png)

These are loaded from the MDN site and cached locally.


Exploration
-----------
Feel like exploring? Try combining the `--random` option with `--desc`:

    $ mdncomp --random --desc .

Or maybe you prefer more details? Then try `--doc` instead which will download
and cache details about syntax, properties, methods etc.:

    $ mdncomp --random --doc .

Open the documentation link in the default browser (in terminals such as xterm
you can also try <kbd>CTRL</kbd>-click the displayed link):

    $ mdncomp html*toblob. --mdn


Wiki
----
See the [wiki pages](https://github.com/epistemex/mdncomp/wiki) for more details on each options, how to create
a config file and for usage examples.


Want to help?
-------------
The BCD team is working hard to convert all the browser compatibility data to their new
format as used by this tool. For this reason some APIs and objects may not be available quite yet.

Find out [how you can help them out](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Structures/Compatibility_tables)!


Additional information
----------------------
Disclaimer: This tool is a independent tool not affiliated with any third-parties.

Build environment: [Node 8](https://nodejs.org/) and JetBrains' [WebStorm](https://www.jetbrains.com/webstorm/) on Windows.

Test environments: Windows, Linux Ubuntu (VM)

Dependency projects (data compiler): [data-for-mdncomp](https://github.com/epistemex/data-for-mdncomp).


License
-------

[MIT](http://choosealicense.com/licenses/mit/).

*&copy; Epistemex 2018*

![Epistemex](https://i.imgur.com/GP6Q3v8.png)

mdncomp
=======

Show [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data) on the command line.

![color output](https://i.imgur.com/F5yfP2S.png)

ALPHA release.


Features
--------
- Search and get key information about APIs and their browser compatibility status
- List APIs by branch or non-normative status
- Update browser compatibility data directly from the app with MD5 check.
- Search with wildcards, case-insensitive or by option case-sensitive
- Or search using regular expressions
- Get shorthand text output for a single or multiple results
- Get browser release and status information
- Format text links in markdown format for easy copy and paste to forums/QA etc.
- Show just desktop or mobile devices' status
- Get, or by option ignore, footnotes per browser
- Show footnotes per section or by option collect footnotes in a single section
- Format max line width for text output
- Export information as SVG file


Install
-------
Make sure to have [Node.js](https://nodejs.org/en/) installed, then get `mdncomp` using NPM:

    $ npm i -g mdncomp

This includes a precompiled dataset which can be updated at any time (see [options](https://github.com/epistemex/mdncomp/wiki/Options-for-mdncomp#--update---fupdate---cupdate)).


Examples
--------

```text
$ mdncomp off*toblob

OffscreenCanvas.toBlob (EXPERIMENTAL, On Standard Track)
https://developer.mozilla.org/docs/Web/API/OffscreenCanvas/toBlob

DESKTOP:
Chrome    | Edge      | Firefox   | IE        | Opera     | Safari
----------+-----------+-----------+-----------+-----------+-----------
    -     |     ?     |    46°    |     -     |     -     |     -

°) 46: Behind flag gfx.offscreencanvas.enabled.

MOBILE:
Webview/A | Chrome/A  | Edge/mob  | Firefox/A | Opera/A   | Safari/iOS
----------+-----------+-----------+-----------+-----------+-----------
    -     |     -     |     ?     |    46°    |     -     |     -

°) 46: Behind flag gfx.offscreencanvas.enabled.

Data from MDN - `npm i -g mdncomp` by epistemex
```

Export as a SVG file:

```text
$ mdncomp off*toblob -o toBlob.svg
```

[![SVG Example](https://i.imgur.com/sZhEnYM.png)](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas/toBlob)

In shorthand format in the terminal:

```text
$ mdncomp html*toblob -s
->
HTMLCanvasElement.toBlob :  DT: C:50 E:- F:19 IE:10 O:Y S:Y*   MOB: WA:- CA:- FA:4 EM:- OA:- Si:-
```

Combined with the `-a` option to list all results with shorthand information:
```text
$ mdncomp blob -sa
->
Blob       :  DT: C:5 E:Y F:4 IE:10 O:11 S:5.1   MOB: WA:- CA:? FA:14 EM:Y OA:? Si:?
Blob.Blob  :  DT: C:20 E:? F:13* IE:10 O:12 S:8   MOB: WA:- CA:? FA:14* EM:? OA:? Si:?
Blob.size  :  DT: C:5 E:Y F:4 IE:10 O:11 S:5.1   MOB: WA:- CA:- FA:- EM:Y OA:- Si:-
Blob.slice :  DT: C:21 E:Y F:13* IE:10 O:12 S:5.1   MOB: WA:- CA:? FA:14 EM:Y OA:? Si:?
...
```

**List current browser versions:**

```text
mdncomp --browser current
->
chrome                   65           Rel: 2018-03-06
edge                     16           Rel: 2017-09-26
edge_mobile              16           Rel: -
firefox                  57           Rel: 2017-11-14
firefox_android          57           Rel: 2017-11-28
ie                       11           Rel: 2013-10-17
nodejs                    4           Rel: 2015-09-08
...etc.
```

Wiki
----
See the [wiki](https://github.com/epistemex/mdncomp/wiki) for details.


Note
----
The BCD team is working hard to convert all the browser compatibility
data to their new format used by this tool. For this reason some APIs
and objects may not be available quite yet.

Find out [how you can help them out](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Structures/Compatibility_tables)!

Disclaimer: This tool is a independent tool not affiliated with any third-party.


License
-------
Released under [MIT license](http://choosealicense.com/licenses/mit/). You may use this class in both commercial and non-commercial projects provided that full header (minified and developer versions) is included.

*&copy; Epistemex 2018*

![Epistemex](https://i.imgur.com/GP6Q3v8.png)

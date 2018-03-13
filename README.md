mdncomp
=======

Show [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data) on the command line.

![termx color output](https://i.imgur.com/bZtTVUY.png)<br>
<sup>*cygwin/xterm snapshot*</sup>

**Note: ALPHA release. Fairly stable but its API and behavior are subject to change without prior notice.**
This would also be a good time for [feature requests](https://github.com/epistemex/mdncomp/issues)!


Features
--------

- Search browser compatibility data for APIs, CSS, HTML, HTTP, JavaScript and WebExtensions.
- Get status for standard, experimental and deprecated features.
- Show status notes, prefix status, flags and more.
- Shows URL to documentation page for the feature on [MDN](https://developer.mozilla.org/).
- List browser status per browser or per status.
- Search or navigate per branch and path.
- Use wildcards or regular expressions
- Search case (in)sensitive
- Show desktop and/or mobile information
- List to terminal as table or as shorthand formats
- Export as SVG
- Built-in help per option.
- Documented with [wiki](https://github.com/epistemex/mdncomp/wiki) pages


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

 DESKTOP:
 Chrome    | Edge      | Firefox   | IE        | Opera     | Safari
 ----------+-----------+-----------+-----------+-----------+-----------
     50    |     -     |     19    |    10°    |     37    |     Y¹

°) 10: Prefix: ms
¹) See WebKit bug 71270.

 MOBILE:
 Chrome/A  | Edge/mob  | Firefox/A | Opera/A   |Safari/iOS | Webview/A
 ----------+-----------+-----------+-----------+-----------+-----------
     50    |     -     |     4     |     37    |     -     |     50

Data from MDN - `npm i -g mdncomp` by epistemex
```

Export as a SVG file:

```text
$ mdncomp off*toblob -o toBlob.svg
```

[![SVG Example](https://i.imgur.com/AGrnxwd.png)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)

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
Blob       :  DT: C:5 E:Y F:4 IE:10 O:11 S:5.1  MOB: CA:? FA:14 EM:Y OA:? Si:? WA:-
Blob.Blob  :  DT: C:20 E:? F:13* IE:10 O:12 S:8  MOB: CA:? FA:14* EM:? OA:? Si:? WA:-
Blob.size  :  DT: C:5 E:Y F:4 IE:10 O:11 S:5.1  MOB: CA:- FA:- EM:Y OA:- Si:- WA:-
Blob.type  :  DT: C:5 E:Y F:4 IE:10 O:11 S:5.1  MOB: CA:- FA:- EM:Y OA:- Si:- WA:-
Blob.slice :  DT: C:21* E:Y F:13* IE:10 O:12 S:5.1*  MOB: CA:? FA:14 EM:Y OA:? Si:? WA:-
BlobBuilder:  DT: C:8* E:Y F:?-18* IE:10* O:- S:-  MOB: CA:? FA:?-18* EM:Y OA:- Si:- WA:-
BlobEvent  :  DT: C:49 E:? F:22 IE:- O:36 S:-  MOB: CA:49 FA:22 EM:? OA:36 Si:- WA:-
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
chrome           65  Rel: 2018-03-06
edge             16  Rel: 2017-09-26
edge_mobile      16  Rel: -
firefox          57  Rel: 2017-11-14
firefox_android  57  Rel: 2017-11-28
ie               11  Rel: 2013-10-17
nodejs            4  Rel: 2015-09-08
--8X--
```

List release history for a single browser:

```text
mdncomp -b edge
->
edge  12  Rel: 2015-07-15  retired
edge  13  Rel: 2015-11-05  retired
edge  14  Rel: 2016-08-02  retired
edge  15  Rel: 2017-04-11  retired
edge  16  Rel: 2017-09-26  current
edge  17  Rel: -           nightly
```


Wiki
----
See the [wiki pages](https://github.com/epistemex/mdncomp/wiki) for more details on each options and usage examples.


Note
----
The BCD team at the Mozilla Developer Network is working hard to convert all the
browser compatibility data to their new format as used by this tool. For this reason
some APIs and objects may not be available quite yet.

Find out [how you can help them out](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Structures/Compatibility_tables)!

Disclaimer: This tool is a independent tool not affiliated with any third-party.

License
-------
[MIT](http://choosealicense.com/licenses/mit/).

*&copy; Epistemex 2018*

![Epistemex](https://i.imgur.com/GP6Q3v8.png)

mdncomp
=======

Get [MDN Browser Compatibility](https://github.com/mdn/browser-compat-data) data directly in the shell / console / terminal.

ALPHA release.

```text
$ mdncomp *html*toblob*

  HTMLCanvasElement.toBlob (On Standard Track)
  https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob

  DESKTOP:
  Chrome  | Firefox | Edge    | IE      | Opera   | Safari
  --------+---------+---------+---------+---------+----------
     50   |    19   |    -    |    10   |    Y    |    Y²

²)
- See WebKit bug 71270.

  MOBILE:
  Android | Chrome  | Edge    | Firefox | Opera   | Safari
  --------+---------+---------+---------+---------+----------
     -    |    -    |    4    |    -    |    -    |    -

Data from MDN - `npm i -g mdncomp` ver. 1.1.3-alpha by epistemex
```

It comes in colors, too!

![colors](https://i.imgur.com/2h3BlX5.jpg)

Or export as a SVG file:

![SVG example](https://i.imgur.com/8BMH5HD.jpg)

Or as a shorthand format:

```text
$ mdncomp *html*toblob* -s
->
HTMLCanvasElement.toBlob:  DT: C:50 F:19 E:? IE:10 O:Y S:Y*   MOB: A:- CA:? FA:4 EM:? OA:? SI:?
```

See all options:

    $ mdncomp -h

Install
-------
Install globally using NPM:

    $ npm i -g mdncomp

(add `--save` if MDN data wasn't included).


Usage Examples
--------------
Find an object to check compatibility for:
```text
$ mdncomp *toblob*
->
api.HTMLCanvasElement.toBlob
api.OffscreenCanvas.toBlob
```

List information for all results:
```text
$ mdncomp *toblob* -a
...
```

Or be more specific:
```text
$ mdncomp *html*toblob*
...
```

Only show desktop versions:

    $ mdncomp -d *html*toblob*

Don't show any notes:

    $ mdncomp api.HTMLCanvasElement.toBlob -N

List top-level branches in the MDN browser compatibility data:
```text
$ mdncomp -l .
->
api
browsers
css
html
http
javascript
webextensions
```

List branches in the JavaScript section:
```text
$ mdncomp -l javascript
->
builtins
classes
functions
grammar
operators
statements
```

Output to a file with no color information:

    $ mdncomp *html*toblob* -o toBlob.txt -b

Main options:
- Search case-sensitive
- Shorthand text output
- Format link as markdown
- Show just desktop or mobile
- Ignore notes
- Collect notes in one section
- Format max line width
- Export to SVG file


License
-------
Released under [MIT license](http://choosealicense.com/licenses/mit/). You may use this class in both commercial and non-commercial projects provided that full header (minified and developer versions) is included.

*&copy; Epistemex 2018*

![Epistemex](https://i.imgur.com/GP6Q3v8.png)

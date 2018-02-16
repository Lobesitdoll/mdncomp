mdncomp
=======

Get [MDN Browser Compatibility](https://github.com/mdn/browser-compat-data) data directly in the shell/console/terminal.

Experimental ALPHA release!

```text
$ mdncomp api.HTMLCanvasElement.toBlob

"toBlob" (on standard track)
See: https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob

DESKTOP:
Chrome  | Firefox | Edge    | IE      | Opera   | Safari
--------+---------+---------+---------+---------+----------
   50   |    19   |     -   |    10   |   Yes   |true(¹)

¹) See WebKit bug 71270.

MOBILE:
Android | Chrome  | Edge    | Firefox | Opera   | Safari
--------+---------+---------+---------+---------+----------
    -   |     -   |     -   |     4   |     -   |     -

Data from MDN - 'npm i -g mdncomp' by K3N / epistemex.com (c) 2018.
```

See options:

    $ mdncomp -h

Install globally using NPM:

    $ npm i -g mdncomp

This release is a initial experimental ALPHA release - use at own risk!

Usage Examples
--------------

List top level objects using "." as path:

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

Find an object to check compatibility for:
```text
$ mdncomp -s toblob
->
Searching: "toblob":
  api.HTMLCanvasElement.toBlob
  api.OffscreenCanvas.toBlob
Results: 2
```

Check compatibility for the first result:

    $ mdncomp api.HTMLCanvasElement.toBlob

Only show desktop versions:

    $ mdncomp -d api.HTMLCanvasElement.toBlob

Don't show any notes:

    $ mdncomp api.HTMLCanvasElement.toBlob -N

List object in the JavaScript section:
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

List object in the JavaScript statement section that starts with "f":
```text
$ mdncomp -l javascript.statements.f*
->
for
for_each_in
for_in
for_of
function
```

etc. More documentation will come.

License
-------

Released under [MIT license](http://choosealicense.com/licenses/mit/). You may use this class in both commercial and non-commercial projects provided that full header (minified and developer versions) is included.

*&copy; Epistemex 2018*

![Epistemex](https://i.imgur.com/GP6Q3v8.png)

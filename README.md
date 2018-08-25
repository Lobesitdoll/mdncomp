mdncomp<sup>nx</sup>
=========
**BETA**

Show [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data) on the command line.

    $ mdncomp html*toblob

![xterm color + languages output](https://i.imgur.com/5dcm3Ds.gif)<br>
<sup>*cygwin/xterm snapshot ([English, Spanish, Norwegian, ...](./locale#contribute-a-translation-file))*</sup>

Features
--------

New main core with improved search algorithm to get you faster and more flexible
to the compatibility data.

- Browser Compatibility Data (BCD from Mozilla Developer Network)
  - Search **API**, **CSS**, **HTML**, **HTTP**, **JavaScript**, **MathML**, **SVG**,
   **WebDriver** and **WebExtensions**.
  - Search and list features using keywords, paths, wildcards, fuzzy terms or regular expressions
  - Search case (in)sensitive
  - Deep search option (search in notes, flags, alternative names, prefixes etc.)
  - Navigate and show information using path and branches
  - Filter results using additional search terms
  - Shows data on the command line as a ANSI colored ASCII formatted table
  - Lists children features
  - Get feature status (standard, experimental or deprecated).
  - Show notes, flags, vendor prefix, history and security issues.
  - Show additional links for information in notes
  - Show optional detailed API specific support for a feature (Worker support, 
    SharedArrayBuffer support, CORS support, blob data, service workers etc.)
  - Show information for desktop, mobile and other browsers.
  - Show information for Node.js where relevant.
  - All data available offline (only --*update require a internet connection)

- Browser status
  - List **current** browser versions
  - List current, esr, beta, nightly, planned and retired versions *per browser*.
  - List current, esr, beta, nightly, planned and retired versions *per status*.
  - List status and release dates per browser, including release notes (if available).

- Additional included documentation:
  - Show a optional **summary description** per feature *(included in the dataset for mdncomp only)*.
  - Includes a *verified* URL to the feature's documentation page on [MDN](https://developer.mozilla.org/).
  - Show standards/specification references, status and links (W3C, WHATWG, KHRONOS, ECMA, IETF etc.)
   *(included in the dataset for mdncomp only)*.

- Integrated update mechanism
  - Lighting fast update process
  - Updates with patch files (RFC 6902 / 6901) with support for several versions back.
  - Optional forced data update to reinitialize with a full clean data set, f.ex. with data corruption.
  - Compressed data transfers

- Define permanent/often used options in a config file (which can be suspended when needed via option).
- Localized user interface.
- Built-in help per option.
- Cross-platform (where node and npm is available).
- Documented with [wiki](https://gitlab.com/epistemex/mdncomp/wikis/home) pages (todo for v2)

If you're an user of version 1.x.x you need to familiarize yourself with the changes as 
some options has been added, removed and changed. Output will also differ in a hopefully
improved manner.


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

    $ mdncomp j*let.

*(the stop-dot "`.`" above indicates that a result line should **end** with this search term.)*

![wildcard example](https://i.imgur.com/3PoMXRY.png)

or using the absolute feature path:

    $ mdncomp javascript.statements.let

or as an regular expression:

    $ mdncomp /\blet\b/

or as an fuzzy expression (here for `api.HTMLCanvasElement.toBlob`):

    $ mdncomp -z ahcb.
    $ mdncomp ahcb.

From *version 2* you can run without the `--fuzzy` option: if a result is not found 
using the basic search method, a second search using the same expression (unless the 
term contains astrix or starts with forward-slash) using the fuzzy method is 
automatically invoked.

<h3>Show data in a compact shorthand format using option `-s, --shorthand`:</h3>

    $ mdncomp html*toblob -s

![Shorthand format](https://i.imgur.com/ujbb8hZ.png)<br>
<sup>*cygwin/xterm snapshot*</sup>

You can now do a local filtering of the result by simply adding one or more keywords (or search-terms)
to the argument list. For example - this will only list child features containing "stroke" or "fill"
in the `CanvasRenderingContext2D` API (using only the last part of the name, here "`t2d`"):

    $ mdncomp t2d stroke fill

![example local filter](https://i.imgur.com/NNM7CSB.png)

<h3>List results using Custom Columns</h3>

You can now define custom columns using a comma (or space, semi-column, column)
separated list with the new option "-u, --columns". An example using custom
columns and local filter:

    mdncomp t2d path --columns "chrome,edge,firefox"

![example custom header + filter](https://i.imgur.com/5Fop2xa.png)

Tip: See config file section below for how you can store custom columns permanently.

<h3>List feature branches and status</h3>

You can navigate using branches and dot notation to find where a feature resides.

To list root simply add the option `--list` (or shorthand `-l`) with no argument:

    mdncomp --list

![example of root list](https://i.imgur.com/7EVhbXl.png)

List using one of the root branches:

    mdncomp --list webext

![example list an api](https://i.imgur.com/FBARr1D.png)

You can go to next branch by adding the name of the branch, fully or partly (if unique):

    mdncomp --list api.audiobu

or simply by adding the index number in one of the following ways:

    mdncomp --list api --index 7
    mdncomp --list api -i 7
    mdncomp -l api 7

(this usage of index also applies to the regular search).

One can further filter the result list:

    mdncomp -l api window

![snapshot list with filter](https://i.imgur.com/flEnn8i.png)

List per status, for example: list all features with "experimental" status:

    mdncomp -l experimental

![example list on status](https://i.imgur.com/Uvc7fqH.png)

<h3>List current browser versions:</h3>

    mdncomp --browser current

![example show current browsers](https://i.imgur.com/kJuN8hV.png)

Tip: You can combine the option with `-N, --no-notes` to hide the links at the end.

List release history for a single browser:

    mdncomp -Nb edge

![example listing on browser](https://i.imgur.com/7MIgKbU.png)

<h3>Rich output with additional options</h3>

    mdncomp sharedarraybuffer --desc --specs --ext

![Description and specifications summary example](https://i.imgur.com/I3VucIh.png)<br>
<sup>*cygwin snapshot*</sup>

<h3>Or as minimal, turning off extra information</h3>

Here with options `-NRF`:

`-R` = no-children, `-N` = no-notes, `-F` = no-flags (also see `-h, --help`)
    
    mdncomp sharedarraybuffer -RNF
    
![Minimalistic example](https://i.imgur.com/0LBDDrb.png)<br>
<sup>*cygwin snapshot*</sup>

Markdown enabled tables
-----------------------

The ASCII tables can be pasted directly into a markdown document and will show
as rendered HTML tables in markdown-flavors which support tables - **live preview:**

DESKTOP                     |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari
:---------------------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
HTMLCanvasElement           |    4     |    Y     |   3.6    |    9     |    9°    |   3.1
height                      |    4     |    12    |   3.6    |    9     |    9     |   3.1
mozOpaque ?                 |    -     |    -     |   3.5    |    -     |    -     |    -
width                       |    4     |    12    |   3.6    |    9     |    9     |   3.1
captureStream !             |    51    |    ?     |    43    |    -     |    36    |    ?
getContext                  |    Y     |    12    |   3.6    |    9     |    9     |   3.1
mozFetchAsStream x?         |    -     |    -     |  13-43   |    -     |    -     |    -
mozGetAsFile x?             |    -     |    -     |    4     |    -     |    -     |    -
toBlob                      |    50    |    -     |    19    |   10¹    |    37    |    Y²
toDataURL                   |    4     |    12    |   3.6    |    9     |    9     |    4
transferControlToOffscreen !|    -     |    -     |   44F    |    -     |    -     |    -

And in compact shorthand format:

Browsers:              |C  |E  |F  |IE |O  |S  |C/a|E/m|F/a|O/a|S/i|W/a
:----------------------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:
toBlob                 |50 | - |19 |10*|37 |Y* |50 | - | 4 |37 | - |50 
Image quality parameter|50 | - |25 | - | Y | - | - | - |25 | - | ? |50 

Exploration
-----------

Feel like discovering new features and APIs? try a random feature:

    $ mdncomp --random

combine it with a summary description:

    $ mdncomp --random --desc

You can also create a scope by providing a keyword or search term. Here, find
a random feature that contains "audio" in its path:

    $ mdncomp --random audio

Global Configuration
--------------------

Often used options can be permanently stored in a config file in the user's home
directory in JSON format (see option `--configpath` to see where it's located).

The use of config file can be suspended at any time with the `-G, --no-config` option.

To set or clear an option you can do:

    mdncomp --set lang=es
    mdncomp --set lang=en-us

A config file is created automatically if none exist.

To clear a setting from the config file use an empty value:

    mdncomp --set lang=
    mdncomp --set lang

So for example, if you always want a description to be shown:

    mdncomp --set desc=true

or if you don't want to see neither hints nor legends:

    mdncomp --set expert=2

Using 1 here will disabled hints, but not legends.

To see a list of valid keys that can be used:

    mdncomp --set ?

Tip: You can as an alternative, define alias commands in some terminals with 
specific options set for different purposes.

Requirements
------------

- **Node.js version 8.3** or newer (for older Node version use mdncomp version 1.23.0).
- NPM to install `mdncomp i -g mdncomp`
- Internet connection when updating (via the `--*update` options)

Developer environment
---------------------

Development IDE: JetBrains' [WebStorm](https://www.jetbrains.com/webstorm/).

Test environments: Windows 8.1+, Linux (Ubuntu) 

The pre-compiled data an patch repositories can be found [here](https://github.com/epistemex/mdncomp-data)
and [here](https://gitlab.com/epistemex/mdncomp-data) (redundancy repo).

Support
-------

This product is provided AS-IS and comes with no support nor warranty. You use it
at your own risk.

The main git repository can be found at **GitLab** where you also can report issues:

- [GitLab repo](https://gitlab.com/epistemex/mdncomp)
- [GitLab report issues](https://gitlab.com/epistemex/mdncomp/issues)

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

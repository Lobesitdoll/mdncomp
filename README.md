mdncomp<sup>nx</sup>
=========

[![npm](https://img.shields.io/npm/v/mdncomp.svg)](https://www.npmjs.com/package/mdncomp)
[![Monthly Downloads from NPM](https://img.shields.io/npm/dm/mdncomp.svg?style=flat-square)](https://www.npmjs.com/package/mdncomp)

A Web Developer's friend that shows [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data) on the command line.

    $ mdncomp html*toblob

![xterm color + languages output](https://i.imgur.com/yG1W1CK.gif)<br>
<sup>*cygwin/xterm snapshot ([English, Spanish, Norwegian, ...](./locale#contribute-a-translation-file))*</sup>

[ [cmd high contrast output](https://i.imgur.com/tO349ZA.png) ]
[ [cmder output](https://i.imgur.com/I0IsvcG.png) ]
[ [macOS High Sierra](https://i.imgur.com/yUvfHm2.png) ]
[ [Linux/Ubuntu 18](https://i.imgur.com/Qo6kcV0.png) ]


Features
--------

Refactored core code with improved search algorithm to get you faster and more flexible
to the compatibility data.

- Browser Compatibility Data (BCD from Mozilla Developer Network)
  - Search **APIs**, **CSS**, **HTML**, **HTTP**, **JavaScript**, **MathML**, **SVG**,
   **WebDriver**, **WebExtensions**, **XPath** and **XSLT**.
  - Search and list features using keywords, paths, wildcards, fuzzy terms or regular expressions.
  - Search case (in)sensitive.
  - Deep Search option (search in notes, flags, alternative names, prefixes etc.).
  - Search using MDN documentation or specification links as search term 
  - Navigate and show information using path and branches.
  - Filter result lists using additional search terms.
  - Show result using custom defined browser list.
  - Show data on the command line as ANSI colored tables.
  - Include children features in table results.
  - Get feature status (standard, experimental or deprecated).
  - Show notes, flags, vendor prefixes, history and security issues.
  - Show additional links for information in notes.
  - Show optional detailed API specific support for a sub-feature (Worker support, 
    SharedArrayBuffer support, CORS support, blob data, service workers etc.).
  - Sectioned tables for desktop, mobile and other browsers.
  - Show information for Node.js where relevant.
  - Output as JSON raw data incl. specification list and summary description
  - Works offline

- Browser status
  - List **current** browser versions
  - List current, esr, beta, nightly, planned and retired versions *per browser*.
  - List current, esr, beta, nightly, planned and retired versions *per status*.
  - List status and release dates per browser, including release notes (if any).

- Additional included documentation:
  - Show MDN documentation title (WIP at MDN) per feature
    *(only in the mdncomp dataset)*.
  - Show a optional **summary description** per feature
    *(only in the mdncomp dataset)*.
  - Includes a *verified* URL to the feature's documentation page on [MDN](https://developer.mozilla.org/)
    *(only in the mdncomp dataset)*.
  - Show standards/specification references, status and links (W3C, WHATWG, KHRONOS, ECMA, IETF etc.)
   *(only in the mdncomp dataset)*.

- Integrated update mechanism for dataset
  - Fast update using "precompiled" compatibility data with additional data (summary description, specs)
  - Compressed data transfers

- Define permanent/often used options in a config file (can be suspended when needed via option).
- Copied text from terminal is easy to paste to Q&A sites, forums etc. to document feature support.
- Localized user interface.
- Built-in help per mdncomp option.
- Cross-platform (where node and npm is available).
- Usage documentation included as [wiki](./wiki/Home.md) pages

Note: If you're an user of version 1.23 or earlier, you'll need to familiarize yourself with the new
changes as some options has been added, removed and changed.


Installation
------------

Make sure to have [Node.js](https://nodejs.org/en/) and `npm` installed (included with node).

Then install latest version globally:

    $ npm i -g mdncomp

Update weekly or so using the built-in `--update` option. The data should be updated automatically 
when installed via NPM (may not apply to Linux/Darwin users due to permission restrictions).
If for some reason update failed via NPM post-installation, you can run this manually:

    $ mdncomp --update 
    $ sudo mdncomp --update   # Linux/Darwin first run 

If you prefer the old version 1.23 you can install it using its tag:

    $ npm i -g mdncomp@1.23.0

To try out current development version:

    $ npm i -g https://github.com/epistemex/mdncomp.git


Examples
--------

Using wildcard:

    $ mdncomp j*let.

*(the stop-dot "`.`" above indicates that the resulting path line should **end** with this search term.)*

Tip: from version 2.1 you can also use the shorter "bcd" alias instead of "mdncomp":

    $ bcd ...

![wildcard example](https://i.imgur.com/mW9uDVq.png)

or using the absolute feature path:

    $ mdncomp javascript.statements.let

or as an regular expression, for example word-bound searches (\\b):

    $ mdncomp /\blet\b/

or as a fuzzy-expression (here for `api.HTMLCanvasElement.toBlob`):

    $ mdncomp -z ahcb.
    $ mdncomp ahcb.

Note: From *version 2* you can run without the `--fuzzy` option: if the term has no results
a second search search pass is performed using the same expression but as a fuzzy term (unless
the term contains wildcards or starts with forward-slash for RegExp).

**Search using links for specifications or MDN documentation**
 
The only requirements are that the URL is fully qualified HTTPS link. In addition: 
- for MDN documentation contains no locale specific part (i.e. "/en-us/")
- for specification links contains a hash part (i.e. "#dom-canvas-toblob").

Example using a specification link:

    mdncomp https://html.spec.whatwg.org/multipage/scripting.html#dom-canvas-toblob

Note: Only features that has valid MDN links will have searchable links.


<h3>Show data in a compact shorthand format using option `-s, --shorthand`:</h3>

    $ mdncomp html*toblob -s

![Shorthand format](https://i.imgur.com/wxZYoOC.png)<br>
<sup>*cygwin/xterm snapshot*</sup>

You can from version 2 do filtering of the result by simply adding one or several keywords (or search-terms)
to the argument list. For example: this will only list child features containing "stroke" or "fill"
in the `CanvasRenderingContext2D` API (using only the last part of the name, here "`t2d`"):

    $ mdncomp t2d stroke fill

![example local filter](https://i.imgur.com/OKzqor8.png)

<sup>The check-mark "✓" here is from using the config setting `unicode`, e.g. `bcd --set unicode=true`.

<h3>List results using Custom Columns</h3>

From version 2 you can define custom columns using the new option "-u, --columns".
Simply specify a comma separated (or space, semi-column, column) list. For example,
a custom column result using search term ("`t2d`") and a result filter ("`path`"):

    mdncomp t2d path -u "chrome,edge,firefox"

![example custom header + filter](https://i.imgur.com/8FFFN0H.png)

To get a list of valid browser IDs use the option `-b, --browser`.

Tip: See config file section below for how you can store custom columns permanently.

<h3>List feature branches and status</h3>

You can navigate using branches and dot notation to find where a feature resides.

To list root simply add the option `--list` (or shorthand `-l`) with no argument:

    mdncomp --list

![example of root list](https://i.imgur.com/ZRhyNLd.png)

List using one of the root branches:

    mdncomp -l webext

![example list an api](https://i.imgur.com/FBARr1D.png)

You can go to next branch by adding the name of the branch, fully or partly (if unique):

    mdncomp -l api.audiobu

or simply by adding the index number in one of the following ways:

    mdncomp --list api --index 7
    mdncomp --list api -i 7
    mdncomp -l api 7

(this usage of shorthand index also applies to the regular search).

One can further filter the result list:

    mdncomp -l api window

![snapshot list with filter](https://i.imgur.com/flEnn8i.png)

List per status, for example: list all features with "experimental" status:

    mdncomp -l experimental

![example list on status](https://i.imgur.com/Uvc7fqH.png)

<h3>List current browser versions:</h3>

    mdncomp --browser current

![example show current browsers](https://i.imgur.com/HUvq866.png)

Tip: You can combine the option with `-N, --no-notes` to hide the links at the end.

List release history for a single browser:

    mdncomp -Nb edge

![example listing on browser](https://i.imgur.com/7MIgKbU.png)

<h3>Rich output with additional options</h3>

    mdncomp sharedarraybuffer --desc --specs --ext

![Description and specifications summary example](https://i.imgur.com/TgKJ7fo.png)<br>
<sup>*cygwin snapshot*</sup>

<h3>Or as minimal, turning off extra information</h3>

Here with options `-NRF`:

`-R` = no-children, `-N` = no-notes, `-F` = no-flags (also see `-h, --help`)
    
    mdncomp sharedbuffer -RNF

![Minimalistic example](https://i.imgur.com/aeD4g8t.png)<br>
<sup>*cygwin snapshot*</sup>


Markdown enabled tables
-----------------------

The ASCII tables can be pasted directly into a markdown document and will show
as rendered HTML tables in markdown-flavors which support tables - **live preview:**

DESKTOP >                   |Chrome    |Edge      |Firefox   |IE        |Opera     |Safari    
:---------------------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:
HTMLCanvasElement           |    4     |    ✓     |   3.6    |    9     |    9°    |   3.1    
captureStream !             |    51    |    ?     |    43    |    ˟     |    36    |    ?     
getContext                  |    ✓     |    12    |   3.6    |    9     |    9     |   3.1    
height                      |    4     |    12    |   3.6    |    9     |    9     |   3.1    
mozFetchAsStream x?         |    ˟     |    ˟     |  13-43   |    ˟     |    ˟     |    ˟     
mozGetAsFile x?             |    ˟     |    ˟     |    4     |    ˟     |    ˟     |    ˟     
mozOpaque ?                 |    ˟     |    ˟     |   3.5    |    ˟     |    ˟     |    ˟     
toBlob                      |    50    |    ˟     |    19    |   10¹    |    37    |    ✓²    
toDataURL                   |    4     |    12    |   3.6    |    9     |    9     |    4     
transferControlToOffscreen !|    ˟     |    ˟     |   44§    |    ˟     |    ˟     |    ˟     
width                       |    4     |    12    |   3.6    |    9     |    9     |   3.1    
And in compact shorthand format:

BROWSERS >             |C  |E  |F  |IE |O  |S  |C/a|E/m|F/a|O/a|S/i|W/a
:----------------------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:
toBlob                 |50 | - |19 |10*|37 |Y* |50 | - | 4 |37 | - |50
Image quality parameter|50 | - |25 | - | Y | - | - | - |25 | - | ? |50


Exploration
-----------

Feel like exploring? Find new features and APIs using the `--random` options:

    $ mdncomp --random

combine it with a summary description:

    $ mdncomp --random --desc

You can create a limiting scope by providing a keyword or search term. Here, find
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

Note: On macOS/Linux you'll likely have to use `sudo` to set options as it writes
to a config file stored in the user area.

    sudo mdncomp --set unicode=1


A Note On JSON Output
---------------------

There are a few differences between the **mdncomp** dataset and the original BCD ref. option `-j, --json`:

- `description` in BCD becomes `title` in **mdncomp** (refers to sub-feature entries)
- `description` in **mdncomp** is the *summary description* from MDN
- `mdn_url` in **mdncomp** holds a shortened form of the URL (wo/ prefixed part: "`https://developer.mozilla.org/docs/`") to compact the data (was incorporated pre compression of the data)
- **mdncomp** has `mdn_title`, the *page entry title* from MDN
- **mdncomp** has `spec_urls` (currently `specs`; is in emigration process) which is an array holding objects for each spec entry, if any

Note that the **mdncomp** *data-format* version is still considered **alpha** as BCD itself is, so this as well as other fields may change in the future.


Requirements
------------

- **Node.js version 8.3** or newer (for older Node version use mdncomp version 1.23).
- NPM to install `npm i -g mdncomp`
- Internet connection when updating (via the `--*update` options)


Developer Environment
---------------------

Development IDE: JetBrains [WebStorm](https://www.jetbrains.com/webstorm/).

Test environments: Windows 8.1+, Linux (Ubuntu), Darwin (macOS High Sierra)

The pre-compiled data and patch repositories can be found [here](https://github.com/epistemex/mdncomp-data)
(primary atm) and [here](https://gitlab.com/epistemex/mdncomp-data) (redundancy repo).


Contributors
------------

- [GitLab overview](https://gitlab.com/epistemex/mdncomp/graphs/master)
- [GitHub overview](https://github.com/epistemex/mdncomp/graphs/contributors)


Support
-------

This product is provided AS-IS and comes with no support nor warranty. You use it
at your own risk. It's continued development depends largely on user interest and feedback.

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

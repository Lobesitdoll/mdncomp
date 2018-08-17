Locale support
==============

The language files are JSON files containing keys and the language string for it:

```text
Key             Language value for key
--------------  ------------------------------------------------------------------
...
"aboutBCD"    : "MDN Browser Compatibility Data",
"aboutOptions": "options",
"aboutVersion": "Version",
"optionsList" : "List paths starting with given branch(es), or none for root list"
...
```

There are two main sections in the JSON file, `texts` holding the phrases and
`chars` holding abbreviation symbols. 

```json
{"texts": {
  "aboutBCD"     : "MDN Browser Compatibility Data",
  "aboutOptions" : "options"
 },
 "chars": {
  "yes": "Y"
 }
}
```

Note: Keys and values must always be enclosed in quotes.

The language files must have a "minimum" language, for example English must
have "en.json" as fallback for when "en-uk.json" doesn't exist etc.


Special color codes
-------------------

A *very few* phrases contains *color codes*. These are codes that starts with a question
mark followed by a single letter, for example:

    "historyHint" : "Use option ?c-y, --history?R to see historical data."

Here the codes are `?c` and `?R`. This simply means use color cyan and then Reset.
These must be kept as-is for the same purpose as originally intended, here that would
be to color the `-y, --history` option in the text.

Normal question marks should be handled as normal (incl. in languages such as
Spanish where the question would start with ¿: "¿que pasa?" etc., though at the
moment there are no questions in the file).


Contribute a Translation file
=============================

To contribute with a translated file (or improve an existing one)-

First clone the repository so you can make a PR later on.

Then use the file `locale/en.json` as basis. This is always up-to-date. Simply copy it,
rename using a proper ISO language code, replace the English phrases with those in the
language you translate to (but never change the keys).

Try to keep the phrases short so they fit within a typical command line line length,
but if not possible ignore this.

Make sure the abbreviations don't "collide" - for example, if in `mdncomp --list webext`
some or all legends you see listed at the bottom ends up with the same letter, try to 
be creative and prioritize. Same for "F = Flags" etc. in the normal table listings.

To publish create a PR (Pull Request) for mdncomp. The file will be reviewed and when 
approved merged into the repository. Contributions will be credited.

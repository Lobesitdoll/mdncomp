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

Contribute a Translation file
-----------------------------

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

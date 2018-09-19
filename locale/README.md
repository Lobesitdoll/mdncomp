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

Note: Keys and values must always be enclosed in quotes to be a valid JSON file.


Contribute a Translation file
=============================

To contribute with a translated file (or improve an existing one).

First, clone the repository so you can make a PR later on.

Then use the file `locale/en.json` as basis. This is always up-to-date. Simply copy it,
rename using a proper ISO language code (but dashes instead of underscore, i.e. "en-ca" etc.), 
replace the English phrases with those in the language you translate to (but never change the keys!).

Try to keep the phrases short as possible even if that means using common abbreviations
so they fit within a typical command line length typically around 80 chars for many users.
If not possible then well, ignore length.

Make sure the abbreviations in `chars` don't "collide" - for example, if in `mdncomp --list webext`
some or all legends you see listed at the bottom ends up with the same letter, try to 
be creative and prioritize. Same for "F = Flags" etc. in the normal table listings.

Don't special UNICODE chars outside the UTF-8 range.
 
To publish, create a PR (Pull Request) for mdncomp. The file will be reviewed and when 
approved merged into the repository. 

Contributions will of course be credited.


Feature Descriptions in the Dataset
===================================

Translations of feature descriptions themselves will be fetched from MDN directly and 
embedded in the dataset, where available. You can help MDN by [translating documentation there](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Localize/Translating_pages)
to see your own language appear more often as descriptions as they will otherwise
default to English.

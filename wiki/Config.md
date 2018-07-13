A configuration file in JSON format can be made to store often used options.

Note that the options defined in the config file will override any given option
on the command line, except the following ones which are ignored:

    --no-config, --out, --all, --index, --browser, --list, --version,
    --update, --cupdate, --fupdate, --random and --help

Any other option can be placed in the file with a true/false argument, or string/number
for options that require this (it's important to use the correct type!).

The option name is first the long version of it. For example option `-z, --fuzzy` will
use "fuzzy" as key name and not "z".

Notice that negating options such as `--no-colors` is specified without the no- part. Neither
is `-`, or `--` specified.

**NOTE 1**: You will also need to enclose the key (option name) in quotes as shown below.

**NOTE 2**: These are not defaults but overrides.

Options that can be stored
--------------------------

Example file holding all possible options (see install root for a sample config file).
Delete all options that you won't use.

**CHANGE NOTE: From version 1.13.2a the options must be attached to a new branch "options" and
a branch "settings" is reserved for future use.**

**CHANGE NOTE: From version 1.14.5a config resides in HOME folder on Linux and Windows, and config
file is now named ".config.json".**

```text/json
{"options": {
  "fuzzy"         : false,
  "colors"        : true,
  "notes"         : true,
  "noteEnd"       : false,
  "shorthand"     : false,
  "split"         : false,
  "caseSensitive" : false,
  "desktop"       : true,
  "mobile"        : true,
  "overwrite"     : false,
  "markdown"      : false,
  "maxChars"      : 72,
  "doc"           : false,
  "docforce"      : false,
  "ext"           : false,
  "desc"          : false,
  "specs"         : false,
  "waitkey"       : false
 },
 "settings" : {}
}
```

For example, if you prefer the mdncomp to always output with no colors and a short
description you could define a config file with these entries:

```text/json
{"options": {
    "colors"      : false,
    "desc"        : true
  }
}
```

or if you prefer to output in shorthand format:

```text/json
{"options": {
    "shorthand"   : true
  }
}
```

Other configurations:

```text/json
{"options": {},
  "formatter": {
    "long": {
      "sepChar": "+"
    }
  }
}
```
For now you can specify table cell separator character to do:

```text
----------+-----------+-----------+-----------+-----------+-----------
----------|-----------|-----------|-----------|-----------|-----------
```  
etc.

Only a single char in the ASCII range is considered valid with the exception
of a few characters such as &lt; and &gt;, $, % and &amp;. It none is specified
or an char is invalid, mdncomp defaults back to "|".

This not allow you do use a preferred character but also to output tables
that can be used in some markdown flavors that support inline tables,

Example - if the markdown flavor support tables a HTML table should appear
below instead of the normal ASCII representation:

 Chrome    | Edge      | Firefox   | IE        | Opera     | Safari    
 ----------|-----------|-----------|-----------|-----------|-----------
     50    |     -     |     19    |    10°    |     37    |     Y¹    


Then if you from time to time want to ignore the config file you could use the [`--no-config`](./Options.md#-no-config)
option:

    $ mdncomp --no-config ...

Path locations
--------------

The actual path depends on the system you're on. To see what path mdncomp is using on your
system run it with the [`--configpath`](./Options.md#-configpath) option:

```text/json
$ mdncomp --configpath
-->
C:\Users\-username-\.mdncomp     # the typical path on a Windows system
```

Create and place the config in that folder with the name `mdncomp.json`.

**Typical path locations:**

Linux:

    /home/-username-/.mdncomp/.config.json

OS X:

    /Users/-username-/Library/Preferences/.mdncomp/.config.json

Windows 7+:

    C:\Users\-username-\.mdncomp\.config.json

Window XP:

    C:\Documents and Settings\-username-\.mdncomp\.config.json

(replace "-username-" with the username for that system/account).

The sample file can be found in the NPM install root folder for mdncomp.

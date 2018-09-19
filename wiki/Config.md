Config Settings
===============

Note: the wiki links are using the GitLab version.

Config settings are set using the option [`--set <kv>`](./Options.md#-set-kv) which
allow you set certain options and additional configurations not available through options
as permanent so you don't have to type them in every time you run **mdncomp**.

All config settings can be temporarily suspended via the [`-G, --no-config`](#-g-no-config) option.

For config settings that are covered by options, refer to the option page.

Note: All config settings are "positive", so to set config for say `--no-colors` you
would use:

    bcd --set colors=false

Also:
- To set a value "on" you can use both "true" and "1".
- To set a value "off" you can use both "false" and "0".
- To clear a value set it without any argument:

Both these versions are valid to clear a config setting:

    bcd --set colors=
    bcd --set colors

Available Config Settings
=========================

brightbars
----------

Enables "bright" (depending on terminal and its palette) vertical bars in tables.

caseSensitive
----------

See option [`-c, --case-sensitive`](./Options.md#-c-case-sensitive)

children
----------

See option [`-R, --no-children`](./Options.md#-r-no-children)

colors
----------

See option [`--no-colors`](./Options.md#-no-colors)

columns
----------

See option [`-u, --columns <cols>`](./Options.md#-u-columns-cols)

desc
----------

See option [`--desc`](./Options.md#-desc)

desktop
----------

See option [`-D, --no-desktop`](./Options.md#-d-no-desktop)

expert
----------

See option [`--expert [level]`](./Options.md#-expert-level)

ext
----------

See option [`-x, --ext`](./Options.md#-x-ext)

flags
----------

See option [`-F, --no-flags`](./Options.md#-f-no-flags)

fuzzy
----------

See option [`-z, --fuzzy`](./Options.md#-z-fuzzy)

history
----------

See option [`-y, --history`](./Options.md#-y-history)

json
----------

See option [`-j, --json`](./Options.md#-n-json)

lang
----------

See option [`--lang <isocode>`](./Options.md#-lang-isocode)

maxChars
----------

See option [`--max-chars <width>`](./Options.md#-max-chars-width)

minihelp
----------

If set a short version of the option [`-h, --help`](#-h-help) is shown.

Example:

![minihelp enabled](https://i.imgur.com/YzUBfrQ.png)


mobile
----------

See option [`-M, --no-mobile`](./Options.md#-m-no-mobile)

nofooter
----------

If set, disables the footer output on table results.

notes
----------

See option [`-N, --no-notes`](./Options.md#-n-no-notes)

obsolete
----------

See option [`-O, --no-obsolete`](./Options.md#-o-no-obsolete)

shorthand
----------

See option [`-s, --shorthand`](./Options.md#-s-shorthand)

specs
----------

See option [`--specs`](./Options.md#-specs)

unicode
-------

Experimental and requires a terminal supporting code tables outside UTF-8.
Allows for certain characters to show instead of default ASCII versions.

Example: "Y" becomes "✓" etc. (at the moment this is the only change).

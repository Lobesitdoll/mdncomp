
Install
=======

Make sure [node](https://nodejs.org/en/) minimum version 8.3 is installed, then
install **mdncomp** globally:

    $ npm i -g mdncomp

Darwin (macOS) and Linux users may have to use sudo to install:

    $ sudo npm i -g mdncomp

Update the Browser Compatibility Data itself occasionally (roughly weekly at the moment)
using the "--update" option:

    $ mdncomp --update

or if you prefer to use the shorthand alias for **mdncomp**:

    $ bcd --update

In version 2 you *can* use NPM to update the data, however, do note that this 
will only work if there is a new version of **mdncomp** itself even if there 
are new data available. The data that is included with the NPM install may
not be fully up-to-date.

Using mdncomp
=============

- [See information for all options](./Options.md) (v2)
- [See information for all config settings](./Config.md) (v2)
- [See information for how to use](./Using.md) (v2)

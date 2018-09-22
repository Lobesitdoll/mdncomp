/*
  "The MIT License"

  Copyright (c) 2011 TJ Holowaychuk <tj@vision-media.ca>

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  'Software'), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  Additional modifications, removals, additions also under MIT:

  Modified 2.18.0 version for local need:
  - Locale support
  - Colorized output
  - ES6 format
  - Stripped off unneeded functionality
  - Reduced overall size (from ~28kb to ~7kb in build)

  Module dependencies.

  Copyright (c) 2018 epistemex
 */

const EventEmitter = require("events").EventEmitter;
const basename = "mdncomp";
const basename2 = "bcd";

/**
 * Initialize a new `Option` with the given `flags` and `description`.
 *
 * @param {*} flags
 * @param {String} description
 * @api public
 */
function Option(flags, description) {
  //noinspection JSUnusedGlobalSymbols
  this.flags = flags;
  this.required = flags.indexOf("<") >= 0;
  this.optional = flags.indexOf("[") >= 0;
  this.bool = flags.indexOf("-no-") === -1;
  flags = flags.split(/[ ,|]+/);
  if ( flags.length > 1 && !/^[[<]/.test(flags[ 1 ]) ) this.short = flags.shift();
  this.long = flags.shift();
  this.description = description || "";
}

Option.prototype = {

  /**
   * Return option name.
   *
   * @return {String}
   * @api private
   */
  name: function() {
    return this.long
      .replace("--", "")
      .replace("no-", "");
  },

  /**
   * Return option name, in a camelcase format that can be used
   * as a object attribute key.
   *
   * @return {String}
   * @api private
   */
  attributeName: function() {
    return camelcase(this.name());
  },

  /**
   * Check if `arg` matches the short or long flag.
   *
   * @param {String} arg
   * @return {Boolean}
   * @api private
   */
  is: function(arg) {
    return this.short === arg || this.long === arg;
  }
};

/**
 * Initialize a new `Command`.
 *
 * @param {String} [name]
 * @api public
 */
function Command(name = "") {
  this.commands = [];
  this.options = [];
  this._allowUnknownOption = false;
  this._args = [];
  this._name = name;
}

Command.prototype = {

  /**
   * Define option with `flags`, `description` and optional
   * coercion `fn`.
   *
   * The `flags` string should contain both the short and long flags,
   * separated by comma, a pipe or space. The following are all valid
   * all will output this way when `--help` is used.
   *
   *    "-p, --pepper"
   *    "-p|--pepper"
   *    "-p --pepper"
   *
   * Examples:
   *
   *     // simple boolean defaulting to false
   *     program.option('-p, --pepper', 'add pepper');
   *
   *     --pepper
   *     program.pepper
   *     // => Boolean
   *
   *     // simple boolean defaulting to true
   *     program.option('-C, --no-cheese', 'remove cheese');
   *
   *     program.cheese
   *     // => true
   *
   *     --no-cheese
   *     program.cheese
   *     // => false
   *
   *     // required argument
   *     program.option('-C, --chdir <path>', 'change the working directory');
   *
   *     --chdir /tmp
   *     program.chdir
   *     // => "/tmp"
   *
   *     // optional argument
   *     program.option('-c, --cheese [type]', 'add cheese [marble]');
   *
   * @param {String} flags
   * @param {String} description
   * @param {Function|*} [fn] or default
   * @param {*} [defaultValue]
   * @return {Command} for chaining
   * @api public
   */
  option: function(flags, description, fn, defaultValue) {
    const option = new Option(flags, description);
    const oname = option.name();
    const name = option.attributeName();

    // default as 3rd arg
    if ( typeof fn !== "function" ) {
      if ( fn instanceof RegExp ) {
        const regex = fn;
        fn = function(val, def) {
          const m = regex.exec(val);
          return m ? m[ 0 ] : def;
        };
      }
      else {
        defaultValue = fn;
        fn = null;
      }
    }

    // preassign default value only for --no-*, [optional], or <required>
    if ( !option.bool || option.optional || option.required ) {
      // when --no-* we make sure default is true
      if ( !option.bool ) defaultValue = true;
      // preassign only if we have a default
      if ( defaultValue !== undefined ) {
        this[ name ] = defaultValue;
        //noinspection JSUndefinedPropertyAssignment
        option.defaultValue = defaultValue;
      }
    }

    // register the option
    this.options.push(option);

    // when it's passed assign the value
    // and conditionally invoke the callback
    this.on("option:" + oname, (val) => {
      // coercion
      if ( val !== null && fn ) {
        val = fn(val, this[ name ] === undefined ? defaultValue : this[ name ]);
      }

      // unassigned or bool
      if ( typeof this[ name ] === "boolean" || typeof this[ name ] === "undefined" ) {
        // if no value, bool true, and we have a default, then use it!
        if ( val == null ) {
          this[ name ] = option.bool ? defaultValue || true : false;
        }
        else {
          this[ name ] = val;
        }
      }
      else if ( val != null ) {
        // reassign
        this[ name ] = val;
      }
    });

    return this;
  },

  /**
   * Parse `argv`, settings options and invoking commands when defined.
   *
   * @param {Array} argv
   * @return {Command} for chaining
   * @api public
   */
  parse: function(argv) {

    // store raw args
    //this.rawArgs = argv;

    // guess name
    this._name = this._name || basename;

    // process argv
    let parsed = this.parseOptions(this.normalize(argv.slice(2)));
    this.args = parsed.args;

    return this.parseArgs(this.args, parsed.unknown);
  },

  /**
   * Normalize `args`, splitting joined short flags. For example
   * the arg "-abc" is equivalent to "-a -b -c".
   * This also normalizes equal sign and splits "--abc=def" into "--abc def".
   *
   * @param {Array} args
   * @return {Array}
   * @api private
   */
  normalize: function(args) {
    const ret = [];
    let arg;
    let lastOpt;
    let index;

    for(let i = 0, len = args.length; i < len; ++i) {
      arg = args[ i ];
      if ( i > 0 ) {
        lastOpt = this.optionFor(args[ i - 1 ]);
      }

      if ( arg === "--" ) {
        // Honor option terminator
        ret.push(args.slice(i)[ 0 ]);
        break;
      }
      else if ( lastOpt && lastOpt.required ) {
        ret.push(arg);
      }
      else if ( arg.length > 1 && arg[ 0 ] === "-" && arg[ 1 ] !== "-" ) {
        arg.slice(1).split("").forEach(function(c) {
          ret.push("-" + c);
        });
      }
      else if ( /^--/.test(arg) && ~(index = arg.indexOf("=")) ) {
        // todo check this. using item instead of array for now
        ret.push(arg.slice(0, index)[ 0 ], arg.slice(index + 1)[ 0 ]);
      }
      else {
        ret.push(arg);
      }
    }

    return ret;
  },

  /**
   * Parse command `args`.
   *
   * When listener(s) are available those
   * callbacks are invoked, otherwise the "*"
   * event is emitted and those actions are invoked.
   *
   * @param {Array} args
   * @param unknown
   * @return {Command} for chaining
   * @api private
   */
  parseArgs: function(args, unknown) {
    //    let name;

    if ( !args.length ) {
      outputHelpIfNecessary(this, unknown);

      // If there were no args and we have unknown options,
      // then they are extraneous and we need to error.
      if ( unknown.length > 0 ) {
        this.unknownOption(unknown[ 0 ]);
      }
    }

    return this;
  },

  /**
   * Return an option matching `arg` if any.
   *
   * @param {String} arg
   * @return {Option}
   * @api private
   */
  optionFor: function(arg) {
    for(let i = 0, len = this.options.length; i < len; ++i) {
      if ( this.options[ i ].is(arg) ) {
        return this.options[ i ];
      }
    }
  },

  /**
   * Parse options from `argv` returning `argv`
   * void of these options.
   *
   * @param {Array} argv
   * @return *
   * @api public
   */
  parseOptions: function(argv) {
    let args = [],
      len = argv.length,
      literal,
      option,
      arg;

    let unknownOptions = [];

    // parse options
    for(let i = 0; i < len; ++i) {
      arg = argv[ i ];

      // literal args after --
      if ( literal ) {
        args.push(arg);
        continue;
      }

      if ( arg === "--" ) {
        literal = true;
        continue;
      }

      // find matching Option
      option = this.optionFor(arg);

      // option is defined
      if ( option ) {
        // requires arg
        if ( option.required ) {
          arg = argv[ ++i ];
          if ( arg == null ) return this.optionMissingArgument(option);
          this.emit("option:" + option.name(), arg);
          // optional arg
        }
        else if ( option.optional ) {
          arg = argv[ i + 1 ];
          if ( arg == null || (arg[ 0 ] === "-" && arg !== "-") ) {
            arg = null;
          }
          else {
            ++i;
          }
          this.emit("option:" + option.name(), arg);
          // bool
        }
        else {
          this.emit("option:" + option.name());
        }
        continue;
      }

      // looks like an option
      if ( arg.length > 1 && arg[ 0 ] === "-" ) {
        unknownOptions.push(arg);

        // If the next argument looks like it might be
        // an argument for this option, we pass it on.
        // If it isn't, then it'll simply be ignored
        if ( (i + 1) < argv.length && argv[ i + 1 ][ 0 ] !== "-" ) {
          unknownOptions.push(argv[ ++i ]);
        }
        continue;
      }

      // arg
      args.push(arg);
    }

    return { args: args, unknown: unknownOptions };
  },

  /**
   * `Option` is missing an argument, but received `flag` or nothing.
   *
   * @param {*} option
   * @param {String} [flag]
   * @api private
   */
  optionMissingArgument: function(option, flag) {
    err();
    if ( flag ) {
      err(`  ?y${text.optionError}:?w ${text.optionOption} "?c${option.flags}?w" ${text.optionArgMissing}, ${text.optionGot} "${flag}"?R`);
    }
    else {
      err(`  ?y${text.optionError}:?w ${text.optionOption} "?c${option.flags}?w" ${text.optionArgMissing}?R`);
    }
    err();
    process.exit(1);
  },

  /**
   * Unknown option `flag`.
   *
   * @param {String} flag
   * @api private
   */
  unknownOption: function(flag) {
    if ( this._allowUnknownOption ) return;
    err();
    err(`  ?y${text.optionError}:?w ${text.optionUnknownOption} "?c${flag}?w"?R`);
    err();
    process.exit(1);
  },

  /**
   * Set the program version to `str`.
   *
   * This method auto-registers the "-V, --version" flag
   * which will print the version number when passed.
   *
   * @param {String} str
   * @param {String} [flags]
   * @return {Command} for chaining
   * @api public
   */
  version: function(str, flags) {
    if ( arguments.length === 0 ) return this._version;
    this._version = str;
    flags = flags || "-v, --version";
    const versionOption = new Option(flags, text.optionOutputVersion);
    this._versionOptionName = versionOption.long.substr(2) || "version";
    this.options.push(versionOption);
    this.on("option:" + this._versionOptionName, () => {
      log(str);
      process.exit(0);
    });
    return this;
  },

  /**
   * Set the description to `str`.
   *
   * @param {String} [str]
   * @param {Object} [argsDescription]
   * @return {Command}
   * @api public
   */
  description: function(str, argsDescription) {
    if ( !arguments.length ) return this._description;
    this._description = str;
    this._argsDescription = argsDescription;
    return this;
  },

  /**
   * Set / get the command usage `str`.
   *
   * @param {String} [str]
   * @return {String|Command}
   * @api public
   */
  usage: function(str) {
    const args = this._args.map(arg => humanReadableArgName(arg));

    let usage = `[${lang.options}]` +
      (this._args.length ? " " + args.join(" ") : "");

    if ( !arguments.length ) return this._usage || usage;
    this._usage = str;

    return this;
  },

  /**
   * Get or set the name of the command
   *
   * @param {String} str
   * @return {String|Command}
   * @api public
   */
  name: function(str) {
    if ( !arguments.length ) return this._name;
    this._name = str;
    return this;
  },

  /**
   * Return the largest option length.
   *
   * @return {Number}
   * @api private
   */
  largestOptionLength: function() {
    const options = [].concat(this.options);
    options.push({
      flags: "-h, --help"
    });
    return options.reduce((max, option) => Math.max(max, option.flags.length), 0);
  },

  /**
   * Return the largest arg length.
   *
   * @return {Number}
   * @api private
   */
  largestArgLength: function() {
    return this._args.reduce((max, arg) => Math.max(max, arg.name.length), 0);
  },

  /**
   * Return the pad width.
   *
   * @return {Number}
   * @api private
   */
  padWidth: function() {
    let width = this.largestOptionLength();
    if ( this._argsDescription && this._args.length ) {
      if ( this.largestArgLength() > width ) {
        width = this.largestArgLength();
      }
    }

    if ( this.commands && this.commands.length ) {
      if ( this.largestCommandLength() > width ) {
        width = this.largestCommandLength();
      }
    }

    return width;
  },

  /**
   * Return help for options.
   *
   * @return {String}
   * @api private
   */
  optionHelp: function() {
    const width = this.padWidth();

    function colorArg(option) {
      let i = option.indexOf("<");
      if ( i >= 0 ) {
        return option.substr(0, i) + "?y" + option.substr(i);
      }
      i = option.indexOf("[");
      if ( i >= 0 ) {
        return option.substr(0, i) + "?g" + option.substr(i);
      }
      return option;
    }

    // Append the help information
    return this.options.map(option => {
        const def = option.bool && option.defaultValue !== undefined ? ` (?g${text.optionDefault}: ${JSON.stringify(option.defaultValue)}?R)` : "";
        return `?c${colorArg(pad(option.flags, width))}?R  ${option.description}${def}`;
      })
      .concat([ `?c${pad("-h, --help", width)}?R  ${text.optionOutputUsage}` ])
      .join("\n");
  },

  /**
   * Return program help documentation.
   *
   * @return {String}
   * @api private
   */
  helpInformation: function() {
    const desc = [];
    if ( this._description && !this.minihelp ) {
      desc.push(
        "  ?b" + this._description,
        "?R"
      );

      const argsDescription = this._argsDescription;
      if ( argsDescription && this._args.length ) {
        const width = this.padWidth();
        desc.push(
          "  " + text.optionArguments + ":",
          "");
        this._args.forEach(arg => {
          desc.push(`    ?c${pad(arg.name, width)}?R  ${argsDescription[ arg.name ]}`);
        });
        desc.push("");
      }
    }

    const usage = this.minihelp ? [ "" ] : [
      "",
      "  ?C" + text.optionUsage + `: ?w${basename} ?g${this.usage()}?R`,
      "  ?C" + text.optionUsage + `: ?w${basename2} ?g${this.usage()}?R`,
      ""
    ];

    const options = this.minihelp ? [
      "" + this.optionHelp().replace(/^/gm, "  ")
    ] : [
      "  ?w" + text.optionOptions + ":?R",
      "",
      "" + this.optionHelp().replace(/^/gm, "    "),
      ""
    ];

    return usage
      .concat(desc)
      .concat(options)
      .join(lf);
  },

  /**
   * Output help information for this command
   *
   * @api public
   */
  outputHelp: function(cb) {
    if ( !cb ) {
      cb = (passthrue) => passthrue;
    }
    log(cb(this.helpInformation()));
    this.emit("--help");
  },

  /**
   * Output help information and exit.
   *
   * @api public
   */
  help: function(cb) {
    this.outputHelp(cb);
    process.exit();
  }
};

/**
 * Camel-case the given `flag`
 *
 * @param {String} flag
 * @return {String}
 * @api private
 */
function camelcase(flag) {
  return flag.split("-").reduce((str, word) => str + word[ 0 ].toUpperCase() + word.slice(1));
}

/**
 * Pad `str` to `width`.
 *
 * @param {String} str
 * @param {Number} width
 * @return {String}
 * @api private
 */
function pad(str, width) {
  return str.padEnd(width);
}

/**
 * Output help information if necessary
 *
 * @api private
 * @param cmd
 * @param [options]
 */
function outputHelpIfNecessary(cmd, options) {
  options = options || [];
  for(let option of options) {
    if ( option === "--help" || option === "-h" ) {
      cmd.outputHelp();
      process.exit();
    }
  }
}

/**
 * Takes an argument an returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @return {String}
 * @api private
 */
function humanReadableArgName(arg) {
  const nameOutput = arg.name; // + (arg.variadic === true ? "..." : "");
  return arg.required
         ? "<" + nameOutput + ">"
         : "[" + nameOutput + "]";
}

/**
 * Inherit `Command` from `EventEmitter.prototype`.
 */
require("util").inherits(Command, EventEmitter);

/**
 * Expose the root command.
 */
exports = module.exports = new Command();

/**
 * Expose `Command`.
 */
exports.Command = Command;

/**
 * Expose `Option`.
 */
exports.Option = Option;

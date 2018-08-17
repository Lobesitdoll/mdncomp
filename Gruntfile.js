module.exports = (grunt) => {

  grunt.initConfig({
    uglify: {
      my_target: {
        options: {
          output: {
            comments: /(?:^!|@(?:license|preserve|cc_on))/
          }
        },
        files: {
          "bin/mdncomp.js"               : ["src/mdncomp.js"],
          "build/core.ansi.js"           : ["src/core.ansi.js"],
          "build/core.io.js"             : ["src/core.io.js"],
          "build/core.locale.js"         : ["src/core.locale.js"],
          "build/core.table.js"          : ["src/core.table.js"],
          "build/core.update.js"         : ["src/core.update.js"],
          "build/core.utils.js"          : ["src/core.utils.js"],
          "build/formatter.common.js"    : ["src/formatter.common.js"],
          "build/formatter.long.js"      : ["src/formatter.long.js"],
          "build/formatter.short.js"     : ["src/formatter.short.js"],
          "build/help.options.js"        : ["src/help.options.js"],
          "build/init.config.js"         : ["src/init.config.js"],
          "build/init.help.js"           : ["src/init.help.js"],
          "build/init.options.js"        : ["src/init.options.js"],
          "build/option.browser.js"      : ["src/option.browser.js"],
          "build/option.list.js"         : ["src/option.list.js"],
          "build/option.random.js"       : ["src/option.random.js"],
          "build/option.search.js"       : ["src/option.search.js"]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify-es");
  grunt.registerTask("default", ["uglify"]);
};
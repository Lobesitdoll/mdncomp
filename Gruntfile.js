module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      my_target: {
        options: {
          output: {
            comments: /(?:^!|@(?:license|preserve|cc_on))/
          }
        },
        files: {
          "bin/mdncomp.min.js"           : ["bin/mdncomp.js"],
          "build/init.options.js"        : ["src/init.options.js"],
          "build/init.config.js"         : ["src/init.config.js"],
          "build/init.help.js"           : ["src/init.help.js"],
          "build/core.ansi.js"           : ["src/core.ansi.js"],
          "build/core.utils.js"          : ["src/core.utils.js"],
          "build/core.io.js"             : ["src/core.io.js"],
          "build/core.update.js"         : ["src/core.update.js"],
          "build/help.options.js"        : ["src/help.options.js"],
          "build/option.search.js"       : ["src/option.search.js"],
          "build/option.browser.js"      : ["src/option.browser.js"],
          "build/option.list.js"         : ["src/option.list.js"],
          "build/option.doc.tagparser.js": ["src/option.doc.tagparser.js"],
          "build/formatter.common.js"    : ["src/formatter.common.js"]
//          "build/build.min.js": [
//            "src/core.js",
//            "src/core.polyfills.js",
//            "src/core.globals.js",
//            "src/help.parse.js",
//            "src/core.init.js",
//            "src/option.search.js",
//            "src/option.list.js",
//            "src/option.browser.js",
//            "src/option.doc.js",
//            "src/option.random.js",
//            "src/formatter.long.js",
//            "src/formatter.short.js",
//            "src/compat.mdncomp.js",
//            "src/compat.info.js",
//            "src/compat.browser.js",
//            "src/core.output.js"
//          ]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify-es");
  grunt.registerTask("default", ["uglify"]);
};
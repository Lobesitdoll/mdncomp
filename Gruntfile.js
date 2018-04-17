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
          "build/ansi.js": ["src/core.ansi.js"],
          "build/help.js": ["src/help.options.js"],
          "build/io.js": ["src/core.io.js"],
          "build/update.js": ["src/core.update.js"],
          "build/tagparser.js": ["src/option.doc.tagparser.js"],
          "build/build.min.js": [
            "src/core.js",
            "src/core.polyfills.js",
            "src/core.globals.js",
            "src/help.parse.js",
            "src/core.init.js",
            "src/option.search.js",
            "src/option.list.js",
            "src/option.browser.js",
            "src/option.doc.js",
            "src/option.random.js",
            "src/formatter.long.js",
            "src/formatter.short.js",
            "src/compat.mdncomp.js",
            "src/compat.info.js",
            "src/compat.browser.js",
            "src/core.output.js"
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify-es");
  grunt.registerTask("default", ["uglify"]);
};
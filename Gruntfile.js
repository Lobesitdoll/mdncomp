module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      my_target: {
        options: {
          output: {
            comments:  /(?:^!|@(?:license|preserve|cc_on))/
          }
        },
        files: {
          "build/build.min.js": [
            "src/core.js",
            "src/core.globals.js",
            "src/core.init.js",
            "src/core.io.js",
            "src/core.update.js",
            "src/option.search.js",
            "src/option.list.js", "" +
            "src/formatter.long.js",
            "src/formatter.short.js",
            "src/formatter.svg.js",
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
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*!\n' + 
                   ' * game-of-life <%= grunt.template.today("yyyy-mm-dd") %> (<%= pkg.homepage %>)\n' +
                   ' * Copyright (c) <%= grunt.template.today("yyyy") %> ho! <%= pkg.author %>\n' +
                   ' */\n\n',
        report: 'gzip'
      },
      dist: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};

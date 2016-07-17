/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= pkg.license %> */\n',
    srcFolder: 'app',
    buildFolder: 'dist',
    // Task configuration.
    copy: {
      main: {
        files: [
            {
              expand: true,
              src: ['app/*', 'app/fonts/**', 'app/img/**', 'app/partials/**'],
              dest: 'dist/',
              filter: 'isFile'
            },
          ],
        },
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true,
        separator: '\n\n'
      },
      dist: {
        files: {
          'app/app.js': ['app/js/*.js', 'app/js/**/*.js', 'app/js/**/**/*.js'],
          'app/app.css': ['app/css/*.css']
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: false
      },
      dist: {
        src: 'app/app.js',
        dest: 'dist/app/app.min.js'
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/app/app.min.css': ['app/app.css']
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          document: true,
          console: true,
          angular: true,
          jQuery: true,
          $: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      app: {
        src: ['app/js/*.js', 'app/js/app/*.js', 'app/js/app/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      app: {
        files: '<%= jshint.app.src %>',
        tasks: ['jshint:app']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Skip jshint task
  grunt.registerTask('force', ['copy', 'concat', 'uglify', 'cssmin']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'copy', 'concat', 'uglify', 'cssmin']);

};

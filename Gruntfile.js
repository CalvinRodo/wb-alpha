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
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
     /* Concatination of builds
    =====================================*/
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
     /* Custom Project builds - Universal for Framework -
    =====================================*/
     modernizr: {
          // [REQUIRED] Path to the build you're using for development.
        "devFile" : "remote",
        // [REQUIRED] Path to save out the built file.
        "outputFile" : "lib/custom/modernizr-custom.js",
        // Based on default settings on http://modernizr.com/download/
        "extra" : {
            "shiv" : true,
            "printshiv" : false,
            "load" : true,
            "mq" : false,
            "css3": true,
            "html5": true,
            "cssclasses" : true,
            "fontface": true,
            "backgroundsize" : true,
            "borderimage" : true,
            // continue with all tests
        },
         // Based on default settings on http://modernizr.com/download/
        "extensibility" : {
            "addtest" : false,
            "prefixed" : false,
            "teststyles" : true,
            "testprops" : true,
            "testallprops" : true,
            "hasevents" : true,
            "prefixes" : true,
            "domprefixes" : true
        },
        // Define any tests you want to impliticly include.
        "tests" : [],
        // By default, this task will crawl your project for references to Modernizr tests.
        // Set to false to disable.
        "parseFiles" : false,
        // When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
        // You can override this by defining a "files" array below.
        // "files" : [],
        // When parseFiles = true, matchCommunityTests = true will attempt to
        // match user-contributed tests.
        "matchCommunityTests" : false,
        // Have custom Modernizr tests? Add paths to their location here.
        "customTests" : []
    },
    /* Cleaning the builds
    =====================================*/
    clean: {
      build: ["build", "dist"],
      reset: ["build", "dist", "lib"]
    },
     /* Dependency management
    =====================================*/
    bowerful: {
       dist: {
           packages: {
                bootstrap: '3.0.0-rc1',
                jquery: '2.0.3',
              },
            store: 'lib/current',
        },
        oldie: {
          packages: {
                jquery: '1.10.2',
                respond: '1.2.0',
                selectivizr: '1.0.2'
          },
          store: 'lib/oldie',
        }
    },
     /* Coffeescript
    =====================================*/
    coffee: {
      compileBare: {
                options: {
                    bare: true
                },
                files: [
                    { 'build/js/vapour.js': 'js/core/vapour.coffee' },
                    {'path/to/wet-boew.js': ['js/plugins/*.coffee'] }

                ]
      }
    },

    /* Sass Compile
    ===================================== */
    sass: {
           /* Wet Base Compile
            ===================================== */
        base: {
            options: {
                outputStyle: 'nested'
            },
            files: {
                'build/css/base.css': 'sass/*.scss'
            }
        },
           /* Themes Compile
            ===================================== */
        themes: {
          options: {
            outputStyle: 'nested'
          },
          files: grunt.file.expandMapping(['themes/**/sass/*.scss'],'build/',{
              rename: function(destBase,destPath) {
                destPath = destBase + destPath;
                destPath = destPath.replace('/sass', '/css');
                return destPath.replace(/\.scss$/,".css");
              }  
            })
          }
    },

     /* Build Merging
    =====================================*/
    copy: {
      main: {
        files: [
         {expand:true, flatten: true, src: ['js/polyfills/*.js'], dest: 'build/js/polyfills/',filter: 'isFile'},
         {expand:true, flatten: true, src: ['lib/current/jquery/jquery*.js'], dest: 'build/js/', filter: 'isFile'},
         {expand:true, flatten: true, src: ['lib/custom/*.js'], dest: 'build/js/', filter: 'isFile'},
         {expand:true, flatten: true, src: ['lib/oldie/jquery/jquery*.js'], dest: 'build/js/oldie/', filter: 'isFile'},
         {expand:true, flatten: true, src: ['lib/oldie/respond/*.min.js'], dest: 'build/js/oldie/', filter: 'isFile'},
         {expand:true, flatten: true, src: ['lib/oldie/selectivizr/*.js'], dest: 'build/js/oldie/', filter: 'isFile'}
        ]
      }
    },
     /* Minifaction
    =====================================*/
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
     /* Ruleset
    =====================================*/
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
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bowerful');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks("grunt-modernizr");



  // Default task.
  grunt.registerTask('default', ['coffee', 'sass', 'copy', 'concat', 'uglify']);
  grunt.registerTask('init', ['clean:build','bowerful', 'modernizr']);
  grunt.registerTask('reset', ['clean:reset','bowerful', 'modernizr']);


};

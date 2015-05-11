module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    // configure jshint to validate js files -----------------------------------
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: ['Grunfile.js', 'js/*.js'],
    },

    // configure uglify to minify js files -------------------------------------
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/js/nodemon.min.js': ['js/main.js','js/controllers/login.js']
        }
      }  
    },

// compile sass stylesheets to css -----------------------------------------
    sass: {
      build: {
        files: {
          'css/screen.css': 'css/sass/screen.scss'
        }
      }
    },

    // configure cssmin to minify css files ------------------------------------
    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/css/nodebook.min.css': 'css/screen.css','css/main.css'
        }
      }
    },

    // configure watch to auto update ------------------------------------------
    watch: {
      stylesheets: {
        files: ['css/**/*.css', 'css/**/*.scss'],
        tasks: ['sass', 'cssmin']
      },
      scripts: {
        files: 'js/**/*.js',
        tasks: ['jshint', 'uglify']
      }
    }

  });

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  grunt.loadNpmTasks('grunt-contrib-jshint');  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-serve');


  // ===========================================================================
  // CREATE TASKS ==============================================================
  // ===========================================================================
  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin','sass']);
  // this task will only run the test configuration 
  grunt.registerTask('test', ['jshint', 'sass']);

  // only run production configuration 
  grunt.registerTask('production', ['jshint:production', 'uglify:production', 'cssmin:production', 'less:production']);


};
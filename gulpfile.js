(() => {

  'use strict';

  /**************** Gulp.js 4 configuration ****************/

  const

    // development or production
    devBuild  = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development'),

    // modules
    gulp            = require('gulp'),
    del             = require('del'),
    noop            = require('gulp-noop'),
    size            = require('gulp-size'),
    sass            = require('gulp-sass'),
    sassGlob        = require('gulp-sass-glob'),
    autoprefixer    = require('autoprefixer'),
    objectFitImages = require('postcss-object-fit-images'),
    cssnano         = require('cssnano'),
    postcss         = require('gulp-postcss'),
    sourcemaps      = require('gulp-sourcemaps');

  console.log('Gulp', devBuild ? 'development' : 'production', 'build');


  /**************** clean task ****************/

  function clean() {

    return del([ 'css' ]);

  }
  exports.clean = clean;

  /**************** CSS task ****************/

  const cssConfig = {

    src         : 'scss/{,*/}*.{scss,sass}',
    watch       : 'scss/{,*/}*.{scss,sass}',
    build       : 'css/',
    plugins:    [
      autoprefixer(),
      objectFitImages(),
      cssnano()
    ],
    sassOpts: {
      sourceMap       : true,
      outputStyle     : 'nested',
      includePaths:   [ 'node_modules/modularscale-sass/stylesheets' ],
      precision       : 2,
      errLogToConsole : true
    }

  };

  function css() {

    return gulp.src(cssConfig.src)
      .pipe(sourcemaps ? sourcemaps.init() : noop())
      .pipe(sassGlob())
      .pipe(sass(cssConfig.sassOpts).on('error', sass.logError))
      .pipe(postcss(cssConfig.plugins))
      .pipe(sourcemaps ? sourcemaps.write('.') : noop())
      .pipe(size({ showFiles:true }))
      .pipe(gulp.dest(cssConfig.build));

  }
  exports.css = gulp.series(clean, css);

  /**************** watch task ****************/

  function watch(done) {

    // CSS changes
    gulp.watch(cssConfig.watch, css);

    done();

  }

  /**************** default task ****************/

  exports.default = gulp.series(exports.css, watch);
})();
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
    postcss         = require('gulp-postcss'),
    sourcemaps      = require('gulp-sourcemaps'),
    concat          = require('gulp-concat'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify');

  console.log('Gulp', devBuild ? 'development' : 'production', 'build');


  /**************** clean tasks ****************/

  function cleanCSS() {

    return del([ 'css' ]);

  }
  exports.cleanCSS = cleanCSS;

  function cleanJS() {

    return del([ 'js' ]);

  }
  exports.cleanJS = cleanJS;

  /**************** CSS task ****************/

  const cssConfig = {

    src         : 'scss/{,*/}*.{scss,sass}',
    watch       : 'scss/{,*/}*.{scss,sass}',
    build       : 'css/',
    plugins:    [
      autoprefixer(),
      objectFitImages()
    ],
    sassOpts: {
      sourceMap       : true,
      outputStyle     : 'nested',
      includePaths:   [ 'node_modules/modularscale-sass/stylesheets' ],
      precision       : 2,
      errLogToConsole : true
    }

  };

  const jsConfig = {
    src:                'node_modules/dcf/js/',
    minifiedFileName:   'dcf.min.js',
    compileJs:          true
  }

  // List of DCF Modules to process comment out or remove unwanted modules
  // Values must match file names in `node_modules/dcf/js`
  const jsModules = [
    'dcf-cardAsLink.js',
    'dcf-datepicker.js',
    'dcf-lazyLoad.js',
    'dcf-modal.js',
    'dcf-navMenuToggle.js',
    'dcf-slideshow.js',
    'dcf-table.js',
    'dcf-tabs.js',
    'dcf-utility.js'  // Always include due to dependency with of some modules
  ]

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
  exports.css = gulp.series(cleanCSS, css);

  function vendorJS(cb) {
    // copy body-scroll-lock
    gulp.src('node_modules/body-scroll-lock/lib/bodyScrollLock.min.js')
      .pipe(gulp.dest('js/vendor/'));

    // copy object-fit-images
    const objectFitImagesSrc = '';
    gulp.src('node_modules/object-fit-images/dist/ofi.min.js')
      .pipe(gulp.dest('js/vendor/'));

    cb();
  }
  exports.vendorJS = vendorJS;

  function js(done) {

    let jsFiles = [];
    if (jsConfig.compileJs) {
      // Note: Always include DCFUtility since some modules are depended on
      jsModules.forEach((module) => {
        console.log('Including module ' + module + '...');
        jsFiles.push(jsConfig.src + module);
      });
    }

    if (jsFiles.length) {
      return gulp.src(jsFiles)
        .pipe(plumber())
        // Transpile the JS code using Babel's preset-env.
        .pipe(babel({
          presets: [
            ['@babel/env', {
              modules: false
            }]
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        }))
        .pipe(concat(jsConfig.minifiedFileName))
        .pipe(uglify())
        .pipe(gulp.dest('js/'));
    } else {
      done();
    }
  }
  exports.js = js;

  /**************** watch task ****************/

  function watch(done) {

    // CSS changes
    gulp.watch(cssConfig.watch, css);

    done();
  }

  /**************** default task ****************/
  exports.scripts =  gulp.series(exports.cleanJS, exports.js, exports.vendorJS);
  exports.styles = gulp.series(exports.css, watch);
  exports.default = gulp.series(gulp.parallel(exports.scripts, exports.styles));

})();

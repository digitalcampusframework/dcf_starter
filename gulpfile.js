const { series, parallel, src, dest, watch } = require('gulp');
const noop          = require('gulp-noop');
const sass            = require('gulp-sass')(require('sass'));
const sassGlob        = require('gulp-sass-glob');
const postcss         = require('gulp-postcss');
const autoprefixer = require('autoprefixer')
const sourcemaps      = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');

const devBuild  = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development');

const cssConfig = {
    src         : 'scss/{,*/}*.{scss,sass}',
    watch       : 'scss/{,*/}*.{scss,sass}',
    build       : 'css/',
    plugins     : [ 
        autoprefixer()
    ],
    sassOpts: {
        sourceMap       : true,
        outputStyle     : 'compressed',
        includePaths:   [ 'node_modules/modularscale-sass/stylesheets' ],
        precision       : 2,
        errLogToConsole : true
    }
};

const jsConfig = {
    src:                'node_modules/dcf/js/',
    compileJs:          true
}

// List of DCF Modules to process comment out or remove unwanted modules
// Values must match file names in `node_modules/dcf/js`
const jsModules = [
    'dcf-cardAsLink.js',
    'dcf-autoplayVideoToggle.js',
    'dcf-datepicker.js',
    'dcf-lazyLoad.js',
    'dcf-modal.js',
    'dcf-navMenuToggle.js',
    'dcf-notice.js',
    'dcf-pagination.js',
    'dcf-slideshow.js',
    'dcf-table.js',
    'dcf-tabs.js',
    'dcf-utility.js'  // Always include due to dependency with of some modules
];

function css() {
    return src(cssConfig.src)
        .pipe(sourcemaps ? sourcemaps.init() : noop())
        .pipe(sassGlob())
        .pipe(sass(cssConfig.sassOpts).on('error', sass.logError))
        .pipe(postcss(cssConfig.plugins))
        .pipe(sourcemaps ? sourcemaps.write('.') : noop())
        .pipe(dest(cssConfig.build));
}
exports.css = css;

function vendorJS(cb) {
    // copy body-scroll-lock
    src('node_modules/body-scroll-lock/lib/bodyScrollLock.min.js')
        .pipe(dest('js/vendor/'));

    // copy requirejs
    src('node_modules/requirejs/require.js')
        .pipe(dest('js/vendor/'));

    cb();
}
exports.vendorJS = vendorJS;

function localJS(done) {
    return src('./js-src/*js')
        .pipe(plumber())
        // Transpile the JS code using Babel's preset-env.
        .pipe(babel({
        presets: [
            ['@babel/env', {
            modules: false
            }]
        ]
        }))
        .pipe(uglify())
        .pipe(dest('js/'));
}
exports.localJS = localJS;

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
        return src(jsFiles)
        .pipe(plumber())
        // Transpile the JS code using Babel's preset-env.
        .pipe(babel({
            presets: [
            ['@babel/env', {
                modules: 'amd'
            }]
            ]
        }))
        .pipe(uglify())
        .pipe(dest('js/'));
    } else {
        done();
    }
}
exports.js = js;

exports.scripts =  series(exports.js, exports.vendorJS, exports.localJS);
exports.styles = series(exports.css);
exports.default = series(parallel(exports.scripts, exports.styles));
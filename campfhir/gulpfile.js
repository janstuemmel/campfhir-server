var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require("gulp-notify");

var scriptsDir = './app';
var buildDir = './public';
var assets = [
  { name: 'bootstrap', base: './node_modules/bootstrap/dist', files: '**/*.+(min.css|min.css.map|svg|ttf|woff|eot|woff2)' },
];

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end');
}

function buildScript(file, watch) {
  var props = {
    entries: [ [scriptsDir, file].join('/') ],
    debug: true,
    cache: {},
    packageCache: {}
  };
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  bundler.transform(babelify);

  function rebundle() {

    var stream = bundler.bundle();

    return stream.on('error', handleErrors)
      .pipe(source(file))
      .pipe(buffer())
        .pipe(gulpif( !watch, sourcemaps.init( { loadMaps: true } )))
        .pipe(gulpif( !watch, uglify({ output: { ascii_only: true, max_line_len: 100000 } })))
        .pipe(gulpif( !watch, sourcemaps.write('./')))
      .pipe(gulp.dest(buildDir + '/'));
  }

  bundler.on('update', function() {
    var t0 = Date.now();
    rebundle();
    gutil.log('Rebundle...', Date.now() - t0, 'ms');
  });

  return rebundle();
}

gulp.task('assets', function() {

  assets.forEach(function(module) {
    gulp.src([module.base, module.files].join('/'), { base: module.base }).
      pipe(gulp.dest([buildDir, 'lib', module.name].join('/')));
  });
});

gulp.task('build', function() {
  return buildScript('main.js', false);
});

gulp.task('default', ['build'], function() {
  return buildScript('main.js', true);
});

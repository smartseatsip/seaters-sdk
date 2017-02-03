var gulp = require('gulp');
var webdriver = require('gulp-webdriver');
var debug = require('gulp-debug');
var webpack = require('webpack-stream');
var clean = require('gulp-clean');
var typescript = require('gulp-typescript');
var jasmine = require('gulp-jasmine');
var replace = require('gulp-replace');

// var through = require('through2');
var http = require('http');
// var proxy = require('http-proxy-middleware');
var connect  = require('connect');
var serveStatic = require('serve-static');
// var rp = require('request-promise');
// var fs = require('fs');
var runSequence = require('run-sequence');//needed pre gulp4.0

var server = undefined;

gulp.task('clean', function() {
  return gulp.src(['lib', 'dist', 'errorShots', 'tmp'], {read:false})
    .pipe(clean());
});

gulp.task('build:bundle', [], function() {
  return gulp.src('src/index.ts')
    .pipe(webpack(require('./conf/webpack-bundle.config.js')))
    .pipe(gulp.dest('.'));
});

gulp.task('build:bundle-min', [], function() {
  return gulp.src('src/index.ts')
    .pipe(webpack(require('./conf/webpack-bundle-min.config.js')))
    .pipe(gulp.dest('.'));
});

gulp.task('build:module', [], function() {
  return gulp.src('src/index.ts')
    .pipe(webpack(require('./conf/webpack-module.config.js')))
    .pipe(gulp.dest('.'));
});

gulp.task('build:mock-bundle', [], function() {
  return gulp.src('mock-data/index.ts')
    .pipe(webpack(require('./conf/webpack-mock-bundle.config.js')))
    .pipe(gulp.dest('.'));
});

gulp.task('build:mock-module', [], function() {
  return gulp.src('mock-data/index.ts')
    .pipe(webpack(require('./conf/webpack-mock-module.config.js')))
    .pipe(gulp.dest('.'));
});

var tsconfig = require('./tsconfig.json');
gulp.task('build:typings', [], function() {
  return gulp.src(tsconfig.files.concat('src/**/*.ts','!**/*.spec.ts'))
    .pipe(typescript(tsconfig.compilerOptions))
    .dts.pipe(gulp.dest('./dist/'));
});

function replaceVersion(src) {
  var packageVersion = require('./package.json').version;
  return gulp.src(src||[
    'src/index.ts',
    'typings/index.d.ts'
  ])
    .pipe(replace('${package.version}', packageVersion));
}

gulp.task('http', function(done) {
  var app = connect()
    .use(serveStatic('./e2e-browser/fixtures'))
    .use(serveStatic('./dist'))
    .use('/examples', serveStatic('./examples'));

   server = http.createServer(app).listen(3000, done);
});

gulp.task('test:e2e-browser', ['build:bundle', 'http'], function() {
  return gulp.src('./conf/wdio.conf.js')
    .pipe(webdriver())
    .on('end', function() {
      server.close();
    });
});

gulp.task('test:e2e-node', ['build:module'], function() {
  return gulp.src('./e2e-node/**/*.spec.js')
    .pipe(jasmine());
});

gulp.task('build', [], cb => {
  runSequence(
    'clean',
    'build:bundle',
    'build:bundle-min',
    'build:module',
    'build:typings',
    'build:mock-bundle',
    'build:mock-module',
    cb
  );
});

gulp.task('test:e2e', ['test:e2e-browser', 'test:e2e-node']);

gulp.task('test:unit', []);//TODO

gulp.task('test', ['test:e2e', 'test:unit']);

gulp.task('default', ['test']);

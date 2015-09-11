var gulp = require('gulp');
var path = require('path');
var shell = require('gulp-shell');
var bundle = require('aurelia-bundler').bundle;

var paths = require('../paths');
var config = {
  force: true,
  packagePath: 'dist/sample',
  bundles: {
    "app": {
      includes: [
        'app/*',
        'app/*.html!text',
        'app/*.css!text',
        'whatwg-fetch'
      ],
      options: {
        inject: true,
        minify: true
      }
    },
    "aurelia": {
      includes: [
        'aurelia-bootstrapper',
        'github:aurelia/templating-binding',
        'github:aurelia/templating-resources',
        'github:aurelia/templating-router',
        'github:aurelia/loader-default',
        'github:aurelia/history-browser',
        'github:aurelia/logging-console'
      ],
      options: {
        inject: true,
        minify: true
      }
    },
    "aurelia-pagination": {
      includes: [
        'aurelia-pagination'
      ],
      excludes: [
        'github:aurelia/framework'
      ],
      options: {
        inject: true,
        minify: true
      }
    }
  }
};


gulp.task('copy-sample', ['clean', 'copy-sample-jspm'], function() {
  return gulp.src([paths.sample + '/config.js', paths.sample + '/package.json', paths.sample + '/index.html'])
    .pipe(gulp.dest(path.join(paths.output, 'sample')));
});

gulp.task('copy-sample-jspm', ['clean'], function() {
  return gulp.src(paths.sample + '/jspm_packages/**/*')
    .pipe(gulp.dest(path.join(paths.output, 'sample', 'jspm_packages')));
});

gulp.task('copy-dist', ['build'], function() {
  return gulp.src(paths.output + '/system/**/*.js')
    .pipe(gulp.dest(path.join(paths.output, 'sample', 'aurelia-pagination')));
})

gulp.task('bundle-sample', ['build-sample', 'copy-sample', 'copy-sample-jspm', 'copy-dist'], function () {
  return bundle(config);
});

// gulp.task('bundle-sample', ['build-sample', 'copy-sample-config', 'copy-sample-jspm'], shell.task([
//   '"' + path.join(process.cwd(), 'node_modules', '.bin', 'jspm') + '" bundle app/* + aurelia-bootstrapper app.js'
// ], {
//   cwd: path.join(process.cwd(), paths.output, 'sample')
// }));

gulp.task('dist', ['bundle-sample']);

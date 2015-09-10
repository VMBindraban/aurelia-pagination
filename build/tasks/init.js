var gulp = require('gulp');
var shell = require('gulp-shell');
var path = require('path');

var paths = require('../paths')

gulp.task('init', shell.task([
  '"' + path.join(process.cwd(), 'node_modules', '.bin', 'jspm') + '" install'
], {
  cwd: path.join(process.cwd(), paths.sample)
}));

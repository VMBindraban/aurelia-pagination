var gulp = require('gulp');
var browserSync = require('browser-sync');

var paths = require('../paths');
var consts = require('../consts');

// outputs changes to files to the console
function reportChange(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method. Also, by depending on the
// serve task, it will instantiate a browserSync session
gulp.task('watch', ['serve'], function() {
  console.log('Browser sync server name is: ', consts.browserSyncName);
  var bs = browserSync.get(consts.browserSyncName);

  gulp.watch(paths.source, ['build-amd', bs.reload]).on('change', reportChange);
  gulp.watch(paths.html, ['build-html-amd', bs.reload]).on('change', reportChange);
  gulp.watch(paths.sampleSource, ['build-sample', bs.reload]).on('change', reportChange);
  gulp.watch(paths.sampleHtml, ['build-html-sample', bs.reload]).on('change', reportChange);
  gulp.watch(paths.style, bs.reload).on('change', reportChange);
  gulp.watch(paths.sample + '/*', bs.reload).on('change', reportChange);
});

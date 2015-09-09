var gulp = require('gulp');
var browserSync = require('browser-sync');
var path = require('path');

var paths = require('../paths');
var consts = require('../consts');

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve', ['build'], function(done) {
  var bs = browserSync.create(consts.browserSyncName);

  bs.init({
    server: {
      baseDir: paths.sample,
      routes: {
        '/aurelia-pagination': path.join(paths.output, 'amd'),
      },
    },
  }, done);
});

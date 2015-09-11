var path = require('path');
var fs = require('fs');

var appRoot = 'src/';
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.js',
  sampleSource: 'sample/src/**/*.js',
  html: appRoot + '**/*.html',
  sampleHtml: 'sample/src/**/*.html',
  style: 'styles/**/*.css',
  output: 'dist',
  sample: 'sample',
  doc: 'doc',
  styleFolder: 'styles',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  packageName: pkg.name,
};

define(['exports', 'github:twbs/bootstrap@3.3.5/css/bootstrap.css!', 'whatwg-fetch'], function (exports, _githubTwbsBootstrap335CssBootstrapCss, _whatwgFetch) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function configure(aurelia) {
    aurelia.use.standardConfiguration().developmentLogging();

    aurelia.start().then(function (a) {
      return a.setRoot('app/app');
    });
  }
});
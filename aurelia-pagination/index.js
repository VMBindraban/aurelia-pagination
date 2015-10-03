System.register(['./paginated.js', './pagination-nav.js', './controller.js'], function (_export) {
  'use strict';

  return {
    setters: [function (_paginatedJs) {
      _export('PaginatedElement', _paginatedJs.PaginatedElement);
    }, function (_paginationNavJs) {
      _export('PaginationNavElement', _paginationNavJs.PaginationNavElement);
    }, function (_controllerJs) {
      _export('PaginationController', _controllerJs.PaginationController);
    }],
    execute: function () {}
  };
});
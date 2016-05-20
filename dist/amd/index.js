define(['exports', './paginated.js', './pagination-nav.js', './controller.js'], function (exports, _paginatedJs, _paginationNavJs, _controllerJs) {
  'use strict';

  exports.__esModule = true;
  exports.PaginatedElement = _paginatedJs.PaginatedElement;
  exports.PaginationNavElement = _paginationNavJs.PaginationNavElement;
  exports.PaginationController = _controllerJs.PaginationController;
});
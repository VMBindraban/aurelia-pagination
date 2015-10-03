define(['exports', 'aurelia-pagination'], function (exports, _aureliaPagination) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var numPages = 20;

  var App = (function () {
    function App() {
      var _this = this;

      _classCallCheck(this, App);

      this.title = 'Paginated!';

      this.controller = new _aureliaPagination.PaginationController(function (opts) {
        return _this.getItems(opts);
      });
    }

    App.prototype.getItems = function getItems(_ref) {
      var _ref$page = _ref.page;
      var page = _ref$page === undefined ? 0 : _ref$page;
      var _ref$pageSize = _ref.pageSize;
      var pageSize = _ref$pageSize === undefined ? 10 : _ref$pageSize;

      return fetch('https://api.imgur.com/3/gallery/hot/viral/' + page + '.json', {
        headers: {
          'Authorization': 'Client-ID c8e140c5402bbb8'
        }
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        var data = result.data.filter(function (i) {
          return !i.is_album;
        }).slice(0, pageSize);

        return { data: data, numPages: numPages };
      });
    };

    App.prototype.reset = function reset() {
      this.controller.reset();
    };

    return App;
  })();

  exports.App = App;
});
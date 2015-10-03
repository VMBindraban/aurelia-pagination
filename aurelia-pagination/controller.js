System.register([], function (_export) {
  'use strict';

  var _fetch, _subscriptions, PaginationController;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [],
    execute: function () {
      _fetch = Symbol('fetch');
      _subscriptions = Symbol('subscriptions');

      PaginationController = (function () {
        function PaginationController(getData) {
          _classCallCheck(this, PaginationController);

          this[_fetch] = getData;
          this[_subscriptions] = [];
        }

        PaginationController.prototype.getData = function getData(_ref) {
          var page = _ref.page;
          var pageSize = _ref.pageSize;

          return this[_fetch]({ page: page, pageSize: pageSize });
        };

        PaginationController.prototype.subscribe = function subscribe(fn) {
          var _this = this;

          this[_subscriptions].push(fn);

          var disposed = false;
          return function () {
            if (!disposed) {
              disposed = true;
              var index = _this[_subscriptions].indexOf(fn);
              if (index !== -1) {
                _this[_subscriptions].splice(1);
              }
            }
          };
        };

        PaginationController.prototype.reset = function reset(opts) {
          this[_subscriptions].forEach(function (fn) {
            return fn(opts);
          });
        };

        return PaginationController;
      })();

      _export('PaginationController', PaginationController);
    }
  };
});
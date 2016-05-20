'use strict';

exports.__esModule = true;

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _aureliaFramework = require('aurelia-framework');

var _utils = require('./utils');

var PaginationNavElement = (function () {
  var _instanceInitializers = {};

  _createDecoratedClass(PaginationNavElement, [{
    key: 'model',
    decorators: [_aureliaFramework.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'rangeSize',
    decorators: [_aureliaFramework.bindable],
    initializer: function initializer() {
      return 3;
    },
    enumerable: true
  }], null, _instanceInitializers);

  function PaginationNavElement(viewResources, viewSlot, viewCompiler, container, obsl, element) {
    _classCallCheck(this, _PaginationNavElement);

    _defineDecoratedPropertyDescriptor(this, 'model', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'rangeSize', _instanceInitializers);

    this.navs = [];
    this.subscriptions = [];

    this.createForwardLookup = _utils.createForwardLookup(obsl);
    this.createForwardComputed = _utils.createForwardComputed(obsl);

    var fragment = document.createDocumentFragment();

    var child = undefined;

    while ((child = element.firstElementChild) !== null) {
      fragment.appendChild(child);
    }

    this.viewFactory = viewCompiler.compile(fragment, viewResources);
    this.container = container;
    this.viewSlot = viewSlot;
    this.obsl = obsl;
  }

  PaginationNavElement.prototype.bind = function bind(ctx) {
    var _this = this;

    if (typeof this.rangeSize === 'string') {
      var rangeSize = this.rangeSize;
      this.rangeSize = parseInt(this.rangeSize, 10);

      if (isNaN(this.rangeSize)) {
        throw new Error('The string \'' + rangeSize + '\' given to range-size is not a number.');
      }
    }

    var childCtx = Object.create(ctx, {
      $navs: this.createForwardLookup(this, 'navs'),
      $go: {
        value: function value(num) {
          if (typeof num === 'string') {
            switch (num) {
              case 'prev':
                if (_this.model.page === 0) {
                  return;
                }

                _this.model.page = Math.max(_this.model.page - 1, 0);
                break;

              case 'next':
                if (_this.model.page === _this.model.numPages - 1) {
                  return;
                }

                _this.model.page = Math.min(_this.model.page + 1, _this.model.numPages);
                break;

              default:
                throw new Error('\'' + num + '\' is not a valid value for $go');
            }
          } else if (num < 0) {
            _this.model.page = _this.model.numPages + num;
          } else {
            _this.model.page = num;
          }
        }
      },
      $isLast: this.createForwardComputed([[this, 'model', ['page', 'numPages']]], function () {
        return _this.model.page === _this.model.numPages - 1;
      }),
      $isFirst: this.createForwardComputed([[this, 'model', 'page']], function () {
        return _this.model.page === 0;
      })
    });

    this.modelChanged();

    var view = this.viewFactory.create(this.container, childCtx);
    this.viewSlot.add(view);
  };

  PaginationNavElement.prototype.modelChanged = function modelChanged() {
    this.subscriptions.forEach(function (fn) {
      return fn();
    });
    this.subscriptions = [];

    if (this.model) {
      var readyObs = this.obsl.getObserver(this.model, 'ready');
      var pageObs = this.obsl.getObserver(this.model, 'page');

      this.subscriptions.push(readyObs.subscribe(this.readyChanged.bind(this)));
      this.subscriptions.push(pageObs.subscribe(this.pageChanged.bind(this)));
    }
  };

  PaginationNavElement.prototype.readyChanged = function readyChanged() {
    this._generate();
  };

  PaginationNavElement.prototype.pageChanged = function pageChanged() {
    this._generate();
  };

  PaginationNavElement.prototype._generate = function _generate() {
    var _this2 = this;

    var navs = [];
    var _model = this.model;
    var page = _model.page;
    var numPages = _model.numPages;

    var rangeStart = Math.max(page - this.rangeSize, 0);
    var rangeEnd = Math.min(page + this.rangeSize, numPages - 1);

    if (page < this.rangeSize) {
      rangeEnd = Math.min(this.rangeSize * 2, numPages - 1);
    }

    if (page > numPages - this.rangeSize) {
      if (numPages < this.rangeSize) {
        rangeStart = 0;
      } else {
        rangeStart = Math.max(numPages - this.rangeSize * 2, this.rangeSize);
      }
    }

    var _loop = function (i) {
      navs.push({
        text: (i + 1).toString(),
        current: i === page,
        go: function go() {
          _this2.model.page = i;
        }
      });
    };

    for (var i = rangeStart; i < rangeEnd + 1; i++) {
      _loop(i);
    }

    this.navs = navs;
  };

  var _PaginationNavElement = PaginationNavElement;
  PaginationNavElement = _aureliaFramework.inject(_aureliaFramework.ViewResources, _aureliaFramework.ViewSlot, _aureliaFramework.ViewCompiler, _aureliaFramework.Container, _aureliaFramework.ObserverLocator, Element)(PaginationNavElement) || PaginationNavElement;
  PaginationNavElement = _aureliaFramework.customElement('pagination-nav')(PaginationNavElement) || PaginationNavElement;
  PaginationNavElement = _aureliaFramework.processContent(false)(PaginationNavElement) || PaginationNavElement;
  PaginationNavElement = _aureliaFramework.noView()(PaginationNavElement) || PaginationNavElement;
  return PaginationNavElement;
})();

exports.PaginationNavElement = PaginationNavElement;
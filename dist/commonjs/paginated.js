'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _aureliaFramework = require('aurelia-framework');

var _utils = require('./utils');

var _ready = Symbol('ready');
var _counter = Symbol('counter');
var _prev = Symbol('prev');
var _subscription = Symbol('subscription');

var PaginatedElement = (function () {
  var _instanceInitializers = {};

  _createDecoratedClass(PaginatedElement, [{
    key: 'controller',
    decorators: [_aureliaFramework.bindable],
    initializer: null,
    enumerable: true
  }, {
    key: 'pageSize',
    decorators: [_aureliaFramework.bindable],
    initializer: function initializer() {
      return 10;
    },
    enumerable: true
  }, {
    key: 'page',
    decorators: [_aureliaFramework.bindable],
    initializer: function initializer() {
      return 0;
    },
    enumerable: true
  }], null, _instanceInitializers);

  function PaginatedElement(viewResources, viewSlot, viewCompiler, container, obsl, element) {
    var _this = this;

    _classCallCheck(this, _PaginatedElement);

    _defineDecoratedPropertyDescriptor(this, 'controller', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'pageSize', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'page', _instanceInitializers);

    this.data = [];
    this.model = { ready: false, numPages: 0 };

    this[_ready] = false;
    this[_counter] = 0;
    this.createForwardLookup = _utils.createForwardLookup(obsl);

    Reflect.defineProperty(this.model, 'page', _extends({}, this.createForwardLookup(this, 'page'), {
      enumerable: true,
      set: function set(value) {
        return _this.page = value;
      }
    }));

    var fragment = document.createDocumentFragment();

    var child = undefined;

    while ((child = element.firstElementChild) !== null) {
      fragment.appendChild(child);
    }

    this.viewFactory = viewCompiler.compile(fragment, viewResources);
    this.container = container;
    this.viewSlot = viewSlot;
  }

  PaginatedElement.prototype.reset = function reset() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$resetPage = _ref.resetPage;
    var resetPage = _ref$resetPage === undefined ? true : _ref$resetPage;

    if (resetPage) {
      this.page = 0;
    }

    this[_prev] = null;
    this._process();
  };

  PaginatedElement.prototype.bind = function bind(ctx) {
    var _this2 = this;

    if (typeof this.pageSize === 'string') {
      var pageSize = this.pageSize;
      this.pageSize = parseInt(this.pageSize, 10);

      if (isNaN(this.pageSize)) {
        throw new Error('The string \'' + pageSize + '\' given to page-size is not a number.');
      }
    }

    if (this.controller) {
      this[_subscription] = this.controller.subscribe(function (opts) {
        return _this2.reset(opts);
      });
    } else {
      this[_subscription] = null;
    }

    var childCtx = Object.create(ctx, {
      $data: this.createForwardLookup(this, 'data'),
      $model: this.createForwardLookup(this, 'model'),
      $ready: this.createForwardLookup(this, 'ready')
    });

    var view = this.viewFactory.create(this.container, childCtx);
    this.viewSlot.add(view);
    this[_ready] = true;
    this._process();
  };

  PaginatedElement.prototype.pageChanged = function pageChanged() {
    this._process();
  };

  PaginatedElement.prototype.controllerChanged = function controllerChanged() {
    var _this3 = this;

    if (this[_subscription]) {
      this[_subscription]();
      this[_subscription] = null;
    }

    if (this.controller) {
      this[_subscription] = this.controller.subscribe(function (opts) {
        return _this3.reset(opts);
      });
    }
  };

  PaginatedElement.prototype.unbind = function unbind() {
    if (this[_subscription]) {
      this[_subscription]();
      this[_subscription] = null;
    }
  };

  PaginatedElement.prototype._process = function _process() {
    var _this4 = this;

    var prev = this[_prev] || {};
    if (prev.page === this.page && prev.pageSize === this.pageSize) {
      return;
    }

    var counter = ++this[_counter];
    var next = { page: this.page, pageSize: this.pageSize };
    this[_prev] = next;

    this.model.ready = false;
    Promise.resolve(this.controller && this.controller.getData(next) || []).then(function (_ref2) {
      var data = _ref2.data;
      var numPages = _ref2.numPages;

      if (counter !== _this4[_counter]) {
        return;
      }

      _this4.data = data;
      _this4.model.numPages = numPages;
      _this4.model.ready = true;
    });
  };

  var _PaginatedElement = PaginatedElement;
  PaginatedElement = _aureliaFramework.inject(_aureliaFramework.ViewResources, _aureliaFramework.ViewSlot, _aureliaFramework.ViewCompiler, _aureliaFramework.Container, _aureliaFramework.ObserverLocator, Element)(PaginatedElement) || PaginatedElement;
  PaginatedElement = _aureliaFramework.customElement('paginated')(PaginatedElement) || PaginatedElement;
  PaginatedElement = _aureliaFramework.processContent(false)(PaginatedElement) || PaginatedElement;
  PaginatedElement = _aureliaFramework.noView()(PaginatedElement) || PaginatedElement;
  return PaginatedElement;
})();

exports.PaginatedElement = PaginatedElement;
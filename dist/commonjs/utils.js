'use strict';

exports.__esModule = true;
exports.createForwardLookup = createForwardLookup;
exports.createForwardComputed = createForwardComputed;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaFramework = require('aurelia-framework');

function createForwardLookup(observerLocator) {
  return function (obj, name) {
    function get() {
      return obj[name];
    }

    get.getObserver = function () {
      return observerLocator.getObserver(obj, name);
    };

    return { get: get };
  };
}

function createForwardComputed(observerLocator) {
  return function (deps, computed) {
    function get() {
      return computed();
    }

    get.getObserver = function () {
      return new ComputedProxyPropertyObserver(get, deps, observerLocator);
    };

    return { get: get };
  };
}

var computedProxyContext = 'ComputedProxyPropertyObserver';

function makeObserver(target) {
  var subscribers = [];

  defineAll({
    hasSubscribers: {
      get: function get() {
        return function hasSubscribers() {
          return subscribers.length > 0;
        };
      }
    },

    addSubscriber: {
      get: function get() {
        return function addSubscriber(context) {
          var _this = this;

          var callable = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          if (callable === null) {
            callable = context;
            context = null;
          }

          subscribers.push({ callable: callable, context: context });

          return function () {
            _this.unsubscribe(context, callable);
          };
        };
      }
    },

    callSubscribers: {
      get: function get() {
        return function callSubscribers(newValue, oldValue) {
          subscribers.forEach(function (_ref) {
            var callable = _ref.callable;
            return callable(newValue, oldValue);
          });
        };
      }
    }
  });

  function defineAll(props) {
    Object.keys(props).forEach(function (name) {
      return Reflect.defineProperty(target, name, props[name]);
    });
  }
}

var ComputedProxyPropertyObserver = (function () {
  function ComputedProxyPropertyObserver(getter, dependencies, obsl) {
    _classCallCheck(this, ComputedProxyPropertyObserver);

    this._getter = getter;
    this._dependencies = flatten(dependencies.map(function (d) {
      return createTree(d);
    }));
    this._obsl = obsl;

    makeObserver(this);
  }

  ComputedProxyPropertyObserver.prototype.getValue = function getValue() {
    return this._getter();
  };

  ComputedProxyPropertyObserver.prototype.setValue = function setValue(_) {
    throw new Error('Value is readonly.');
  };

  ComputedProxyPropertyObserver.prototype.call = function call(_) {
    var newValue = this.getValue();
    if (this._oldValue === newValue) {
      return;
    }

    this.callSubscribers(newValue, this._oldValue);
    this._oldValue = newValue;
    return;
  };

  ComputedProxyPropertyObserver.prototype.evaluate = function evaluate() {
    this.call();
  };

  ComputedProxyPropertyObserver.prototype.subscribe = function subscribe(context, callable) {
    if (!this.hasSubscribers()) {
      this.oldValue = this.getValue();

      this._subscriptions = this._dependencies.map(_subscribe(computedProxyContext, this, this._obsl));
    }

    return this.addSubscriber(context, callable);
  };

  ComputedProxyPropertyObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
      this._subscriptions.forEach(function (s) {
        return s();
      });
    }
  };

  return ComputedProxyPropertyObserver;
})();

function createTree(dependencyGraph) {
  var parent = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  var ret = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  var root = parent === null ? {
    obj: dependencyGraph[0],
    root: true
  } : parent;
  var start = parent === null ? 1 : 0;

  if (parent === null) {
    ret.push(root);
  }

  parent = root;
  for (var i = start, l = dependencyGraph.length; i < l; i++) {
    var current = dependencyGraph[i];
    if (Array.isArray(current)) {
      for (var j = 0, l2 = current.length; j < l2; j++) {
        var child = current[j];
        if (Array.isArray(child)) {
          createTree(child, parent, ret);
        } else {
          var node = {
            parent: parent,
            prop: child,
            leaf: true
          };

          ret.push(node);
        }
      }

      parent = null;
    } else if (parent !== null) {
      var node = {
        parent: parent,
        prop: current
      };

      if (i === l - 1) {
        node.leaf = true;
      }

      ret.push(node);
      parent = node;
    } else {
      throw new Error('Invalid dependency graph');
    }
  }

  return ret.filter(function (n) {
    return n.leaf;
  });
}

function flatten(array) {
  return Reflect.apply(Array.prototype.concat, [], array);
}

function _subscribe(context, target, obsl) {
  return function (node) {
    var obs = createPathObserver(node, obsl);

    return obs.subscribe(target.call.bind(target));
  };
}

function createPathObserver(node, obsl) {
  if (node.parent.root) {
    return obsl.getObserver(node.parent.obj, node.prop);
  }

  var left = createPathObserver(node.parent, obsl);
  return new _aureliaFramework.PathObserver(left, function (val) {
    return val && obsl.getObserver(val, node.prop);
  }, left.getValue());
}
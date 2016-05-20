// TODO: This will be added later in aurelia-binding.
import { /* subscriberCollection, */ PathObserver } from 'aurelia-framework';

export function createForwardLookup(observerLocator) {
  return (obj, name) => {
    function get() {
      return obj[name];
    }

    get.getObserver = () => observerLocator.getObserver(obj, name);

    return { get };
  };
}

export function createForwardComputed(observerLocator) {
  return (deps, computed) => {
    function get() {
      return computed();
    }

    get.getObserver = () => new ComputedProxyPropertyObserver(get, deps, observerLocator);

    return { get };
  };
}

const computedProxyContext = 'ComputedProxyPropertyObserver';

// TODO: Remove
function makeObserver(target) {
  const subscribers = [];

  defineAll({
    hasSubscribers: {
      get: () => function hasSubscribers() {
        return subscribers.length > 0;
      }
    },

    addSubscriber: {
      get: () => function addSubscriber(context, callable = null) {
        if (callable === null) {
          callable = context;
          context = null;
        }

        subscribers.push({ callable, context });

        return () => {
          this.unsubscribe(context, callable); // eslint-disable-line no-invalid-this
        };
      }
    },

    callSubscribers: {
      get: () => function callSubscribers(newValue, oldValue) {
        subscribers.forEach(({ callable }) => callable(newValue, oldValue));
      }
    }
  });

  function defineAll(props) {
    Object.keys(props).forEach(name => Reflect.defineProperty(target, name, props[name]));
  }
}

//@subscriberCollection()
class ComputedProxyPropertyObserver {
  constructor(getter, dependencies, obsl) {
    this._getter = getter;
    this._dependencies = flatten(dependencies.map(d => createTree(d)));
    this._obsl = obsl;

    makeObserver(this);
  }

  getValue() {
    return this._getter();
  }

  setValue(_) {
    throw new Error('Value is readonly.');
  }

  call(_) {
    const newValue = this.getValue();
    if (this._oldValue === newValue) {
      return;
    }

    this.callSubscribers(newValue, this._oldValue);
    this._oldValue = newValue;
    return;
  }

  evaluate() {
    this.call(); // eslint-disable-line prefer-reflect
  }

  subscribe(context, callable) {
    if (!this.hasSubscribers()) {
      this.oldValue = this.getValue();

      this._subscriptions = this._dependencies.map(subscribe(computedProxyContext, this, this._obsl));
    }

    return this.addSubscriber(context, callable);
  }

  unsubscribe(context, callable) {
    if (this.removeSubscriber(context, callable) && !this.hasSubscribers()) {
      this._subscriptions.forEach(s => s());
    }
  }
}

function createTree(dependencyGraph, parent = null, ret = []) {
  const root = parent === null ? {
    obj: dependencyGraph[0],
    root: true
  } : parent;
  const start = parent === null ? 1 : 0;

  if (parent === null) {
    ret.push(root);
  }

  parent = root;
  for (let i = start, l = dependencyGraph.length; i < l; i++) {
    const current = dependencyGraph[i];
    if (Array.isArray(current)) {
      for (let j = 0, l2 = current.length; j < l2; j++) {
        const child = current[j];
        if (Array.isArray(child)) {
          createTree(child, parent, ret);
        } else {
          const node = {
            parent,
            prop: child,
            leaf: true
          };

          ret.push(node);
        }
      }

      parent = null;
    } else if (parent !== null) {
      const node = {
        parent,
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

  return ret.filter(n => n.leaf);
}

function flatten(array) {
  return Reflect.apply(Array.prototype.concat, [], array);
}

function subscribe(context, target, obsl) {
  return (node) => {
    const obs = createPathObserver(node, obsl);

    // TODO: Update on new aurelia-binding
    return obs.subscribe(target.call.bind(target));
  };
}

function createPathObserver(node, obsl) {
  if (node.parent.root) {
    return obsl.getObserver(node.parent.obj, node.prop);
  }

  const left = createPathObserver(node.parent, obsl);
  return new PathObserver(left, val => val && obsl.getObserver(val, node.prop), left.getValue());
}

import { customElement, processContent, bindable, noView, ViewSlot,
  ViewResources, ViewCompiler, inject, Container, ObserverLocator } from 'aurelia-framework';

import { createForwardLookup } from './utils';

const _ready = Symbol('ready');
const _counter = Symbol('counter');
const _prev = Symbol('prev');
const _subscription = Symbol('subscription');

@noView()
@processContent(false)
@customElement('paginated')
@inject(ViewResources, ViewSlot, ViewCompiler, Container, ObserverLocator, Element)
export class PaginatedElement {
  @bindable controller;
  @bindable pageSize = 10;
  @bindable page = 0;

  data = [];
  model = { ready: false, numPages: 0 };

  constructor(viewResources, viewSlot, viewCompiler, container, obsl, element) {
    this[_ready] = false;
    this[_counter] = 0;
    this.createForwardLookup = createForwardLookup(obsl);

    Reflect.defineProperty(this.model, 'page', {
      ...this.createForwardLookup(this, 'page'),
      enumerable: true,
      set: value => this.page = value
    });

    const fragment = document.createDocumentFragment();

    let child;

    while ((child = element.firstElementChild) !== null) {
      fragment.appendChild(child);
    }

    this.viewFactory = viewCompiler.compile(fragment, viewResources);
    this.container = container;
    this.viewSlot = viewSlot;
  }

  reset({ resetPage = true } = {}) {
    if (resetPage) {
      this.page = 0;
    }

    this[_prev] = null;
    this._process();
  }

  bind(ctx) {
    if (typeof this.pageSize === 'string') {
      const pageSize = this.pageSize;
      this.pageSize = parseInt(this.pageSize, 10);

      if (isNaN(this.pageSize)) {
        throw new Error(`The string '${pageSize}' given to page-size is not a number.`);
      }
    }

    if (this.controller) {
      this[_subscription] = this.controller.subscribe(opts => this.reset(opts));
    } else {
      this[_subscription] = null;
    }

    const childCtx = Object.create(ctx, {
      $data: this.createForwardLookup(this, 'data'),
      $model: this.createForwardLookup(this, 'model'),
      $ready: this.createForwardLookup(this, 'ready')
    });

    const view = this.viewFactory.create(this.container, childCtx);
    this.viewSlot.add(view);
    this[_ready] = true;
    this._process();
  }

  pageChanged() {
    this._process();
  }

  controllerChanged() {
    if (this[_subscription]) {
      this[_subscription]();
      this[_subscription] = null;
    }

    if (this.controller) {
      this[_subscription] = this.controller.subscribe(opts => this.reset(opts));
    }
  }

  unbind() {
    if (this[_subscription]) {
      this[_subscription]();
      this[_subscription] = null;
    }
  }

  _process() {
    const prev = this[_prev] || {};
    if (prev.page === this.page && prev.pageSize === this.pageSize) {
      return;
    }

    const counter = ++this[_counter];
    const next = { page: this.page, pageSize: this.pageSize };
    this[_prev] = next;

    this.model.ready = false;
    Promise.resolve(this.controller && this.controller.getData(next) || [])
      .then(({ data, numPages }) => {
        if (counter !== this[_counter]) {
          return;
        }

        this.data = data;
        this.model.numPages = numPages;
        this.model.ready = true;
      });
  }
}

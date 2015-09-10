import { customElement, processContent, bindable, noView, ViewSlot,
  ViewResources, ViewCompiler, inject, Container } from 'aurelia-framework';

const _ready = Symbol('ready');
const _counter = Symbol('counter');

@noView()
@processContent(false)
@customElement('paginated')
@inject(ViewResources, ViewSlot, ViewCompiler, Container, Element)
export class PaginatedElement {
  @bindable fetch;
  @bindable pageSize = 10;
  @bindable page = 0;

  data = [];
  model = { ready: false, maxPage: 0 };

  constructor(viewResources, viewSlot, viewCompiler, container, element) {
    this[_ready] = false;
    this[_counter] = 0;

    Reflect.defineProperty(this.model, 'page', {
      enumerable: true,
      get: () => this.page,
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

  bind(ctx) {
    if (typeof this.pageSize === 'string') {
      const pageSize = this.pageSize;
      this.pageSize = parseInt(this.pageSize, 10);

      if (isNaN(this.pageSize)) {
        throw new Error(`The string '${pageSize}' given to page-size is not a number.`);
      }
    }

    const self = this;
    const childCtx = Object.create(ctx, {
      $data: {
        get() {
          return self.data;
        }
      },
      $model: {
        get() {
          return self.model;
        }
      },
      $ready: {
        get() {
          return self.model.ready;
        }
      }
    });

    const view = this.viewFactory.create(this.container, childCtx);
    this.viewSlot.add(view);
    this[_ready] = true;
    this._process();
  }

  pageChanged() {
    this._process();
  }

  _process() {
    const counter = ++this[_counter];

    this.model.ready = false;
    Promise.resolve(this.fetch({ $page: this.page, $pageSize: this.pageSize }))
      .then(({ data, maxPage }) => {
        if (counter !== this[_counter]) {
          return;
        }

        this.data = data;
        this.model.maxPage = maxPage;
        this.model.ready = true;
      });
  }
}

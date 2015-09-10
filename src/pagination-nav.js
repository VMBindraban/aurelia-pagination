import { customElement, processContent, bindable, noView, ViewSlot,
  ViewResources, ViewCompiler, inject, Container, ObserverLocator } from 'aurelia-framework';

@noView()
@processContent(false)
@customElement('pagination-nav')
@inject(ViewResources, ViewSlot, ViewCompiler, Container, ObserverLocator, Element)
export class PaginationNavElement {
  @bindable model;
  @bindable rangeSize = 5;

  navs = [];
  subscriptions = [];

  constructor(viewResources, viewSlot, viewCompiler, container, obsl, element) {
    const fragment = document.createDocumentFragment();

    let child;

    while ((child = element.firstElementChild) !== null) {
      fragment.appendChild(child);
    }

    this.viewFactory = viewCompiler.compile(fragment, viewResources);
    this.container = container;
    this.viewSlot = viewSlot;
    this.obsl = obsl;
  }

  bind(ctx) {
    if (typeof this.rangeSize === 'string') {
      const rangeSize = this.rangeSize;
      this.rangeSize = parseInt(this.rangeSize, 10);

      if (isNaN(this.rangeSize)) {
        throw new Error(`The string '${rangeSize}' given to range-size is not a number.`);
      }
    }

    const self = this;
    const childCtx = Object.create(ctx, {
      $navs: {
        get() {
          return self.navs;
        }
      },
      $go: {
        value: num => {
          if (typeof num === 'string') {
            switch (num) {
              case 'prev':
                if (this.model.page === 0) {
                  return;
                }

                this.model.page = Math.max(this.model.page - 1, 0);
                break;

              case 'next':
                if (this.model.page === this.model.maxPage) {
                  return;
                }

                this.model.page = Math.min(this.model.page + 1, this.model.maxPage);
                break;

              default:
                throw new Error(`'${num}' is not a valid value for $go`);
            }
          } else if (num < 0) {
            this.model.page = this.model.maxPage + num + 1;
          } else {
            this.model.page = num;
          }
        }
      },
      $isLast: {
        get() {
          return self.model.page === self.model.maxPage;
        }
      },
      $isFirst: {
        get() {
          return self.model.page === 0;
        }
      }
    });

    this.modelChanged();

    const view = this.viewFactory.create(this.container, childCtx);
    this.viewSlot.add(view);
  }

  modelChanged() {
    this.subscriptions.forEach(fn => fn());
    this.subscriptions = [];

    if (this.model) {
      const readyObs = this.obsl.getObserver(this.model, 'ready');
      const pageObs = this.obsl.getObserver(this.model, 'page');

      this.subscriptions.push(readyObs.subscribe(this.readyChanged.bind(this)));
      this.subscriptions.push(pageObs.subscribe(this.pageChanged.bind(this)));
    }
  }

  readyChanged() {
    this._generate();
  }

  pageChanged() {
    this._generate();
  }

  _generate() {
    const navs = [];
    const page = this.model.page;

    for (let i = 0; i < this.model.maxPage + 1; i++) {
      navs.push({
        text: (i + 1).toString(),
        current: i === page,
        go: () => {
          this.model.page = i;
        }
      });
    }

    this.navs = navs;
  }
}
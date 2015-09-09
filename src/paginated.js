import {customElement, bindable, noView, ViewSlot, BoundViewFactory, inject} from 'aurelia-framework';

@noView()
@customElement('paginated')
@inject(BoundViewFactory, ViewSlot)
export class Paginated {
  constructor(viewFactory, viewSlot) {
    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
  }
}

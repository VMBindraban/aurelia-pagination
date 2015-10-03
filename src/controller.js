const _fetch = Symbol('fetch');
const _subscriptions = Symbol('subscriptions');

export class PaginationController {
  constructor(getData) {
    this[_fetch] = getData;
    this[_subscriptions] = [];
  }

  getData({ page, pageSize }) {
    return this[_fetch]({ page, pageSize });
  }

  subscribe(fn) {
    this[_subscriptions].push(fn);

    let disposed = false;
    return () => {
      if (!disposed) {
        disposed = true;
        const index = this[_subscriptions].indexOf(fn);
        if (index !== -1) {
          this[_subscriptions].splice(1);
        }
      }
    };
  }

  reset(opts) {
    this[_subscriptions].forEach(fn => fn(opts));
  }
}

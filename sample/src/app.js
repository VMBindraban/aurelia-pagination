import { PaginationController } from 'aurelia-pagination';

const numPages = 20;

export class App {
  constructor() {
    this.title = 'Paginated!';

    this.controller = new PaginationController(opts => this.getItems(opts));
  }

  getItems({ page = 0, pageSize = 10 }) {
    return fetch(`https://api.imgur.com/3/gallery/hot/viral/${page}.json`, {
      headers: {
        'Authorization': 'Client-ID c8e140c5402bbb8'
      }
    })
      .then(response => response.json())
      .then(result => {
        const data = result.data.filter(i => !i.is_album).slice(0, pageSize);

        return { data, numPages };
      });
  }

  reset() {
    this.controller.reset();
  }
}

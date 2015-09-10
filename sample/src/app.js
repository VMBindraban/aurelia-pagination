const data = [];

for (let i = 0; i < 100; i++) {
  data.push({ key: 0, value: i });
}

export class App {
  constructor() {
    this.title = 'Paginated!';
  }

  getItems({ page = 0, pageSize = 10 }) {
    const maxPage = Math.max(Math.floor(data.length / pageSize) - 1, 0);

    if (page > maxPage || page < 0) {
      return null;
    }

    const startIndex = pageSize * page;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    const pageData = data.slice(startIndex, endIndex);

    return { data: pageData, maxPage };
  }
}

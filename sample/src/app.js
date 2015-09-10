const data = [
  { key: 0, value: 1 },
  { key: 0, value: 2 },
  { key: 0, value: 3 },
  { key: 0, value: 4 },
  { key: 0, value: 5 },
  { key: 0, value: 6 },
  { key: 0, value: 7 },
  { key: 0, value: 8 },
  { key: 0, value: 9 },
  { key: 0, value: 10 },
  { key: 0, value: 11 },
  { key: 0, value: 12 },
  { key: 0, value: 13 },
  { key: 0, value: 14 }
];

export class App {
  constructor() {
    this.title = 'Paginated!';
  }

  getItems({ page = 0, pageSize = 10 }) {
    const maxPage = Math.floor(data.length / pageSize);

    if (page > maxPage || page < 0) {
      return null;
    }

    const startIndex = pageSize * page;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    const pageData = data.slice(startIndex, endIndex);

    return { data: pageData, maxPage };
  }
}

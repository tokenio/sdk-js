export default class PagedResult {
    constructor(data, offset) {
      this._data = data;
      this._offset = offset;
    }

    get data() {
      return this._data;
    }

    get offset() {
      return this._offset;
    }
}
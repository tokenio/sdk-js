export default class Address {
  constructor(addressObj) {
    this._id = addressObj.id;
    this._name = addressObj.name;
    this._data = addressObj.data;
    this._signature = addressObj.signature;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get data() {
    return this._data;
  }
  get signature() {
    return this._signature;
  }
}

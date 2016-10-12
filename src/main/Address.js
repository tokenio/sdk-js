export default class Address {
    constructor(addressObj) {
        this._id = addressObj.id;
        this._name = addressObj.name;
        this._data = addressObj.payload;
        this._dataSignature = addressObj.payloadSignature;
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

    get dataSignature() {
        return this._dataSignature;
    }
}

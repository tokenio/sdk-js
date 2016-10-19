export default class Address {
    constructor(addressObj) {
        this._id = addressObj.id;
        this._name = addressObj.name;
        this._address = addressObj.address;
        this._addressSignature = addressObj.addressSignature;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get address() {
        return this._address;
    }

    get addressSignature() {
        return this._addressSignature;
    }
}

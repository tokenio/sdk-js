export default class Transaction {
    constructor(transferObj) {
        this._id = transferObj.id;
        this._type = transferObj.type;
        this._currency = transferObj.amount.currency;
        this._amount = parseFloat(transferObj.amount.value);
        this._description = transferObj.description;
        this._tokenId = transferObj.tokenId;
        this._tokenTransferId = transferObj.tokenTransferId;
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get amount() {
        return this._amount;
    }

    get currency() {
        return this._currency;
    }

    get description() {
        return this._description;
    }

    get tokenId() {
        return this._tokenId;
    }

    get tokenTransferId() {
        return this._tokenTransferId;
    }
}

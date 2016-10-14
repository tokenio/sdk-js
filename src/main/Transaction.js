export default class Transaction {
    constructor(transactionObj) {
        this._id = transactionObj.id;
        this._type = transactionObj.type;
        this._currency = transactionObj.amount.currency;
        this._amount = parseFloat(transactionObj.amount.value);
        this._description = transactionObj.description;
        this._tokenId = transactionObj.tokenId;
        this._tokenTransferId = transactionObj.tokenTransferId;
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

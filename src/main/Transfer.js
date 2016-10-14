export default class Transfer {
    constructor(transferObj) {
        this._id = transferObj.id;
        this._referenceId = transferObj.referenceId;
        this._payload = JSON.parse(JSON.stringify(transferObj.payload));
        this._payloadSignatures = JSON.parse(JSON.stringify(transferObj.payloadSignatures));
    }

    get id() {
        return this._id;
    }

    get referenceId() {
        return this._referenceId;
    }

    get payload() {
        return this._payload;
    }

    get amount() {
        return this._payload.amount.value;
    }

    get currency() {
        return this._payload.amount.currency;
    }

    get instructions() {
        return this._payload.instructions;
    }

    get payloadSignatures() {
        return this._payloadSignatures;
    }
}

import Util from "../Util";
import {paymentTokenVersion} from "../constants";

export default class BankTransferToken {

    static createFromToken(token) {
        const id = token.id;
        const from = token.payload.from;
        const transfer = token.payload.bankTransfer.transfer;
        const amount = parseFloat(token.payload.bankTransfer.amount);
        const currency = token.payload.bankTransfer.currency;
        const redeemer = token.payload.bankTransfer.redeemer;
        const description = token.payload.description;
        const version = token.payload.version;
        const issuer = token.payload.issuer;
        const nonce = token.payload.nonce;
        const payloadSignatures = token.payloadSignatures;
        return new BankTransferToken(id, from, transfer, amount, currency,
            redeemer, description, version, issuer, nonce, payloadSignatures);
    }

    static create(member, accountId, amount, currency, alias, description) {
        const from = {
            id: member.id
        };
        const redeemer = {
            alias: alias
        };
        const transfer = {
            source: {
                accountId: accountId
            }
        };
        return new BankTransferToken(undefined, from, transfer, amount, currency,
            redeemer, description);
    }

    constructor(id, from, transfer, amount, currency, redeemer, description,
                version = paymentTokenVersion, issuer = undefined, nonce = undefined,
                payloadSignatures = []) {
        this._id = id;
        this._from = from;
        this._transfer = transfer;
        this._amount = amount;
        this._currency = currency;
        this._redeemer = redeemer;
        this._description = description;
        this._version = version;
        this._issuer = issuer;
        this._nonce = nonce;
        this._payloadSignatures = payloadSignatures;
        if (nonce === undefined) {
            this._nonce = Util.generateNonce();
        }
    }

    set payloadSignatures(sigs) {
        this._payloadSignatures = [];
        for (let sig of sigs) {
            this._payloadSignatures.push(sig);
        }
    }

    get id() {
        return this._id;
    }

    get from() {
        return this._from;
    }

    get amount() {
        return this._amount;
    }

    get currency() {
        return this._currency;
    }

    get redeemer() {
        return this._redeemer;
    }

    get description() {
        return this._description;
    }

    get version() {
        return this._version;
    }

    get issuer() {
        return this._issuer;
    }

    get nonce() {
        return this._nonce;
    }

    get payloadSignatures() {
        return this._payloadSignatures;
    }

    // Creates a standardized json object for the PaymentToken, to be used for signing
    get json() {
        const json = {
            version: this._version,
            nonce: this._nonce,
            from: this._from,
            bankTransfer: {
                currency: this._currency,
                amount: this._amount.toString(),
                transfer: this._transfer
            }
        };
        if (this._redeemer !== undefined) {
            json.bankTransfer.redeemer = this._redeemer;
        }
        if (this._description !== '') {
            json.description = this._description;
        }
        if (this._issuer !== undefined) {
            json.issuer = this._issuer;
        }
        return json;
    }
}

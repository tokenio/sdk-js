import Util from "../Util";
import {transferTokenVersion} from "../constants";

export default class BankTransferToken {

    static createFromToken(token) {
        const id = token.id;
        const from = token.payload.from;
        const instructions = token.payload.transfer.instructions;
        const amount = parseFloat(token.payload.transfer.amount);
        const currency = token.payload.transfer.currency;
        const redeemer = token.payload.transfer.redeemer;
        const description = token.payload.description;
        const version = token.payload.version;
        const issuer = token.payload.issuer;
        const nonce = token.payload.nonce;
        const payloadSignatures = token.payloadSignatures;
        return new BankTransferToken(id, from, instructions, amount, currency,
            redeemer, description, version, issuer, nonce, payloadSignatures);
    }

    static create(member, accountId, amount, currency, username, description) {
        const from = {
            id: member.id
        };
        const redeemer = {
            username: username
        };
        const instructions = {
            source: {
                accountId: accountId
            }
        };
        return new BankTransferToken(undefined, from, instructions, amount, currency,
            redeemer, description);
    }

    constructor(id, from, instructions, amount, currency, redeemer, description,
                version = transferTokenVersion, issuer = undefined, nonce = undefined,
                payloadSignatures = []) {
        if (Util.countDecimals(amount) > 4) {
            throw new Error("Number of decimals in amount should be at most 4");
        }
        this._id = id;
        this._from = from;
        this._instructions = instructions;
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

    // Creates a standardized json object for the TransferToken, to be used for signing
    get json() {
        const json = {
            version: this._version,
            nonce: this._nonce,
            from: this._from,
            transfer: {
                currency: this._currency,
                amount: this._amount.toString(),
                instructions: this._instructions
            }
        };
        if (this._redeemer !== undefined) {
            json.transfer.redeemer = this._redeemer;
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

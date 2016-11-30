import Util from "../Util";
import {transferTokenVersion, maxDecimals} from "../constants";

export default class BankTransferToken {

    static createFromToken(token) {
        const id = token.id;
        const from = token.payload.from;
        const instructions = token.payload.transfer.instructions;
        const lifetimeAmount = parseFloat(token.payload.transfer.lifetimeAmount);
        const amount = token.payload.transfer.amount !== undefined ? parseFloat(token.payload.transfer.amount) : 0;
        const currency = token.payload.transfer.currency;
        const redeemer = token.payload.transfer.redeemer;
        const description = token.payload.description;
        const version = token.payload.version;
        const issuer = token.payload.issuer;
        const nonce = token.payload.nonce;
        const payloadSignatures = token.payloadSignatures;
        return new BankTransferToken(id, from, instructions, lifetimeAmount, currency,
            redeemer, description, amount, version, issuer, nonce, payloadSignatures);
    }

    static create(member, accountId, lifetimeAmount, currency, username, description) {
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
        return new BankTransferToken(undefined, from, instructions, lifetimeAmount, currency,
            redeemer, description);
    }

    constructor(id, from, instructions, lifetimeAmount, currency, redeemer, description, amount = 0,
                version = transferTokenVersion, issuer = undefined, nonce = undefined,
                payloadSignatures = []) {
        if (Util.countDecimals(lifetimeAmount) > maxDecimals
            || Util.countDecimals(amount) > maxDecimals) {
            throw new Error(`Number of decimals in amount should be at most ${maxDecimals}`);
        }
        this._id = id;
        this._from = from;
        this._instructions = instructions;
        this._lifetimeAmount = lifetimeAmount;
        this._currency = currency;
        this._redeemer = redeemer;
        this._description = description;
        this._amount = amount;
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

    get lifetimeAmount() {
        return this._lifetimeAmount;
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
                lifetimeAmount: this._lifetimeAmount.toString(),
                instructions: this._instructions
            }
        };
        if (this._amount !== undefined) {
            json.transfer.amount = this._amount.toString();
        }
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

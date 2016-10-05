import Util from '../Util';
import {paymentTokenVersion} from '../constants';

export default class PaymentToken {

  static createFromToken(token) {
    const id = token.id;
    const payer = token.payload.payer;
    const transfer = {
      from: token.payload.transfer.from
    };
    const amount = parseFloat(token.payload.amount);
    const currency = token.payload.currency;
    const redeemer = token.payload.redeemer;
    const description = token.payload.description;
    const version = token.payload.version;
    const issuer = token.payload.issuer;
    const nonce = token.payload.nonce;
    const signatures = token.signatures;
    return new PaymentToken(id, payer, transfer, amount, currency,
      redeemer, description, version, issuer, nonce, signatures);
  }

  static create(member, accountId, amount, currency, alias, description) {
    const payer = {
      id: member.id
    };
    const redeemer = {
      alias
    };
    const transfer = {
      from: {
        accountId
      }
    };
    return new PaymentToken(undefined, payer, transfer, amount, currency,
      redeemer, description);
  }

  constructor(id, payer, transfer, amount, currency, redeemer, description,
      version = paymentTokenVersion, issuer = undefined, nonce = undefined,
      signatures = []) {
    this._id = id;
    this._payer = payer;
    this._transfer = transfer;
    this._amount = amount;
    this._currency = currency;
    this._redeemer = redeemer;
    this._description = description;
    this._version = version;
    this._issuer = issuer;
    this._nonce = nonce;
    this._signatures = signatures;
    if (nonce === undefined) {
      this._nonce = Util.generateNonce();
    }
  }

  set signatures(sigs) {
    this._signatures = [];
    for (let sig of sigs) {
      this._signatures.push(sig);
    }
  }

  get id() {
    return this._id;
  }
  get payer() {
    return this._payer;
  }
  get account() {
    return this._account;
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
  get signatures() {
    return this._signatures;
  }

  // Creates a standardized json object for the PaymentToken, to be used for signing
  get json() {
    const json = {
      version: this._version,
      nonce: this._nonce,
      payer: this._payer,
      currency: this._currency,
      amount: this._amount.toString(),
      transfer: this._transfer
    };
    if (this._redeemer !== undefined) {
      json.redeemer = this._redeemer;
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

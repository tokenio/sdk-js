import Util from '../Util';
import {paymentTokenScheme} from '../constants';

export default class PaymentToken {

  static createFromToken(token) {
    const id = token.id;
    const payer = token.payment.payer;
    const transfer = {
      from: token.payment.transfer.from
    };
    const amount = parseFloat(token.payment.amount);
    const currency = token.payment.currency;
    const redeemer = token.payment.redeemer;
    const description = token.payment.description;
    const scheme = token.payment.scheme;
    const issuer = token.payment.issuer;
    const nonce = token.payment.nonce;
    const signatures = token.signatures;
    const tokenResult = new PaymentToken(id, payer, transfer, amount, currency,
      redeemer, description, scheme, issuer, nonce, signatures);
    return tokenResult;
  }

  static create(member, account, amount, currency, alias, description) {
    const payer = {
      id: member.id
    };
    const redeemer = {
      alias
    };
    const transfer = {
      from: {
        accountId: account.id
      }
    };
    return new PaymentToken(undefined, payer, transfer, amount, currency,
      redeemer, description);
  }

  constructor(id, payer, transfer, amount, currency, redeemer, description,
      scheme = paymentTokenScheme, issuer = undefined, nonce = undefined,
      signatures = []) {
    this._id = id;
    this._payer = payer;
    this._transfer = transfer;
    this._amount = amount;
    this._currency = currency;
    this._redeemer = redeemer;
    this._description = description;
    this._scheme = scheme;
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
  get scheme() {
    return this._scheme;
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

  get json() {
    const json = {
      scheme: this._scheme,
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

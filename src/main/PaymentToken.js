import Util from '../Util';
import {paymentTokenScheme} from '../constants';

export default class PaymentToken {

  static createFromToken(token) {
    const id = token.id;
    const payer = token.payment.payer;
    const account = token.payment.transfer.from;
    const amount = parseFloat(token.payment.amount);
    const currency = token.payment.currency;
    const redeemer = token.payment.redeemer;
    const description = token.payment.description;
    const scheme = token.payment.scheme;
    const issuer = token.payment.issuer;
    return new PaymentToken(id, payer, account, amount, currency, redeemer,
      description, scheme, issuer);
  }

  static create(member, account, amount, currency, alias, description) {
    const payer = {
      id: member.id
    };
    const redeemer = {
      alias
    };
    return new PaymentToken(undefined, payer, account, amount, currency,
      redeemer, description);
  }

  constructor(id, payer, account, amount, currency, redeemer, description,
      scheme = paymentTokenScheme, issuer = {}) {
    this._id = id;
    this._payer = payer;
    this._account = account;
    this._amount = amount;
    this._currency = currency;
    this._redeemer = redeemer;
    this._description = description;
    this._scheme = scheme;
    this._issuer = issuer;
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

  get json() {
    const json = {
      scheme: this._scheme,
      nonce: Util.generateNonce(),
      payer: this._payer,
      currency: this._currency,
      amount: this._amount.toString(),
      transfer: {
        from: {
          accountId: this._account.id
        }
      }
    };
    if (this._redeemer !== undefined) {
      json.redeemer = this._redeemer;
    }
    if (this._description !== '') {
      json.description = this._description;
    }
    return json;
  }
}

import PaymentToken from './PaymentToken';
import Payment from './Payment';
import AuthHttpClient from '../http/AuthHttpClient';

export default class Account {
  constructor(member, acc) {
    this._member = member;
    this._id = acc.id;
    this._name = acc.name;
  }

  get member() {
    return this._member;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  setAccountName(name) {
    return AuthHttpClient.setAccountName(this._member._keys, this._member.id,
          this._id, name)
    .then(res => {
      this._name = name;
    });
  }

  createToken(amount, currency, alias, description) {
    const token = PaymentToken.create(this._member, this, amount,
      currency, alias, description);
    return AuthHttpClient.createPaymentToken(this._member._keys,
      this._member.id, token.json)
    .then(res => {
      return PaymentToken.createFromToken(res.data.token);
    });
  }

  lookupToken(tokenId) {
    return AuthHttpClient.lookupToken(this._member._keys, this._member.id,
      tokenId)
    .then(res => {
      return PaymentToken.createFromToken(res.data.token);
    });
  }

  lookupTokens(offset = 0, limit = 100) {
    return AuthHttpClient.lookupTokens(this._member._keys, this._member.id,
      offset, limit)
    .then(res => {
      return res.data;
    });
  }

  endorseToken(token) {
    return this._resolveToken(token)
    .then(finalToken => {
      return AuthHttpClient.endorseToken(this._member._keys, this._member.id,
          finalToken)
      .then(res => {
        if (typeof token !== 'string' && !(token instanceof String)) {
          token.signatures = res.data.token.signatures;
        }
        return;
      });
    });
  }

  declineToken(token) {
    return this._resolveToken(token)
    .then(finalToken => {
      return AuthHttpClient.declineToken(this._member._keys, this._member.id,
          finalToken)
      .then(res => {
        if (typeof token !== 'string' && !(token instanceof String)) {
          token.signatures = res.data.token.signatures;
        }
        return;
      });
    });
  }

  revokeToken(token) {
    return this._resolveToken(token)
    .then(finalToken => {
      return AuthHttpClient.revokeToken(this._member._keys, this._member.id,
          finalToken)
      .then(res => {
        if (typeof token !== 'string' && !(token instanceof String)) {
          token.signatures = res.data.token.signatures;
        }
        return;
      });
    });
  }

  redeemToken(token, amount, currency) {
    return this._resolveToken(token)
    .then(finalToken => {
      if (amount === undefined) {
        amount = finalToken.amount;
      }
      if (currency === undefined) {
        currency = finalToken.currency;
      }
      return AuthHttpClient.redeemToken(this._member._keys, this._member.id,
          finalToken, amount, currency)
      .then(res => {
        return new Payment(res.data.payment);
      });
    });
  }

  lookupBalance() {
    return AuthHttpClient.lookupBalance(this._member._keys, this._member.id,
      this._id)
    .then(res => {
      return res.data;
    });
  }

  lookupTransaction(transactionId) {

  }

  lookupTransactions() {

  }

  _resolveToken(token) {
    return new Promise((resolve, reject) => {
      if (typeof token === 'string' || token instanceof String) {
        this.lookupToken(token).then(lookedUp => resolve(lookedUp));
      } else {
        resolve(token);
      }
    });
  }
}

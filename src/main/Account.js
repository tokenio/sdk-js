import PaymentToken from './PaymentToken';
import AuthHttpClient from '../http/AuthHttpClient';

export default class Account {
  constructor(member, acc) {
    this._member = member;
    this._id = acc.id;
    this._name = acc.name;
  }

  setAccountName(name) {
    return AuthHttpClient.setAccountName(this._member._keys, this._member_id,
          this._id, name)
    .then(() => {
      this._name = name;
    });
  }

  createToken(amount, currency, alias, description) {
    const token = PaymentToken.create(this._member, this, amount,
      currency, alias, description);
    return this.createTokenFromPayload(token);
  }

  createTokenFromPayload(paymentToken) {
    return AuthHttpClient.createPaymentToken(this._member._keys,
      this._member.id, paymentToken.json)
    .then(res => {
      return PaymentToken.createFromToken(res.data.token);
    });
  }

  lookupToken(tokenId) {

  }

  lookupTokens(offset, limit) {

  }

  endorseToken(token) {

  }

  declineToken(token) {

  }

  revokeToken(token) {

  }

  redeemToken(token, amount, currency = 'EUR') {

  }

  lookupBalance() {

  }

  lookupTransaction(transactionId) {

  }

  lookupTransactions() {

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
}

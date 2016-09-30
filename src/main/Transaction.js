export default class Transaction {
  constructor(transctionObj) {
    this._id = transctionObj.id;
    this._type = transctionObj.type;
    this._currency = transctionObj.amount.currency;
    this._amount = parseFloat(transctionObj.amount.value);
    this._description = transctionObj.description;
    this._tokenId = transctionObj.tokenId;
    this._tokenPaymentId = transctionObj.tokenPaymentId;
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
  get tokenPaymentId() {
    return this._tokenPaymentId;
  }
}

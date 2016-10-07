export default class Payment {
  constructor(paymentObj) {
    this._id = paymentObj.id;
    this._referenceId = paymentObj.referenceId;
    this._payload = JSON.parse(JSON.stringify(paymentObj.payload));
    this._payloadSignatures = JSON.parse(JSON.stringify(paymentObj.payloadSignatures));
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
  get transfer() {
    return this._payload.transfer;
  }
  get payloadSignatures() {
    return this._payloadSignatures;
  }
}

import Crypto from '../Crypto';
import AuthHttpClient from '../http/AuthHttpClient';

class Member {
  constructor(memberId, keys) {
    this._id = memberId;
    this._keys = keys;
  }

  approveKey(publicKey, level=0) {
    return this._getPreviousHash()
    .then((prevHash) =>
        AuthHttpClient.addKey(this._keys, this._id,
          prevHash, Crypto.bufferKey(publicKey), level));
  }

  removeKey(keyId) {
    return this._getPreviousHash()
    .then((prevHash) =>
        AuthHttpClient.removeKey(this._keys, this._id, prevHash, keyId));
  }

  addAlias(alias) {
    return this._getPreviousHash()
    .then((prevHash) =>
        AuthHttpClient.addAlias(this._keys, this._id, prevHash, alias));
  }

  removeAlias(alias) {
    return this._getPreviousHash()
    .then((prevHash) =>
        AuthHttpClient.removeAlias(this._keys, this._id, prevHash, alias));
  }

  get id() {
    return this._id;
  }

  get keys() {
    return this._keys;
  }

  getFirstAlias() {
    return this.getAllAliases().then((aliases) => {
      if (aliases.length > 0) return aliases[0];
      else return undefined;
    });
  }

  getAllAliases() {
    return AuthHttpClient.getMember(this._keys, this._id)
    .then((member) => member.aliases);
  }

  getAllKeys() {
    return AuthHttpClient.getMember(this._keys, this._id)
    .then((member) => member.keys);
  }

  _getPreviousHash() {
    return AuthHttpClient.getMember(this._keys, this._id)
    .then((member) => member.lastHash);
  }
}

export default Member;

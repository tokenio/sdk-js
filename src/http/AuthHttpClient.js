import Crypto from '../Crypto';
import Auth from './Auth';
import { uriHost } from '../constants';

// Promise polyfill for IE and older browsers
require('es6-promise').polyfill();
const axios = require('axios');
const instance = axios.create({
  baseURL: uriHost,
});

class AuthHttpClient {

  static getMember(keys, memberId) {
    const config = {
      method: 'get',
      url: `/member`,
      data: {},
    };
    Auth.addAuthorizationHeader(keys, memberId, config);
    return instance(config).then((res) => res.data.member);
  }

  static addKey(keys, memberId, prevHash, publicKey, level=0, tags=[]) {
    const update = {
      memberId: memberId,
      addKey: {
        publicKey: Crypto.strKey(publicKey),
      },
    };

    // Do this because default keys are invisible in protos
    if (tags.length > 0) {
      update.addKey.tags = tags;
    }

    if (level != 0) {
      update.level = level;
    }

    return AuthHttpClient.memberUpdate(keys, update, memberId, prevHash);
  }

  static removeKey(keys, memberId, prevHash, keyId) {
    const update = {
      memberId: memberId,
      removeKey: {
        keyId,
      },
    };
    return AuthHttpClient.memberUpdate(keys, update, memberId, prevHash);
  }

  static addAlias(keys, memberId, prevHash, alias) {
    const update = {
      memberId: memberId,
      addAlias: {
        alias,
      },
    };
    return AuthHttpClient.memberUpdate(keys, update, memberId, prevHash);
  }

  static removeAlias(keys, memberId, prevHash, alias) {
    const update = {
      memberId: memberId,
      removeAlias: {
        alias,
      },
    };
    return AuthHttpClient.memberUpdate(keys, update, memberId, prevHash);
  }

  static memberUpdate(keys, update, memberId, prevHash) {
    if (prevHash != '') {
      update.prevHash = prevHash;
    }

    const req = {
      update,
      signature: {
        keyId: keys.keyId,
        signature: Crypto.signJson(update, keys),
        timestampMs: new Date().getTime(),
      },
    };
    const config = {
      method: 'post',
      url: `/members/${memberId}`,
      data: req,
    };
    Auth.addAuthorizationHeader(keys, memberId, config);
    return instance(config).then((res) => res.data.member);
  }
}

export default AuthHttpClient;

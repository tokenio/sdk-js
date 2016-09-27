import Crypto from '../Crypto';
import Auth from './Auth';
import {uriHost, defaultNotificationProvider} from '../constants';
const stringify = require('json-stable-stringify');

const axios = require('axios');
const instance = axios.create({
  baseURL: uriHost
});

class AuthHttpClient {
  static subscribeDevice(keys, memberId, notificationUri, provider,
    platform, tags) {
    const req = {
      provider,
      notificationUri,
      platform,
      tags
    };
    const config = {
      method: 'post',
      url: `/devices`,
      data: req
    };
    Auth.addAuthorizationHeader(keys, memberId, config);
    return instance(config);
  }

  //
  // ACCOUNTS
  //
  static linkAccounts(keys, memberId, bankId, accountLinkPayload) {
    const req = {
      bankId,
      accountLinkPayload
    };
    const config = {
      method: 'post',
      url: `/accounts`,
      data: req
    };
    Auth.addAuthorizationHeader(keys, memberId, config);
    return instance(config);
  }

  static lookupAccounts(keys, memberId) {
    const config = {
      method: 'get',
      url: `/accounts`
    };
    Auth.addAuthorizationHeader(keys, memberId, config);
    return instance(config);
  }

  static setAccountName(keys, memberId, accountId, name) {
    const config = {
      method: 'patch',
      url: `/accounts/${accountId}?name={name}`
    };
    Auth.addAuthorizationHeader(keys, memberId, config);
    return instance(config);
  }

  //
  // Tokens
  //
  static createPaymentToken(keys, memberId, paymentToken) {
    const config = {
      method: 'post',
      url: `/pay-tokens`,
      data: {
        token: paymentToken
      }
    };

    Auth.addAuthorizationHeader(keys, memberId, config);
    return instance(config);
  }

  static lookupToken(keys, memberId, tokenId) {
    const config = {
      method: 'get',
      url: `/tokens/${tokenId}`
    };

    Auth.addAuthorizationHeader(keys, memberId, config);
    return instance(config);
  }

  //
  // Directory
  //
  static getMember(keys, memberId) {
    const config = {
      method: 'get',
      url: `/member`
    };
    Auth.addAuthorizationHeader(keys, memberId, config);
    return instance(config);
  }

  static addKey(keys, memberId, prevHash, publicKey, level, tags) {
    const update = {
      memberId: memberId,
      addKey: {
        publicKey: Crypto.strKey(publicKey)
      }
    };

    // Do this because default keys are invisible in protos
    if (tags.length > 0) {
      update.addKey.tags = tags;
    }

    if (level !== 0) {
      update.level = level;
    }

    return AuthHttpClient.memberUpdate(keys, update, memberId, prevHash);
  }

  static removeKey(keys, memberId, prevHash, keyId) {
    const update = {
      memberId: memberId,
      removeKey: {
        keyId
      }
    };
    return AuthHttpClient.memberUpdate(keys, update, memberId, prevHash);
  }

  static addAlias(keys, memberId, prevHash, alias) {
    const update = {
      memberId: memberId,
      addAlias: {
        alias
      }
    };
    return AuthHttpClient.memberUpdate(keys, update, memberId, prevHash);
  }

  static removeAlias(keys, memberId, prevHash, alias) {
    const update = {
      memberId: memberId,
      removeAlias: {
        alias
      }
    };
    return AuthHttpClient.memberUpdate(keys, update, memberId, prevHash);
  }

  static memberUpdate(keys, update, memberId, prevHash) {
    if (prevHash !== '') {
      update.prevHash = prevHash;
    }

    const req = {
      update,
      signature: {
        keyId: keys.keyId,
        signature: Crypto.signJson(update, keys),
        timestampMs: new Date().getTime()
      }
    };
    const config = {
      method: 'post',
      url: `/members/${memberId}`,
      data: req
    };
    Auth.addAuthorizationHeader(keys, memberId, config);
    return instance(config);
  }
}

export default AuthHttpClient;

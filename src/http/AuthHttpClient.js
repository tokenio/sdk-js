import Crypto from '../Crypto';
import Util from '../Util';
import Auth from './Auth';
import {uriHost} from '../constants';
import KeyLevel from '../main/KeyLevel';
const stringify = require('json-stable-stringify');

const axios = require('axios');
const instance = axios.create({
  baseURL: uriHost
});

/**
 * Authenticated client for making requests to the Token gateway
 */
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
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static unsubscribeDevice(keys, memberId, notificationUri, provider) {
    const req = {
      provider
    };
    const config = {
      method: 'delete',
      url: `/devices/${notificationUri}`,
      data: req
    };
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  //
  // ADDRESSES
  //
  static addAddress(keys, memberId, name, data) {
    const req = {
      name,
      data,
      signature: {
        keyId: keys.keyId,
        signature: Crypto.sign(data, keys),
        timestampMs: new Date().getTime()
      }
    };
    const config = {
      method: 'post',
      url: `/addresses`,
      data: req
    };

    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static getAddresses(keys, memberId) {
    const config = {
      method: 'get',
      url: `/addresses`
    };

    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  //
  // ACCOUNTS
  //
  static linkAccounts(keys, memberId, bankId, accountsLinkPayload) {
    const req = {
      bankId,
      accountsLinkPayload
    };
    const config = {
      method: 'post',
      url: `/accounts`,
      data: req
    };
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static getAccounts(keys, memberId) {
    const config = {
      method: 'get',
      url: `/accounts`
    };
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static setAccountName(keys, memberId, accountId, name) {
    const config = {
      method: 'patch',
      url: `/accounts/${accountId}?name=${name}`
    };
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static getBalance(keys, memberId, accountId) {
    const config = {
      method: 'get',
      url: `/accounts/${accountId}/balance`
    };
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static getTransaction(keys, memberId, accountId, transactionId) {
    const config = {
      method: 'get',
      url: `/accounts/${accountId}/transactions/${transactionId}`
    };
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static getTransactions(keys, memberId, accountId, offset, limit) {
    const config = {
      method: 'get',
      url: `/accounts/${accountId}/transactions?offset=${offset}&limit=${limit}`
    };
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  //
  // Tokens
  //
  static createPaymentToken(keys, memberId, paymentToken) {
    const config = {
      method: 'post',
      url: `/payment-tokens`,
      data: {
        payload: paymentToken
      }
    };

    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static endorsePaymentToken(keys, memberId, paymentToken) {
    return AuthHttpClient._paymentTokenOperation(keys, memberId, paymentToken,
      'endorse', 'endorsed');
  }

  static cancelPaymentToken(keys, memberId, paymentToken) {
    return AuthHttpClient._paymentTokenOperation(keys, memberId, paymentToken,
      'cancel', 'cancelled');
  }

  static _paymentTokenOperation(keys, memberId, paymentToken, operation, suffix) {
    const payload = stringify(paymentToken.json) + `.${suffix}`;
    const req = {
      tokenId: paymentToken.id,
      signature: {
        keyId: keys.keyId,
        signature: Crypto.sign(payload, keys),
        timestampMs: new Date().getTime()
      }
    };
    const tokenId = paymentToken.id;
    const config = {
      method: 'put',
      url: `/payment-tokens/${tokenId}/${operation}`,
      data: req
    };

    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static redeemPaymentToken(keys, memberId, paymentToken, amount, currency) {
    const payload = {
      nonce: Util.generateNonce(),
      tokenId: paymentToken.id,
      amount: {
        value: amount.toString(),
        currency
      },
      transfer: paymentToken.transfer
    };

    const req = {
      payload,
      signature: {
        keyId: keys.keyId,
        signature: Crypto.signJson(payload, keys),
        timestampMs: new Date().getTime()
      }
    };
    const config = {
      method: 'post',
      url: `/payments`,
      data: req
    };

    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static getPaymentToken(keys, memberId, tokenId) {
    const config = {
      method: 'get',
      url: `/payment-tokens/${tokenId}`
    };

    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static getPaymentTokens(keys, memberId, offset, limit) {
    const config = {
      method: 'get',
      url: `/payment-tokens?offset=${offset}&limit=${limit}`
    };
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  //
  // Payments
  //
  static getPayment(keys, memberId, paymentId) {
    const config = {
      method: 'get',
      url: `/payments/${paymentId}`
    };

    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static getPayments(keys, memberId, tokenId, offset, limit) {
    const config = {
      method: 'get',
      url: `/payments?tokenId=${tokenId}&offset=${offset}&limit=${limit}`
    };
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
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
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }

  static getMemberByAlias(keys, alias) {
    const config = {
      method: 'get',
      url: `/member`
    };
    Auth.addAuthorizationHeaderAlias(keys, alias, config);
    return instance(config);
  }

  static addKey(keys, memberId, prevHash, publicKey, keyLevel, tags) {
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

    if (keyLevel !== KeyLevel.PRIVILEGED) {
      update.addKey.level = keyLevel;
    }

    return AuthHttpClient._memberUpdate(keys, update, memberId, prevHash);
  }

  static removeKey(keys, memberId, prevHash, keyId) {
    const update = {
      memberId: memberId,
      removeKey: {
        keyId
      }
    };
    return AuthHttpClient._memberUpdate(keys, update, memberId, prevHash);
  }

  static addAlias(keys, memberId, prevHash, alias) {
    const update = {
      memberId: memberId,
      addAlias: {
        alias
      }
    };
    return AuthHttpClient._memberUpdate(keys, update, memberId, prevHash);
  }

  static removeAlias(keys, memberId, prevHash, alias) {
    const update = {
      memberId: memberId,
      removeAlias: {
        alias
      }
    };
    return AuthHttpClient._memberUpdate(keys, update, memberId, prevHash);
  }

  static _memberUpdate(keys, update, memberId, prevHash) {
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
    Auth.addAuthorizationHeaderMemberId(keys, memberId, config);
    return instance(config);
  }
}

export default AuthHttpClient;

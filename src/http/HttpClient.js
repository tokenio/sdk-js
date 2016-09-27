import Crypto from '../Crypto';
import {uriHost} from '../constants';

const axios = require('axios');
const instance = axios.create({
  baseURL: uriHost
});

class HttpClient {
  static createMemberId() {
    return instance({
      method: 'post',
      url: '/members'
    });
  }

  static notifyAddKey(alias, publicKey, tags = []) {
    const req = {
      alias,
      publicKey: Crypto.strKey(publicKey),
      tags
    };
    return instance({
      method: 'put',
      url: '/devices/notifyAddKey',
      data: req
    });
  }

  static addFirstKey(keys, memberId, level = 0, tags = []) {
    const update = {
      memberId: memberId,
      addKey: {
        publicKey: Crypto.strKey(keys.publicKey)
      }
    };

    // Do this because default keys are invisible in protos
    if (tags.length > 0) {
      update.addKey.tags = tags;
    }

    if (level !== 0) {
      update.level = level;
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
    return instance(config);
  }
}

export default HttpClient;

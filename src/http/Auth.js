const stringify = require('json-stable-stringify');

import {uriHost, signatureScheme} from '../constants';
import Crypto from '../Crypto';

class Auth {

  static addAuthorizationHeaderMemberId(keys, memberId, config, uriParam) {
    const identity = 'member-id=' + memberId;
    Auth.addAuthorizationHeader(keys, identity, config, uriParam);
  }

  /*
  * Adds an authorization header with identity set as the alias. Useful when
  * on a browser that doesn't yet have a memberId
  */
  static addAuthorizationHeaderAlias(keys, alias, config, uriParam) {
    const identity = 'alias=' + alias;
    Auth.addAuthorizationHeader(keys, identity, config, uriParam);
  }

  /*
  * Adds an authorization header to an HTTP request. The header is built
  * using the request info and the keys.
  *
  */
  static addAuthorizationHeader(keys, identity, config, uriParam) {
    let uriPath = config.url.replace(uriHost, '');
    uriPath = uriPath.substring(0, 1) === '/' ? uriPath : uriPath + '/';
    uriPath = uriPath.substring(uriPath.length - 1) === '/' ?
     uriPath.substring(0, uriPath.length - 1) : uriPath;
    if (uriPath.includes("?")) {
      uriPath = uriPath.substring(0, uriPath.indexOf("?"));
    }
    const payload = {
      method: config.method.toUpperCase(),
      uriHost: uriHost.replace('http://', '').replace('https://', ''),
      uriPath,
      requestBody: stringify(config.data)
    };
    if (uriParam !== undefined) {
      const sorted = uriParam.sort();
      payload.uriParam = sorted;
    }
    const signature = Crypto.signJson(payload, keys);
    const header = signatureScheme + ' ' +
       identity + ',' +
      'key-id=' + keys.keyId + ',' +
      'signature=' + signature;
    config.headers = {
      Authorization: header
    };
  }
}

export default Auth;

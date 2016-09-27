const stringify = require('json-stable-stringify');

import {uriHost, signatureScheme} from '../constants';
import Crypto from '../Crypto';

class Auth {

  /*
  * Adds an authorization header to an HTTP request. The header is built
  * using the request info and the keys.
  *
  */
  static addAuthorizationHeader(keys, memberId, config, uriParam) {
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
      payload.uriParam = uriParam;
    }
    const signature = Crypto.signJson(payload, keys);
    const header = signatureScheme + ' ' +
      'member-id=' + memberId + ',' +
      'key-id=' + keys.keyId + ',' +
      'signature=' + signature;
    config.headers = {
      Authorization: header
    };
  }
}

export default Auth;

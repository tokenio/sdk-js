const stringify = require('json-stable-stringify');

import {uriHost, signatureScheme} from "../constants";
import Crypto from "../Crypto";

class Auth {
    /*
     * Adds an authorization header with the identity set as the memberId. This is preferrable
     * to alias identity, because it reduces trust required (no alias lookup)
     */
    static addAuthorizationHeaderMemberId(keys, memberId, config, uriParam, context) {
        const identity = 'member-id=' + memberId;
        Auth.addAuthorizationHeader(keys, identity, config, uriParam, context);
    }

    /*
     * Adds an authorization header with identity set as the alias. Useful when
     * on a browser that doesn't yet have a memberId
     */
    static addAuthorizationHeaderAlias(keys, alias, config, uriParam, context) {
        const identity = 'alias=' + alias;
        Auth.addAuthorizationHeader(keys, identity, config, uriParam, context);
    }

    /*
     * Adds an authorization header to an HTTP request. The header is built
     * using the request info and the keys. The config is the axios request configutration,
     * right before it is sent to the server
     */
    static addAuthorizationHeader(keys, identity, config, context) {
        // Parses out the base uri
        let uriPath = config.url.replace(uriHost, '');

        // Makes sure the uri is formatted correctly
        uriPath = uriPath.substring(0, 1) === '/' ? uriPath : uriPath + '/';
        uriPath = uriPath.substring(uriPath.length - 1) === '/' ?
            uriPath.substring(0, uriPath.length - 1) : uriPath;

        // Path should not include query parameters
        if (uriPath.includes("?")) {
            uriPath = uriPath.substring(0, uriPath.indexOf("?"));
        }

        // Creates the payload from the config info
        const payload = {
            method: config.method.toUpperCase(),
            uriHost: uriHost.replace('http://', '').replace('https://', ''),
            uriPath
        };

        if (config.data !== undefined && config.data !== '') {
            payload.requestBody = stringify(config.data);
        }

        // Signs the query string as well, if it exists
        if (config.url.indexOf("?") !== -1) {
            payload.queryString = config.url.substring(config.url.indexOf("?") + 1);
        }

        // Signs the Json string
        const signature = Crypto.signJson(payload, keys);

        // Creates the authorization header, ands adds it to the request
        const header = signatureScheme + ' ' +
            identity + ',' +
            'key-id=' + keys.keyId + ',' +
            'signature=' + signature +
            Auth._onBehalfOfHeader(context);

        config.headers = {
            Authorization: header
        };
    }

    static _onBehalfOfHeader(context) {
        if(context !== undefined &&
            context.onBehalfOf !== undefined &&
            context.onBehalfOf  !== '') {
            debugger;
            return ',on-behalf-of=' + context.onBehalfOf;
        }
        return '';
    }
}

export default Auth;

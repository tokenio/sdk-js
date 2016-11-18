const stringify = require('json-stable-stringify');

import {signatureScheme} from "../constants";
import Crypto from "../Crypto";

class AuthHeader {

    constructor(baseUrl, keys) {
        this._baseUrl = baseUrl;
        this._keys = keys;
    }
    /*
     * Adds an authorization header with the identity set as the memberId. This is preferrable
     * to username identity, because it reduces trust required (no username lookup)
     */
    addAuthorizationHeaderMemberId(memberId, config, context) {
        const identity = 'member-id=' + memberId;
        this.addAuthorizationHeader(identity, config, context);
    }

    /*
     * Adds an authorization header with identity set as the username. Useful when
     * on a browser that doesn't yet have a memberId
     */
    addAuthorizationHeaderUsername(username, config, context) {
        const identity = 'username=' + username;
        this.addAuthorizationHeader(identity, config, context);
    }

    /*
     * Adds an authorization header to an HTTP request. The header is built
     * using the request info and the keys. The config is the axios request configuration,
     * right before it is sent to the server
     */
    addAuthorizationHeader(identity, config, context) {
        let now = new Date().getTime();
        // Parses out the base uri
        let uriPath = config.url.replace(this._baseUrl, '');

        // Makes sure the uri is formatted correctly
        uriPath = uriPath.substring(0, 1) === '/' ? uriPath : uriPath + '/';
        uriPath = uriPath.substring(uriPath.length - 1) === '/' ?
            uriPath.substring(0, uriPath.length - 1) : uriPath;

        // Path should not include query parameters
        if (uriPath.indexOf("?") >= 0) {
            uriPath = uriPath.substring(0, uriPath.indexOf("?"));
        }

        // Creates the payload from the config info
        const payload = {
            method: config.method.toUpperCase(),
            uriHost: this._baseUrl.replace('http://', '').replace('https://', ''),
            uriPath,
            createdAtMs: now.toString()
        };

        if (config.data !== undefined && config.data !== '') {
            payload.requestBody = stringify(config.data);
        }

        // Signs the query string as well, if it exists
        if (config.url.indexOf("?") !== -1) {
            payload.queryString = config.url.substring(config.url.indexOf("?") + 1);
        }

        // Signs the Json string
        const signature = Crypto.signJson(payload, this._keys);

        // Creates the authorization header, ands adds it to the request
        const header = signatureScheme + ' ' +
            identity + ',' +
            'key-id=' + this._keys.keyId + ',' +
            'signature=' + signature + ',' +
            'created-at-ms=' + now +
            AuthHeader._onBehalfOfHeader(context);

        config.headers = {
            Authorization: header
        };
    }

    static _onBehalfOfHeader(context) {
        if(context !== undefined &&
            context.onBehalfOf !== undefined &&
            context.onBehalfOf  !== '') {
            return ',on-behalf-of=' + context.onBehalfOf;
        }
        return '';
    }
}

export default AuthHeader;

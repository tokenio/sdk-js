const stringify = require('json-stable-stringify');
import {signatureScheme} from "../constants";

/**
 * Handles the addition of the http headers (with signature) to the request
 */
class AuthHeader {
    /**
     * Creates an AuthHeader object with set url and signer
     *
     * @param {string} baseUrl - url to send requests to (gateway)
     * @param {Object} signer - object to use for signing data
     */
    constructor(baseUrl, signer) {
        this._baseUrl = baseUrl;
        this._signer = signer;
    }

    /**
     * Adds an authorization header to the request. This takes into account the url,
     * payload of the request (with timestamp), to generate a message and signature.
     * All of it goes into the Authorization http header.
     *
     * @param {string} memberId - memberId making the request
     * @param {Object} config - request config
     * @param {AuthContext} context - auth context for access token redemption
     */
    addAuthorizationHeader(memberId, config, context) {
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
        const signature = this._signer.signJson(payload);

        // Creates the authorization header, ands adds it to the request
        const header = signatureScheme + ' ' +
            'member-id=' + memberId + ',' +
            'key-id=' + this._signer.getKeyId() + ',' +
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

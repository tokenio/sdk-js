import stringify from 'fast-json-stable-stringify';
import config from '../config.json';

/**
 * Handles the addition of the http headers (with signature) to the request
 */
class AuthHeader {
    /**
     * Creates an AuthHeader object with set url and signer
     *
     * @param {string} baseUrl - url to send requests to (gateway)
     * @param {Object} client - client, to get the signer
     */
    constructor(baseUrl, client) {
        this._baseUrl = baseUrl;
        this._client = client;
    }

    /**
     * Adds an authorization header to the request. This takes into account the url,
     * payload of the request (with timestamp), to generate a message and signature.
     * All of it goes into the Authorization http header.
     *
     * @param {string} memberId - memberId making the request
     * @param {Object} request - request
     * @param {AuthContext} context - auth context for access token redemption
     */
    async addAuthorizationHeader(memberId, request, context) {
        const now = new Date().getTime();

        // Parses out the base uri
        let uriPath = request.url.replace(this._baseUrl, '');
        // Makes sure the uri is formatted correctly
        uriPath = uriPath.substring(0, 1) === '/' ? uriPath : `/${uriPath}`;
        uriPath = uriPath.substring(uriPath.length - 1) === '/' ?
            uriPath.substring(0, uriPath.length - 1) : uriPath;

        // Path should not include query parameters
        if (uriPath.indexOf('?') >= 0) {
            uriPath = uriPath.substring(0, uriPath.indexOf('?'));
        }

        // Creates the payload from the request info
        const payload = {
            method: request.method.toUpperCase(),
            uriHost: this._baseUrl.replace('http://', '').replace('https://', ''),
            uriPath,
            createdAtMs: now.toString(),
        };

        if (request.data !== undefined && request.data !== '') {
            payload.requestBody = stringify(request.data);
        }

        // Signs the query string as well, if it exists
        if (request.url.indexOf('?') !== -1) {
            payload.queryString = request.url.substring(request.url.indexOf('?') + 1);
        }

        // Creates the signer object
        const signer = await this._client.getSigner(AuthHeader._keyLevel(context));

        // Signs the Json string
        const signature = await signer.signJson(payload);

        // Creates the authorization header, ands adds it to the request
        const header = config.signatureScheme + ' ' +
            'member-id=' + memberId + ',' +
            'key-id=' + signer.getKeyId() + ',' +
            'signature=' + signature + ',' +
            'created-at-ms=' + now +
            AuthHeader._onBehalfOfHeader(context) +
            AuthHeader._customerInitiated(context);

        request.headers = {
            Authorization: header,
        };
    }

    static _onBehalfOfHeader(context) {
        if (context !== undefined &&
            context.onBehalfOf !== undefined &&
            context.onBehalfOf !== '') {
            return ',on-behalf-of=' + context.onBehalfOf;
        }
        return '';
    }

    static _keyLevel(context) {
        // if we specified that this request should use a keyLevel > LOW, we notice that here
        // (and re-set the keyLevel for the next request)
        if (context !== undefined) {
            const level = context.keyLevel;
            context.keyLevel = config.KeyLevel.LOW;
            return level;
        }
        return config.KeyLevel.LOW;
    }

    static _customerInitiated(context) {
        // if the customer initiated request flag is set to true,
        // we add it to the header, and reset the flag.
        if (context && context.customerInitiated) {
            context.customerInitiated = false;
            return ',customer-initiated=true';
        }
        return '';
    }
}

export default AuthHeader;

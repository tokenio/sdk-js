import {HttpClient as CoreHttpClient} from '@token-io/core';

/**
 * Client for making unauthenticated requests to the Token gateway.
 */
class HttpClient extends CoreHttpClient{
    constructor(options) {
        super(options);
    }

    /**
     * Retrieves a request for a token. Called by the web(user) or by a TPP, to get request details.
     *
     * @param {string} requestId - token request ID
     * @return {Promise} response to the API call
     */
    async retrieveTokenRequest(requestId) {
        const request = {
            method: 'get',
            url: `/token-requests/${requestId}`,
        };
        return this._instance(request);
    }

    /**
     * Get the token request result based on its token request ID.
     *
     * @param {string} tokenRequestId - token request ID
     * @return {Object} response to the API call
     */
    async getTokenRequestResult(tokenRequestId) {
        const request = {
            method: 'get',
            url: `/token-requests/${tokenRequestId}/token_request_result`,
        };
        return this._instance(request);
    }
}

export default HttpClient;

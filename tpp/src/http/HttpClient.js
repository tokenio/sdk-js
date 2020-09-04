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

    /**
     * Create and onboard a business member under realm of a bank using eIDAS certificate.
     *
     * @param payload payload with eIDAS certificate and bank id
     * @param signature payload signed with the private key corresponding to the certificate
     * public key
     * @return {AxiosPromise<RegisterWithEidasResponse>} response containing member id, registered
     * key id and id of the certificate verification request
     */
    async registerWithEidas(payload, signature) {
        const req = {
            payload,
            signature,
        };
        const request = {
            method: 'put',
            url: '/eidas/register',
            data: req,
        };
        return this._instance(request);
    }
}

export default HttpClient;

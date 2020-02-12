import {HttpClient as CoreHttpClient} from '@token-io/core';
import BlockingAdapter from './BlockingAdapter';

/**
 * Client for making unauthenticated requests to the Token gateway.
 */
class HttpClient extends CoreHttpClient{
    constructor(options) {
        super(options);
    }

    /**
     * Gets a blob from the server.
     *
     * @param {string} blobId - ID of the blob
     * @return {Object} response to the API call
     */
    async getBlob(blobId) {
        const request = {
            method: 'get',
            url: `/blobs/${blobId}`,
        };
        return this._instance(request);
    }

    /**
     * Notifies a user.
     *
     * @param {Object} alias - user to notify
     * @param {Object} body - body of the notification
     * @return {Object} response to the API call
     */
    async notify(alias, body) {
        const req = {
            alias,
            body,
        };
        const request = {
            method: 'post',
            url: '/notify',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Sends a notification to a user to request a payment.
     *
     * @param {Object} tokenPayload - requested transfer token
     * @return {Object} response to the API call
     */
    async notifyPaymentRequest(tokenPayload) {
        const req = {
            tokenPayload,
        };
        const request = {
            method: 'post',
            url: '/request-transfer',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Notifies subscribed devices that a token should be created and endorsed.
     *
     * @param tokenRequestId - token request ID
     * @param addKey - (optional) add key payload
     * @param receiptContact - (optional) receipt contact
     * @return {Object} response to the API call
     */
    async notifyCreateAndEndorseToken(tokenRequestId, addKey, receiptContact) {
        const req = {
            tokenRequestId: tokenRequestId,
            addKey: addKey,
            contact: receiptContact,
        };
        const request = {
            method: 'post',
            url: '/notify/create-and-endorse-token',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Notifies subscribed devices that a token payload should be endorsed and keys should be
     * added.
     *
     * @param {Object} endorseAndAddKey - the endorseAndAddKey payload to be sent
     * @return {Object} response to the API call
     * @deprecated use notifyCreateAndEndorseToken instead
     */
    notifyEndorseAndAddKey(endorseAndAddKey) {
        const req = {
            endorseAndAddKey,
        };
        const request = {
            method: 'post',
            url: '/notify/endorse-and-add-key',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Invalidate a notification.
     *
     * @param {Object} notificationId - the notification ID to invalidate
     * @param {Object} blocking - create a blocking request
     * @return {Object} response to the API call
     */
    async invalidateNotification(notificationId, blocking) {
        const req = {
            notificationId,
        };
        const request = {
            method: 'post',
            url: '/notify/invalidate-notification',
            data: req,
        };
        if (blocking) request.adapter = BlockingAdapter;
        return this._instance(request);
    }

    /**
     * Updates an existing token request.
     *
     * @param {string} requestId - token request ID
     * @param {Object} options - new token request options
     * @return {Promise} response to the API call
     */
    async updateTokenRequest(requestId, options) {
        const request = {
            method: 'put',
            url: `/token-requests/${requestId}`,
            data: {
                requestId: requestId,
                requestOptions: options,
            },
        };
        return this._instance(request);
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
     * Gets directly integrated bank auth URL.
     *
     * @param {string} bankId - ID of the bank
     * @param {string} tokenRequestId - ID of the token request
     * @return {Promise} response to the API call
     */
    async getDirectBankAuthUrl(bankId, tokenRequestId) {
        const request = {
            method: 'get',
            url: `/banks/${bankId}/token-requests/${tokenRequestId}/auth-url`,
        };
        return this._instance(request);
    }
}

export default HttpClient;

import {AuthHttpClient as CoreAuthHttpClient} from '@token-io/core';
import Util from '../Util';
import config from '../config.json';
import BlockingAdapter from './BlockingAdapter';
import base64js from 'base64-js';
import stringify from 'fast-json-stable-stringify';

/**
 * Client for making authenticated requests to the Token gateway.
 */
class AuthHttpClient extends CoreAuthHttpClient {
    constructor(options) {
        super(options);
    }

    /**
     * Subscribes to push notifications.
     *
     * @param {string} handler - who is handling the notifications
     * @param {string} handlerInstructions - how to send the notification
     * @return {Object} response to the API call
     */
    async subscribeToNotifications(handler, handlerInstructions) {
        const req = {
            handler,
            handlerInstructions,
        };

        const request = {
            method: 'post',
            url: '/subscribers',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Gets all subscribers for a member.
     *
     * @return {Object} response to the API call
     */
    async getSubscribers() {
        const request = {
            method: 'get',
            url: '/subscribers',
        };
        return this._instance(request);
    }

    /**
     * Gets a subscriber by ID.
     *
     * @param {string} subscriberId - ID of the subscriber to get
     * @return {Object} response to the API call
     */
    async getSubscriber(subscriberId) {
        const request = {
            method: 'get',
            url: `/subscribers/${subscriberId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets all notifications.
     *
     * @param {string} offset - where to start looking
     * @param {Number} limit - how many to get
     * @return {Object} response to the API call
     */
    async getNotifications(offset, limit) {
        const request = {
            method: 'get',
            url: `/notifications?offset=${offset}&limit=${limit}`,
        };
        return this._instance(request);
    }

    /**
     * Gets a notification by ID.
     *
     * @param {string} notificationId - ID of the notification to get
     * @return {Object} response to the API call
     */
    async getNotification(notificationId) {
        const request = {
            method: 'get',
            url: `/notifications/${notificationId}`,
        };
        return this._instance(request);
    }

    /**
     * Unsubscribes from notifications (deletes a subscriber).
     *
     * @param {string} subscriberId - subscriber to delete
     * @return {Object} response to the API call
     */
    async unsubscribeFromNotifications(subscriberId) {
        const request = {
            method: 'delete',
            url: `/subscribers/${subscriberId}`,
        };
        return this._instance(request);
    }

    /**
     * Replaces the authenticated member's public profile.
     *
     * @param {Object} profile - profile to set
     * @return {Object} response to the API call
     */
    async setProfile(profile) {
        const req = {
            profile,
        };
        const request = {
            method: 'put',
            url: '/profile',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Gets a member's public profile.
     *
     * @param {string} id - member ID whose profile to get
     * @return {Object} response to the API call
     */
    async getProfile(id) {
        const request = {
            method: 'get',
            url: `/members/${id}/profile`,
        };
        return this._instance(request);
    }

    /**
     * Uploads member's public profile picture.
     *
     * @param {string} type - MIME type
     * @param {Buffer} data - data in bytes
     * @return {Object} response to the API call
     */
    async setProfilePicture(type, data) {
        if (typeof data !== 'string') data = base64js.fromByteArray(data);
        const req = {
            payload: {
                ownerId: this._memberId,
                type: type,
                name: 'profile',
                data,
                accessMode: 'PUBLIC',
            },
        };
        const request = {
            method: 'put',
            url: '/profilepicture',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Gets a member's public profile picture.
     *
     * @param {string} id - member ID whose picture to get
     * @param {Object} size - desired size category: SMALL/MEDIUM/LARGE/ORIGINAL
     * @return {Object} response to the API call
     */
    async getProfilePicture(id, size) {
        const request = {
            method: 'get',
            url: `/members/${id}/profilepicture/${size}`,
        };
        return this._instance(request);
    }

    /**
     * Replaces member's receipt contact.
     *
     * @param {Object} contact - receipt contact to set: value + type
     * @return {Object} response to the API call
     */
    async setReceiptContact(contact) {
        const req = {
            contact: contact,
        };
        const request = {
            method: 'put',
            url: '/receipt-contact',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Gets member's receipt contact.
     *
     * @return {Object} response to the API call
     */
    async getReceiptContact() {
        const request = {
            method: 'get',
            url: '/receipt-contact',
        };
        return this._instance(request);
    }

    /**
     * Links accounts to the member.
     *
     * @param {Object} bankAuthorization - encrypted authorization to accounts
     * @return {Object} response to the API call
     */
    async linkAccounts(bankAuthorization) {
        const req = {
            bankAuthorization,
        };
        const request = {
            method: 'post',
            url: '/accounts',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Unlinks bank accounts previously linked by the linkAccounts call.
     *
     * @param {Array} accountIds - account IDs to unlink
     * @return {Object} response to the API call
     */
    async unlinkAccounts(accountIds) {
        const req = {
            accountIds,
        };
        const request = {
            method: 'delete',
            url: '/accounts',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Gets an account.
     *
     * @param {string} accountId - account to get
     * @return {Object} response to the API call
     */
    async getAccount(accountId) {
        const request = {
            method: 'get',
            url: `/accounts/${accountId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets all accounts linked to the member.
     *
     * @return {Object} response to the API call
     */
    async getAccounts() {
        const request = {
            method: 'get',
            url: '/accounts',
        };
        return this._instance(request);
    }

    /**
     * Gets the default bank account.
     *
     * @return {Promise} the default bank account
     */
    async getDefaultAccount() {
        const request = {
            method: 'get',
            url: `/members/${this._memberId}/default-account`,
        };
        return this._instance(request);
    }

    /**
     * Sets the member's default bank account.
     *
     * @param {string} accountId - the bank account ID
     * @return {Promise} a promise
     */
    async setDefaultAccount(accountId) {
        const req = {accountId};
        const request = {
            method: 'put',
            url: `/members/${this._memberId}/default-account`,
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Prepares a token for creation, retrieves policy.
     *
     * @param {Object} tokenPayload - token payload
     * @returns {Promise} policy and resolved payload
     */
    async prepareToken(tokenPayload) {
        const request = {
            method: 'post',
            url: '/tokens/prepare',
            data: {
                payload: tokenPayload,
            },
        };
        return this._instance(request);
    }

    /**
     * Creates a token.
     *
     * @param payload - token payload
     * @param signatures - signatures
     * @param tokenRequestId - token request ID
     * @returns {Promise} the created token
     */
    async createToken(payload, signatures, tokenRequestId) {
        const req = {payload, signatures, tokenRequestId};
        const request = {
            method: 'post',
            url: '/tokens',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Creates a transfer token.
     *
     * @param {Object} payload - payload of the token
     * @param {string} tokenRequestId - token request ID
     * @return {Object} response to the API call
     */
    async createTransferToken(payload, tokenRequestId) {
        const request = {
            method: 'post',
            url: '/tokens?type=transfer',
            data: {
                payload,
                tokenRequestId,
            },
        };
        return this._instance(request);
    }

    /**
     * Creates an access token.
     *
     * @param {Object} payload - access token payload
     * @param {string} tokenRequestId - token request ID
     * @return {Object} response to the API call
     */
    async createAccessToken(payload, tokenRequestId) {
        const request = {
            method: 'post',
            url: '/tokens?type=access',
            data: {
                payload,
                tokenRequestId,
            },
        };
        return this._instance(request);
    }

    /**
     * Replaces an access token with one with updated resources.
     *
     * @param {Object} tokenToCancel - access token to replace
     * @param {Array} newResources - new resources
     * @return {Object} response to the API call
     */
    async replaceToken(tokenToCancel, newResources) {
        const cancelTokenId = tokenToCancel.id;
        const cancelReq = await this._tokenOperationRequest(tokenToCancel, 'cancelled');

        const createReq = {
            payload: {
                from: {
                    id: this._memberId,
                },
                to: tokenToCancel.payload.to,
                access: {
                    resources: newResources,
                },
                issuer: tokenToCancel.payload.issuer,
                version: config.accessTokenVersion,
                refId: Util.generateNonce(),
            },
        };

        const request = {
            method: 'post',
            url: `/tokens/${cancelTokenId}/replace`,
            data: {
                cancel_token: cancelReq,
                create_token: createReq,
            },
        };
        return this._instance(request);
    }

    /**
     * Endorses a token.
     *
     * @param {Object} token - token to endorse
     * @return {Object} response to the API call
     */
    async endorseToken(token) {
        return this._tokenOperation(
            token,
            'endorse',
            'endorsed');
    }

    /**
     * Cancels a token.
     *
     * @param {Object} token - token to cancel
     * @param {bool} blocking - creates a blocking request
     * @return {Object} response to the API call
     */
    async cancelToken(token, blocking) {
        return this._tokenOperation(
            token,
            'cancel',
            'cancelled',
            blocking);
    }

    /**
     * Redeems a transfer token.
     *
     * @param {Object} transferToken - token to redeem
     * @param {Number} amount - amount to charge
     * @param {string} currency - currency to charge
     * @param {string} description - description of the transfer
     * @param {Array} destinations - destinations money should go to
     * @param {string} refId - reference ID to attach to the transfer
     * @return {Object} response to the API call
     */
    async redeemToken(transferToken, amount, currency, description, destinations, refId) {
        if (!refId) {
            refId = Util.generateNonce();
        }
        const payload = {
            refId: refId,
            tokenId: transferToken.id,
            amount: {
                value: amount.toString(),
                currency,
            },
        };

        if (description) {
            payload.description = description;
        }

        if (destinations !== undefined && destinations.length > 0) {
            payload.destinations = destinations;
        }

        const signer = await this.getSigner(config.KeyLevel.LOW);
        const req = {
            payload,
            payloadSignature: {
                memberId: this._memberId,
                keyId: signer.getKeyId(),
                signature: await signer.signJson(payload),
            },
        };
        const request = {
            method: 'post',
            url: '/transfers',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Looks up a existing access token where the calling member is the grantor and given member is
     * the grantee.
     *
     * @param {string} toMemberId - beneficiary of the active access token
     * @return {Object} response to the API call
     */
    async getActiveAccessToken(toMemberId) {
        const request = {
            method: 'get',
            url: `/tokens/active-access-token/${toMemberId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets a token by its ID.
     *
     * @param {string} tokenId - ID of the token to get
     * @return {Object} response to the API call
     */
    async getToken(tokenId) {
        const request = {
            method: 'get',
            url: `/tokens/${tokenId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets all tokens of the member, of a certain type.
     *
     * @param {string} type - type of tokens to get
     * @param {string} offset - where to start looking
     * @param {Number} limit - how many to get
     * @return {Object} response to the API call
     */
    async getTokens(type, offset, limit) {
        const request = {
            method: 'get',
            url: `/tokens?type=${type}&offset=${offset}&limit=${limit}`,
        };
        return this._instance(request);
    }

    /**
     * Gets a transfer by ID.
     *
     * @param {string} transferId - ID of the transfer
     * @return {Object} response to the API call
     */
    async getTransfer(transferId) {
        const request = {
            method: 'get',
            url: `/transfers/${transferId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets all transfers on a token.
     *
     * @param {string} tokenId - ID of the token
     * @param {string} offset - where to start
     * @param {Number} limit - how many to get
     * @return {Object} response to the API call
     */
    async getTransfers(tokenId, offset, limit) {
        const request = {
            method: 'get',
            url: `/transfers?tokenId=${tokenId}&offset=${offset}&limit=${limit}`,
        };
        return this._instance(request);
    }

    /**
     * Sign with a Token signature a token request state payload.
     *
     * @param {string} tokenRequestId - token request ID
     * @param {string} tokenId - token ID
     * @param {string} state - url state
     * @return {Object} response to the api call
     */
    async signTokenRequestState(tokenRequestId, tokenId, state) {
        const req = {
            payload: {
                tokenId,
                state,
            },
            tokenRequestId,
        };

        const request = {
            method: 'put',
            url: '/sign-token-request-state',
            data: req,
        };

        return this._instance(request);
    }

    async _tokenOperation(token, operation, suffix, blocking) {
        const tokenId = token.id;
        const request = {
            method: 'put',
            url: `/tokens/${tokenId}/${operation}`,
            data: await this._tokenOperationRequest(token, suffix),
        };
        if (blocking) request.adapter = BlockingAdapter;
        return this._instance(request);
    }

    async _tokenOperationRequest(token, suffix) {
        return {
            tokenId: token.id,
            signature: await this._tokenOperationSignature(token.payload, suffix),
        };
    }

    async _tokenOperationSignature(tokenPayload, suffix) {
        const payload = stringify(tokenPayload) + `.${suffix}`;
        const signer = await this.getSigner(config.KeyLevel.STANDARD);
        return {
            memberId: this._memberId,
            keyId: signer.getKeyId(),
            signature: await signer.sign(payload),
        };
    }
}

export default AuthHttpClient;

import {AuthHttpClient as CoreAuthHttpClient} from '@token-io/core';
import Util from '../Util';
import config from '../config.json';
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
     * Uses the given access token.
     *
     * @param {string} accessTokenId - Id of the access token
     * @param {boolean} customerInitiated - whether the user initiated this session / request
     */
    useAccessToken(accessTokenId, customerInitiated = false) {
        this._context.customerInitiated = customerInitiated;
        this._context.onBehalfOf = accessTokenId;
        this._resetRequestInterceptor();
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
     * Stores a request for a token. Called by a merchant or a TPP that wants access from a user.
     *
     * @param {Object} tokenRequest - token request to store
     * @return {Promise} response to the API call
     */
    async storeTokenRequest(tokenRequest) {
        const request = {
            method: 'post',
            url: '/token-requests',
            data: tokenRequest,
        };
        return this._instance(request);
    }

    /**
     * Creates customization.
     *
     * @param {Object} logo - logo
     * @param {Object} colors - colors map of ARGB colors #AARRGGBB
     * @param {string} consentText - consent text
     * @param {string} name - display name
     * @param {string} appName - corresponding app name
     * @return {Promise} response to the API call
     */
    async createCustomization(logo, colors, consentText, name, appName) {
        let imageData = logo.data;
        if (typeof imageData !== 'string') imageData = base64js.fromByteArray(imageData);
        const logoPayload = {
            type: logo.type,
            data: imageData,
            ownerId: logo.ownerId,
            name: logo.name,
            accessMode: logo.accessMode,
        };
        const request = {
            method: 'post',
            url: '/customization',
            data: {
                logo: logoPayload,
                colors,
                consentText,
                name,
                appName,
            },
        };
        return this._instance(request);
    }

    /**
     * Cancels a token.
     *
     * @param {Object} token - token to cancel
     * @return {Object} response to the API call
     */
    async cancelToken(token) {
        return this._tokenOperation(
            token,
            'cancel',
            'cancelled');
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

    async _tokenOperation(token, operation, suffix) {
        const tokenId = token.id;
        const request = {
            method: 'put',
            url: `/tokens/${tokenId}/${operation}`,
            data: await this._tokenOperationRequest(token, suffix),
        };
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

/* eslint-disable camelcase */

import Crypto from "../security/Crypto";
import Util from "../Util";
import AuthHeader from "./AuthHeader";
import AuthContext from "./AuthContext";
import config from "../config.json";
import ErrorHandler from "./ErrorHandler";
import DeveloperHeader from "./DeveloperHeader";
import VersionHeader from "./VersionHeader";

const base64js = require('base64-js');
const stringify = require('json-stable-stringify');
const axios = require('axios');

const BlockingAdapter = require('./BlockingAdapter');

/**
 * Client for making authenticated requests to the Token gateway.
 */
class AuthHttpClient {
    /**
     * Initializes the client for the environment, memberId, and CryptoEngine. Sets up signers using
     * the CryptoEngine, for Low, Standard, and Privileged keys, which will be used to sign
     * appropriate requests.
     *
     * @param {string} env - desired env, such as 'prd'
     * @param {string} memberId - member making the requests
     * @param {Object} cryptoEngine - engines to use for signing
     * @param {string} developerKey - the developer key
     * @param {function} globalRpcErrorCallback - callback to invoke on any cross-cutting RPC
     * @param {bool} loggingEnabled - enable HTTP error logging if true
     * call error. For example: SDK version mismatch
     */
    constructor(env, memberId, cryptoEngine, developerKey, globalRpcErrorCallback, loggingEnabled) {
        if (!config.urls[env]) {
            throw new Error('Invalid environment string. Please use one of: ' +
                JSON.stringify(config.urls));
        }
        this._instance = axios.create({
            baseURL: config.urls[env]
        });
        if (loggingEnabled) {
            Util.setUpHttpErrorLogging(this._instance);
        }
        this._memberId = memberId;
        this._cryptoEngine = cryptoEngine;

        this._context = new AuthContext();
        this._authHeader = new AuthHeader(config.urls[env], this);

        this._developerKey = developerKey;

        this._resetRequestInterceptor();

        const errorHandler = new ErrorHandler(globalRpcErrorCallback);
        this._instance.interceptors.response.use(null, (error) => {
            throw errorHandler.handleError(error);
        });
    }

    /**
     * Creates the necessary signer objects, based on the level requested.
     * If the level is not available, attempts to fetch a lower level.
     *
     * @param {string} level - requested level of key
     * @return {Promise} signer - object used to sign
     */
    async getSigner(level) {
        if (level === config.KeyLevel.LOW) {
            return await this._cryptoEngine.createSigner(config.KeyLevel.LOW);
        }
        if (level === config.KeyLevel.STANDARD) {
            try {
                return await this._cryptoEngine.createSigner(config.KeyLevel.STANDARD);
            } catch (err) {
                return await this._cryptoEngine.createSigner(config.KeyLevel.LOW);
            }
        }
        if (level === config.KeyLevel.PRIVILEGED) {
            try {
                return await this._cryptoEngine.createSigner(config.KeyLevel.PRIVILEGED);
            } catch (err) {
                try {
                    return await this._cryptoEngine.createSigner(config.KeyLevel.STANDARD);
                } catch (err2) {
                    return await this._cryptoEngine.createSigner(config.KeyLevel.LOW);
                }
            }
        }
    }

    _resetRequestInterceptor() {
        this._instance.interceptors.request.eject(this._interceptor);

        const versionHeader = new VersionHeader();
        const developerHeader = new DeveloperHeader(this._developerKey);
        this._interceptor = this._instance.interceptors.request.use(async (request) => {
            await this._authHeader.addAuthorizationHeader(this._memberId, request, this._context);
            versionHeader.addVersionHeader(request);
            developerHeader.addDeveloperHeader(request);
            return request;
        });
    }

    /**
     * Use the given access token. (Act on behalf of this member).
     *
     * @param {string} accessTokenId - Id of the access token
     */
    useAccessToken(accessTokenId) {
        this._context.onBehalfOf = accessTokenId;
        this._resetRequestInterceptor();
    }

    /**
     * Use the given key level to sign the request.
     *
     * @param {string} keyLevel - key level
     */
    useKeyLevel(keyLevel) {
        this._context.keyLevel = keyLevel;
        this._resetRequestInterceptor();
    }

    /**
     * Clears the AuthContext, so this client no longer acts on behalf of another member.
     */
    clearAccessToken() {
        this._context.onBehalfOf = undefined;
        this._resetRequestInterceptor();
    }

    /**
     * Sets the customer initiated request flag to true.
     */
    setCustomerInitiated() {
        this._context.customerInitiated = true;
    }

    /**
     * Subcribes to push notifications.
     *
     * @param {string} handler - who is handling the notifications
     * @param {string} handlerInstructions - how to send the notification
     * @return {Object} response - response to the API call
     */
    async subscribeToNotifications(handler, handlerInstructions) {
        const req = {
            handler,
            handlerInstructions,
        };

        const request = {
            method: 'post',
            url: `/subscribers`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Gets all subscribers for a member.
     *
     * @return {Object} response - response to the API call
     */
    async getSubscribers() {
        const request = {
            method: 'get',
            url: `/subscribers`
        };
        return this._instance(request);
    }

    /**
     * Gets a subscriber by id.
     *
     * @param {string} subscriberId - Id of the subscriber to get
     * @return {Object} response - response to the API call
     */
    async getSubscriber(subscriberId) {
        const request = {
            method: 'get',
            url: `/subscribers/${subscriberId}`
        };
        return this._instance(request);
    }

    /**
     * Gets all notifications.
     *
     * @param {string} offset - where to start looking
     * @param {Number} limit - how many to get
     * @return {Object} response - response to the API call
     */
    async getNotifications(offset, limit) {
        const request = {
            method: 'get',
            url: `/notifications?offset=${offset}&limit=${limit}`,
        };
        return this._instance(request);
    }

    /**
     * Gets a notification by id.
     *
     * @param {string} notificationId - Id of the notification to get
     * @return {Object} response - response to the API call
     */
    async getNotification(notificationId) {
        const request = {
            method: 'get',
            url: `/notifications/${notificationId}`
        };
        return this._instance(request);
    }

    /**
     * Unsubscribes from notifications (deletes a subscriber).
     *
     * @param {string} subscriberId - subscriber to delete
     * @return {Object} response - response to the API call
     */
    async unsubscribeFromNotifications(subscriberId) {
        const request = {
            method: 'delete',
            url: `/subscribers/${subscriberId}`
        };
        return this._instance(request);
    }

    /**
     * Trigger a token step up notification.
     *
     * @param {Object} stepUp - token step up notification payload
     * @return {Object} response - response to the Api call
     */
    async triggerStepUpNotification(stepUp) {
        const req = {
            tokenStepUp: stepUp
        };
        const request = {
            method: 'post',
            url: `/notify/stepup`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Trigger a balance step up notification.
     *
     * @param {Array} accountIds - array of account ids
     * @return {Object} response - response to the Api call
     */
    async triggerBalanceStepUpNotification(accountIds) {
        const req = {
            balanceStepUp: {
                accountId: accountIds
            }
        };
        const request = {
            method: 'post',
            url: `/notify/stepup`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Trigger a transaction step up notification.
     *
     * @param {string} accountId - account id
     * @param {string} transactionId - transaction id
     * @return {Object} response - response to the Api call
     */
    async triggerTransactionStepUpNotification(accountId, transactionId) {
        const req = {
            transactionStepUp: {
                accountId,
                transactionId
            }
        };
        const request = {
            method: 'post',
            url: `/notify/stepup`,
            data: req
        };
        return this._instance(request);
    }

    //
    // ADDRESSES
    //

    /**
     * Adds an address to the member.
     *
     * @param {string} name - name of the address
     * @param {Object} address - address to add
     * @return {Object} response - response to the API call
     */
    async addAddress(name, address) {
        const signer = await this.getSigner(config.KeyLevel.LOW);
        const req = {
            name,
            address,
            addressSignature: {
                memberId: this._memberId,
                keyId: signer.getKeyId(),
                signature: await signer.signJson(address),
            }
        };
        const request = {
            method: 'post',
            url: `/addresses`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Gets an address by id.
     *
     * @param {string} addressId - address to get
     * @return {Object} response - response to the API call
     */
    async getAddress(addressId) {
        const request = {
            method: 'get',
            url: `/addresses/${addressId}`
        };
        return this._instance(request);
    }

    /**
     * Gets all addresses.
     *
     * @return {Object} response - response to the API call
     */
    async getAddresses() {
        const request = {
            method: 'get',
            url: `/addresses`
        };
        return this._instance(request);
    }

    /**
     * Deletes an address.
     *
     * @param {string} addressId - address to delete
     * @return {Object} response - response to the API call
     */
    async deleteAddress(addressId) {
        const request = {
            method: 'delete',
            url: `/addresses/${addressId}`
        };
        return this._instance(request);
    }

    //
    // PROFILES
    //

    /**
     * Replaces the authenticated member's public profile.
     *
     * @param {Object} profile - profile to set
     * @return {Object} response - response to the API call
     */
    async setProfile(profile) {
        const req = {
            profile
        };
        const request = {
            method: 'put',
            url: `/profile`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Gets a member's public profile.
     *
     * @param {string} id - member id whose profile to get
     * @return {Object} response - response to the API call
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
     * @return {Object} response - response to the API call
     */
    async setProfilePicture(type, data) {
        const req = {
            payload: {
                ownerId: this._memberId,
                type: type,
                name: "profile",
                data: base64js.fromByteArray(data),
                accessMode: "PUBLIC",
            },
        };
        const request = {
            method: 'put',
            url: `/profilepicture`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Gets a member's public profile picture.
     *
     * @param {string} id - member Id whose picture to get
     * @param {Object} size - desired size category: SMALL/MEDIUM/LARGE/ORIGINAL
     * @return {Object} response - response to the API call
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
     * @return {Object} response - response to the API call
     */
    async setReceiptContact(contact) {
        const req = {
            contact: contact
        };
        const request = {
            method: 'put',
            url: `/receipt-contact`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Gets member's receipt contact.
     *
     * @return {Object} response - response to the API call
     */
    async getReceiptContact() {
        const request = {
            method: 'get',
            url: `/receipt-contact`
        };
        return this._instance(request);
    }

    //
    // ACCOUNTS
    //

    /**
     * Links accounts to the member.
     *
     * @param {Object} bankAuthorization - encrypted authorization to accounts
     * @return {Object} response - response to the API call
     */
    async linkAccounts(bankAuthorization) {
        const req = {
            bankAuthorization
        };
        const request = {
            method: 'post',
            url: `/accounts`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Links accounts to the member.
     *
     * @param {string} authorization - oauthBankAuthorization continaing bank_id and
     * access_token
     * @return {Object} response - response to the API call
     */
    async linkAccountsOauth(authorization) {
        const req = {
            authorization,
        };
        const request = {
            method: 'post',
            url: `/bank-accounts`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Unlinks bank accounts previously linked by the linkAccounts call.
     *
     * @param {Array} accountIds - account ids to unlink
     * @return {Object} response - response to the API call
     */
    async unlinkAccounts(accountIds) {
        const req = {
            accountIds
        };
        const request = {
            method: 'delete',
            url: `/accounts`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Gets all accounts linked to the member.
     *
     * @return {Object} response - response to the API call
     */
    async getAccounts() {
        const request = {
            method: 'get',
            url: `/accounts`
        };
        return this._instance(request);
    }

    /**
     * Gets an account.
     *
     * @param {string} accountId - account to get
     * @return {Object} response - response to the API call
     */
    async getAccount(accountId) {
        const request = {
            method: 'get',
            url: `/accounts/${accountId}`
        };
        return this._instance(request);
    }

    /**
     * Gets the default bank account.
     *
     * @return {Promise} response - the default bank account
     */
    async getDefaultAccount() {
        const request = {
            method: 'get',
            url: `/members/${this._memberId}/default-account`
        };
        return this._instance(request);
    }

    /**
     * Sets the member's default bank account.
     *
     * @param {string} accountId - the bank account id
     * @return {Promise} a promise
     */
    async setDefaultAccount(accountId) {
        const req = {accountId};
        const request = {
            method: 'put',
            url: `/members/${this._memberId}/default-account`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Sets the name of an account.
     *
     * @param {string} accountId - account
     * @param {string} name - new name
     * @return {Object} response - response to the API call
     */
    async setAccountName(accountId, name) {
        const request = {
            method: 'patch',
            url: `/accounts/${accountId}?name=${name}`
        };
        return this._instance(request);
    }

    /**
     * Gets the balance of an account.
     *
     * @param {string} accountId - accountId
     * @param {string} keyLevel - key level
     * @return {Object} response - response to the API call
     */
    async getBalance(accountId, keyLevel) {
        this.useKeyLevel(keyLevel);

        const request = {
            method: 'get',
            url: `/accounts/${accountId}/balance`,
        };
        return this._instance(request);
    }

    /**
     * Gets the balances of an array of accounts.
     *
     * @param {Array} accountIds - array of accountIds
     * @param {string} keyLevel - key level
     * @return {Object} response - response to the API call
     */
    async getBalances(accountIds, keyLevel) {
        this.useKeyLevel(keyLevel);
        var url = '/accounts/balance?' +
            accountIds.map((accountId) => 'account_id=' + accountId).join('&');

        const request = {
            method: 'get',
            url: url,
        };
        return this._instance(request);
    }

    /**
     * Gets a transaction for an account, by its id.
     *
     * @param {string} accountId - account that initiated the transaction
     * @param {string} transactionId - id of the transaction
     * @param {string} keyLevel - key level
     * @return {Object} response - response to the API call
     */
    async getTransaction(accountId, transactionId, keyLevel) {
        this.useKeyLevel(keyLevel);
        const request = {
            method: 'get',
            url: `/accounts/${accountId}/transaction/${transactionId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets all transactions for an account.
     *
     * @param {string} accountId - id of the account
     * @param {string} offset - where to start
     * @param {Number} limit - how many to get
     * @param {string} keyLevel - key level
     * @return {Object} response - response to the API call
     */
    async getTransactions(accountId, offset, limit, keyLevel) {
        this.useKeyLevel(keyLevel);
        const request = {
            method: 'get',
            url: `/accounts/${accountId}/transactions?offset=${offset}&limit=${limit}`,
        };
        return this._instance(request);
    }

    /**
     * Uploads a blob to the server.
     *
     * @param {string} ownerId - owner of the blob
     * @param {string} type - MIME type
     * @param {string} name - name of the file
     * @param {Buffer} data - data in bytes
     * @return {Object} response - response to the API call
     */
    async createBlob(ownerId, type, name, data) {
        const req = {
            payload: {
                ownerId,
                type,
                name,
                data: base64js.fromByteArray(data),
            },
        };
        const request = {
            method: 'post',
            url: `/blobs`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Gets a blob that is a attached to a token.
     *
     * @param {string} tokenId - id of the token
     * @param {string} blobId - id of the blob
     * @return {Object} response - response to the API call
     */
    async getTokenBlob(tokenId, blobId) {
        const request = {
            method: 'get',
            url: `tokens/${tokenId}/blobs/${blobId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets a blob from the server.
     *
     * @param {string} blobId - id of the blob
     * @return {Object} response - response to the API call
     */
    async getBlob(blobId) {
        const request = {
            method: 'get',
            url: `/blobs/${blobId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets info about a bank.
     *
     * @param {string} bankId - id of the bank to lookup
     * @return {Object} response - response to the API call
     */
    async getBankInfo(bankId) {
        const request = {
            method: 'get',
            url: `/banks/${bankId}/info`
        };
        return this._instance(request);
    }

    //
    // Tokens
    //

    /**
     * Stores a request for a token. Called by a merchant or a TPP that wants access from a user.
     *
     * @param {Object} tokenRequest - token request to store
     * @return {Promise} response - response to the API call
     */
    async storeTokenRequest(tokenRequest) {
        const request = {
            method: 'post',
            url: `/token-requests`,
            data: tokenRequest,
        };
        return this._instance(request);
    }

    /**
     * Creates a transfer token.
     *
     * @param {Object} payload - payload of the token
     * @param {string} tokenRequestId - token request id
     * @return {Object} response - response to the API call
     */
    async createTransferToken(payload, tokenRequestId) {
        const request = {
            method: 'post',
            url: `/tokens?type=transfer`,
            data: {
                payload,
                tokenRequestId,
            }
        };
        return this._instance(request);
    }

    /**
     * Creates an access token.
     *
     * @param {Object} payload - access token payload
     * @param {string} tokenRequestId - token request id
     * @return {Object} response - response to the API call
     */
    async createAccessToken(payload, tokenRequestId) {
        const request = {
            method: 'post',
            url: `/tokens?type=access`,
            data: {
                payload,
                tokenRequestId,
            }
        };
        return this._instance(request);
    }

    /**
     * Replaces an access token with one with updated resources.
     *
     * @param {Object} tokenToCancel - access token to replace
     * @param {Array} newResources - new resources
     * @return {Object} response - response to the API call
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
                create_token: createReq
            }
        };
        return this._instance(request);
    }

    /**
     * Replaces an access token with one with updated resources, and endorses it.
     *
     * @param {Object} tokenToCancel - access token to replace
     * @param {Array} newResources - new resources
     * @return {Object} response - response to the API call
     */
    async replaceAndEndorseToken(tokenToCancel, newResources) {
        const cancelTokenId = tokenToCancel.id;
        const cancelReq = await this._tokenOperationRequest(tokenToCancel, 'cancelled');

        const payload = {
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
        };

        const createReq = {
            payload,
            payload_signature: await this._tokenOperationSignature(payload, 'endorsed')
        };

        const request = {
            method: 'post',
            url: `/tokens/${cancelTokenId}/replace`,
            data: {
                cancel_token: cancelReq,
                create_token: createReq
            }
        };
        return this._instance(request);
    }

    /**
     * Endorses a token.
     *
     * @param {Object} token - token to endorse
     * @return {Object} response - response to the API call
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
     * @return {Object} response - response to the API call
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
     * @param {string} refId - reference Id to attach to the transfer
     * @return {Object} response - response to the API call
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
                currency
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
            }
        };
        const request = {
            method: 'post',
            url: `/transfers`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Gets a token by its id.
     *
     * @param {string} tokenId - id of the token to get
     * @return {Object} response - response to the API call
     */
    async getToken(tokenId) {
        const request = {
            method: 'get',
            url: `/tokens/${tokenId}`
        };
        return this._instance(request);
    }

    /**
     * Looks up a existing access token where the calling member is the grantor and given member is
     * the grantee.
     *
     * @param {string} toMemberId - beneficiary of the active access token
     * @return {Object} response - response to the API call
     */
    async getActiveAccessToken(toMemberId) {
        const request = {
            method: 'get',
            url: `/tokens/active-access-token/${toMemberId}`
        };
        return this._instance(request);
    }

    /**
     * Gets all tokens of the member, of a certain type.
     *
     * @param {string} type - type of tokens to get
     * @param {string} offset - where to start looking
     * @param {Number} limit - how many to get
     * @return {Object} response - response to the API call
     */
    async getTokens(type, offset, limit) {
        const request = {
            method: 'get',
            url: `/tokens?type=${type}&offset=${offset}&limit=${limit}`
        };
        return this._instance(request);
    }

    async _tokenOperation(token, operation, suffix, blocking) {
        const tokenId = token.id;
        const request = {
            method: 'put',
            url: `/tokens/${tokenId}/${operation}`,
            data: await this._tokenOperationRequest(token, suffix)
        };
        if (blocking) request.adapter = BlockingAdapter;
        return this._instance(request);
    }

    async _tokenOperationRequest(token, suffix) {
        return {
            tokenId: token.id,
            signature: await this._tokenOperationSignature(token.payload, suffix)
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

    //
    // Transfers
    //

    /**
     * Gets a transfer by id.
     *
     * @param {string} transferId - id of the transfer
     * @return {Object} response - response to the API call
     */
    async getTransfer(transferId) {
        const request = {
            method: 'get',
            url: `/transfers/${transferId}`
        };
        return this._instance(request);
    }

    /**
     * Gets all transfers on a token.
     *
     * @param {string} tokenId - id of the token
     * @param {string} offset - where to start
     * @param {Number} limit - how many to get
     * @return {Object} response - response to the API call
     */
    async getTransfers(tokenId, offset, limit) {
        const request = {
            method: 'get',
            url: `/transfers?tokenId=${tokenId}&offset=${offset}&limit=${limit}`
        };
        return this._instance(request);
    }

    //
    // Directory
    //

    /**
     * Adds a key to the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Object} key - key to add
     * @return {Object} response - response to the API call
     */
    async approveKey(prevHash, key) {
        const update = {
            memberId: this._memberId,
            operations: [
                {
                    addKey: {
                        key: {
                            id: key.id,
                            publicKey: Crypto.strKey(key.publicKey),
                            level: key.level,
                            algorithm: key.algorithm,
                            ...key.expiresAtMs && {expiresAtMs: key.expiresAtMs.toString()}
                        }
                    }
                }
            ]
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Adds keys to the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Array} keys - keys to add
     * @return {Object} response - response to the API call
     */
    async approveKeys(prevHash, keys) {
        const update = {
            memberId: this._memberId,
            operations: keys.map((key) => ({
                addKey: {
                    key: {
                        id: key.id,
                        publicKey: Crypto.strKey(key.publicKey),
                        level: key.level,
                        algorithm: key.algorithm,
                        ...key.expiresAtMs && {expiresAtMs: key.expiresAtMs.toString()}
                    }
                }
            }))
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Removes a key from the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {string} keyId - keyId to remove
     * @return {Object} response - response to the API call
     */
    async removeKey(prevHash, keyId) {
        const update = {
            memberId: this._memberId,
            operations: [
                {
                    removeKey: {
                        keyId
                    }
                }
            ]
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Removes keys from the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Array} keyIds - keys to remove
     * @return {Object} response - response to the API call
     */
    async removeKeys(prevHash, keyIds) {
        const update = {
            memberId: this._memberId,
            operations: keyIds.map((keyId) => ({
                removeKey: {
                    keyId
                }
            })),
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Adds an alias to the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Object} alias - alias to add
     * @return {Object} response - response to the API call
     */
    async addAlias(prevHash, alias) {
        return this.addAliases(prevHash, [alias]);
    }

    /**
     * Gets logged-in member's aliases, verified or not.
     *
     * @return {Object} response object; has aliases, unverifiedAliases
     */
    async getAliases() {
        const request = {
            method: 'get',
            url: '/aliases'
        };
        return this._instance(request);
    }

    /**
     * Get default recovery agent.
     * @return {Object} GetDefaultAgentResponse proto buffer
     */
    async getDefaultRecoveryAgent() {
        const request = {
            method: 'get',
            url: '/recovery/defaults/agent'
        };
        return this._instance(request);
    }

    /**
     * Set member's recovery rule.
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Object} rule - RecoveryRule proto buffer specifying behavior.
     * @return {Object} UpdateMemberResponse proto buffer
     */
    async addRecoveryRule(prevHash, rule) {
        const update = {
            memberId: this._memberId,
            operations: [{
                recoveryRules: rule
            }]
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Adds aliases to the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Array} aliases - aliases to add
     * @return {Object} response - response to the API call
     */
    async addAliases(prevHash, aliases) {
        const update = {
            memberId: this._memberId,
            operations: aliases.map((alias) => ({
                addAlias: {
                    aliasHash: Util.hashAndSerializeAlias(alias),
                    realm: alias.realm || ''
                }
            })),
        };

        const metadata = aliases.map((alias) => ({
            addAliasMetadata: {
                aliasHash: Util.hashAndSerializeAlias(alias),
                alias: alias
            }
        }));

        return this._memberUpdate(update, prevHash, metadata);
    }

    /**
     * Removes an alias from the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Object} alias - alias to remove
     * @return {Object} response - response to the API call
     */
    async removeAlias(prevHash, alias) {
        return this.removeAliases(prevHash, [alias]);
    }

    /**
     * Removes aliases from the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Array} aliases - aliases to remove
     * @return {Object} response - response to the API call
     */
    async removeAliases(prevHash, aliases) {
        const update = {
            memberId: this._memberId,
            operations: aliases.map((alias) => ({
                removeAlias: {
                    aliasHash: Util.hashAndSerializeAlias(alias)
                }
            })),
        };
        return this._memberUpdate(update, prevHash);
    }

    async _memberUpdate(update, prevHash, metadata) {
        if (prevHash !== '') {
            update.prevHash = prevHash;
        }
        if (typeof metadata === "undefined") {
            metadata = [];
        }

        const signer = await this.getSigner(config.KeyLevel.PRIVILEGED);
        const req = {
            update,
            updateSignature: {
                memberId: this._memberId,
                keyId: signer.getKeyId(),
                signature: await signer.signJson(update),
            },
            metadata
        };
        const request = {
            method: 'post',
            url: `/members/${this._memberId}/updates`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Sign with a Token signature a token request state payload.
     *
     * @param {string} tokenId - token id
     * @param {string} state - url state
     * @return {Object} response - response to the api call
     */
    async signTokenRequestState(tokenId, state) {
        const req = {
            payload: {
                tokenId,
                state,
            },
        };

        const request = {
            method: 'put',
            url: `/sign-token-request-state`,
            data: req,
        };

        return this._instance(request);
    }

    /**
     * Deletes the member.
     *
     * @return {Object} response - response to the api call
     */
    async deleteMember() {
        this.useKeyLevel(config.KeyLevel.PRIVILEGED);
        const request = {
            method: 'delete',
            url: `/members`,
        };

        return this._instance(request);
    }

    //
    // Test
    //

    /**
     * Creates a test bank account.
     *
     * @param {Number} balance - balance to put in the account
     * @param {string} currency - currency in the account
     * @return {Object} response - response to the API call
     */
    async createTestBankAccount(balance, currency) {
        const req = {
            balance: {
                currency,
                value: balance,
            },
        };

        const request = {
            method: 'post',
            url: `/test/create-account`,
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Gets test bank notification.
     *
     * @param {string} subscriberId - id of subscriber
     * @param {string} notificationId - id of notification
     * @return {Object} response - response to the API call
     */
    async getTestBankNotification(subscriberId, notificationId) {
        const request = {
            method: 'get',
            url: `/test/subscribers/${subscriberId}/notifications/${notificationId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets test bank notifications.
     *
     * @param {string} subscriberId - id of subscriber
     * @return {Object} response - response to the API call
     */
    async getTestBankNotifications(subscriberId) {
        const request = {
            method: 'get',
            url: `/test/subscribers/${subscriberId}/notifications`,
        };
        return this._instance(request);
    }
}

export default AuthHttpClient;

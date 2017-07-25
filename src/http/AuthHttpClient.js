/* eslint-disable camelcase */

import Crypto from "../security/Crypto";
import Util from "../Util";
import AuthHeader from "./AuthHeader";
import AuthContext from "./AuthContext";
import {urls, KeyLevel, accessTokenVersion} from "../constants";
import ErrorHandler from "./ErrorHandler";
import VersionHeader from "./VersionHeader";

const base64js = require('base64-js');
const stringify = require('json-stable-stringify');
const axios = require('axios');

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
     * @param {function} globalRpcErrorCallback - callback to invoke on any cross-cutting RPC
     * call error. For example: SDK version mismatch
     */
    constructor(env, memberId, cryptoEngine, globalRpcErrorCallback) {
        this._instance = axios.create({
            baseURL: urls[env]
        });
        this._memberId = memberId;
        this._cryptoEngine = cryptoEngine;

        this._context = new AuthContext();
        this._authHeader = new AuthHeader(urls[env], this);

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
        if (level === KeyLevel.LOW) {
            return await this._cryptoEngine.createSigner(KeyLevel.LOW);
        }
        if (level === KeyLevel.STANDARD) {
            try {
                return await this._cryptoEngine.createSigner(KeyLevel.STANDARD);
            } catch (err) {
                return await this._cryptoEngine.createSigner(KeyLevel.LOW);
            }
        }
        if (level === KeyLevel.PRIVILEGED) {
            try {
                return await this._cryptoEngine.createSigner(KeyLevel.PRIVILEGED);
            } catch (err) {
                try {
                    return await this._cryptoEngine.createSigner(KeyLevel.STANDARD);
                } catch (err2) {
                    return await this._cryptoEngine.createSigner(KeyLevel.LOW);
                }
            }
        }
    }

    _resetRequestInterceptor() {
        this._instance.interceptors.request.eject(this._interceptor);

        const versionHeader = new VersionHeader();
        this._interceptor = this._instance.interceptors.request.use(async (config) => {
            await this._authHeader.addAuthorizationHeader(this._memberId, config, this._context);
            versionHeader.addVersionHeader(config);
            return config;
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
     * Clears the AuthContext, so this client no longer acts on behalf of another member.
     */
    clearAccessToken() {
        this._context.onBehalfOf = undefined;
        this._resetRequestInterceptor();
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

        const config = {
            method: 'post',
            url: `/subscribers`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Gets all subscribers for a member.
     *
     * @return {Object} response - response to the API call
     */
    async getSubscribers() {
        const config = {
            method: 'get',
            url: `/subscribers`
        };
        return this._instance(config);
    }

    /**
     * Gets a subscriber by id.
     *
     * @param {string} subscriberId - Id of the subscriber to get
     * @return {Object} response - response to the API call
     */
    async getSubscriber(subscriberId) {
        const config = {
            method: 'get',
            url: `/subscribers/${subscriberId}`
        };
        return this._instance(config);
    }

    /**
     * Gets all notifications.
     *
     * @param {string} offset - where to start looking
     * @param {Number} limit - how many to get
     * @return {Object} response - response to the API call
     */
    async getNotifications(offset, limit) {
        const config = {
            method: 'get',
            url: `/notifications?offset=${offset}&limit=${limit}`,
        };
        return this._instance(config);
    }

    /**
     * Gets a notification by id.
     *
     * @param {string} notificationId - Id of the notification to get
     * @return {Object} response - response to the API call
     */
    async getNotification(notificationId) {
        const config = {
            method: 'get',
            url: `/notifications/${notificationId}`
        };
        return this._instance(config);
    }

    /**
     * Unsubscribes from notifications (deletes a subscriber).
     *
     * @param {string} subscriberId - subscriber to delete
     * @return {Object} response - response to the API call
     */
    async unsubscribeFromNotifications(subscriberId) {
        const config = {
            method: 'delete',
            url: `/subscribers/${subscriberId}`
        };
        return this._instance(config);
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
        const signer = await this.getSigner(KeyLevel.LOW);
        const req = {
            name,
            address,
            addressSignature: {
                memberId: this._memberId,
                keyId: signer.getKeyId(),
                signature: signer.signJson(address),
            }
        };
        const config = {
            method: 'post',
            url: `/addresses`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Gets an address by id.
     *
     * @param {string} addressId - address to get
     * @return {Object} response - response to the API call
     */
    async getAddress(addressId) {
        const config = {
            method: 'get',
            url: `/addresses/${addressId}`
        };
        return this._instance(config);
    }

    /**
     * Gets all addresses.
     *
     * @return {Object} response - response to the API call
     */
    async getAddresses() {
        const config = {
            method: 'get',
            url: `/addresses`
        };
        return this._instance(config);
    }

    /**
     * Deletes an address.
     *
     * @param {string} addressId - address to delete
     * @return {Object} response - response to the API call
     */
    async deleteAddress(addressId) {
        const config = {
            method: 'delete',
            url: `/addresses/${addressId}`
        };
        return this._instance(config);
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
       const config = {
           method: 'put',
           url: `/profile`,
           data: req
       };
       return this._instance(config);
    }

    /**
     * Gets a member's public profile.
     *
     * @param {string} id - member id whose profile to get
     * @return {Object} response - response to the API call
     */
    async getProfile(id) {
        const config = {
            method: 'get',
            url: `/members/${id}/profile`,
         };
         return this._instance(config);
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
        const config = {
            method: 'put',
            url: `/profilepicture`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Gets a member's public profile picture.
     *
     * @param {string} id - member Id whose picture to get
     * @param {Object} size - desired size category: SMALL/MEDIUM/LARGE/ORIGINAL
     * @return {Object} response - response to the API call
     */
    async getProfilePicture(id, size) {
        const config = {
            method: 'get',
            url: `/members/${id}/profilepicture/${size}`,
        };
        return this._instance(config);
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
        const config = {
            method: 'post',
            url: `/accounts`,
            data: req
        };
        return this._instance(config);
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
        const config = {
            method: 'delete',
            url: `/accounts`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Gets all accounts linked to the member.
     *
     * @return {Object} response - response to the API call
     */
    async getAccounts() {
        const config = {
            method: 'get',
            url: `/accounts`
        };
        return this._instance(config);
    }

    /**
     * Gets an account.
     *
     * @param {string} accountId - account to get
     * @return {Object} response - response to the API call
     */
    async getAccount(accountId) {
        const config = {
            method: 'get',
            url: `/accounts/${accountId}`
        };
        return this._instance(config);
    }

    /**
     * Sets the name of an account.
     *
     * @param {string} accountId - account
     * @param {string} name - new name
     * @return {Object} response - response to the API call
     */
    async setAccountName(accountId, name) {
        const config = {
            method: 'patch',
            url: `/accounts/${accountId}?name=${name}`
        };
        return this._instance(config);
    }

    /**
     * Gets the balance of an account.
     *
     * @param {string} accountId - accountId
     * @return {Object} response - response to the API call
     */
    async getBalance(accountId) {
        const config = {
            method: 'get',
            url: `/accounts/${accountId}/balance`
        };
        return this._instance(config);
    }

    /**
     * Gets a transaction for an account, by its id.
     *
     * @param {string} accountId - account that initiated the transaction
     * @param {string} transactionId - id of the transaction
     * @return {Object} response - response to the API call
     */
    async getTransaction(accountId, transactionId) {
        const config = {
            method: 'get',
            url: `/accounts/${accountId}/transactions/${transactionId}`
        };
        return this._instance(config);
    }

    /**
     * Gets all transactions for an account.
     *
     * @param {string} accountId - id of the account
     * @param {string} offset - where to start
     * @param {Number} limit - how many to get
     * @return {Object} response - response to the API call
     */
    async getTransactions(accountId, offset, limit) {
        const config = {
            method: 'get',
            url: `/accounts/${accountId}/transactions?offset=${offset}&limit=${limit}`
        };
        return this._instance(config);
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
        const config = {
            method: 'post',
            url: `/blobs`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Gets a blob that is a attached to a token.
     *
     * @param {string} tokenId - id of the token
     * @param {string} blobId - id of the blob
     * @return {Object} response - response to the API call
     */
    async getTokenBlob(tokenId, blobId) {
        const config = {
            method: 'get',
            url: `tokens/${tokenId}/blobs/${blobId}`,
        };
        return this._instance(config);
    }

    /**
     * Gets a blob from the server.
     *
     * @param {string} blobId - id of the blob
     * @return {Object} response - response to the API call
     */
    async getBlob(blobId) {
        const config = {
            method: 'get',
            url: `/blobs/${blobId}`,
        };
        return this._instance(config);
    }

    /**
     * Gets all banks.
     *
     * @return {Object} response - response to the API call
     */
    async getBanks() {
        const config = {
            method: 'get',
            url: `/banks`
        };
        return this._instance(config);
    }

    /**
     * Gets info about a bank.
     *
     * @param {string} bankId - id of the bank to lookup
     * @return {Object} response - response to the API call
     */
    async getBankInfo(bankId) {
        const config = {
            method: 'get',
            url: `/banks/${bankId}/info`
        };
        return this._instance(config);
    }

    //
    // Tokens
    //

    /**
     * Creates a transfer token.
     *
     * @param {Object} payload - payload of the token
     * @return {Object} response - response to the API call
     */
    async createTransferToken(payload) {
        const config = {
            method: 'post',
            url: `/tokens?type=transfer`,
            data: {
                payload,
            }
        };
        return this._instance(config);
    }

    /**
     * Creates an access token.
     *
     * @param {string} username - username of the grantee
     * @param {Array} resources - resources to give access to
     * @return {Object} response - response to the API call
     */
    async createAccessToken(username, resources) {
        const payload = {
            from: {
                id: this._memberId,
            },
            to: {
                username,
             },
            access: {
                resources,
            },
            version: accessTokenVersion,
            refId: Util.generateNonce(),
        };

        const config = {
            method: 'post',
            url: `/tokens?type=access`,
            data: {
                payload,
            }
        };
        return this._instance(config);
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
                version: accessTokenVersion,
                refId: Util.generateNonce(),
            },
        };

        const config = {
            method: 'post',
            url: `/tokens/${cancelTokenId}/replace`,
            data: {
                cancel_token: cancelReq,
                create_token: createReq
            }
        };
        return this._instance(config);
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
            version: accessTokenVersion,
            refId: Util.generateNonce(),
        };

        const createReq = {
            payload,
            payload_signature: await this._tokenOperationSignature(payload, 'endorsed')
        };

        const config = {
            method: 'post',
            url: `/tokens/${cancelTokenId}/replace`,
            data: {
                cancel_token: cancelReq,
                create_token: createReq
            }
        };
        return this._instance(config);
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
     * @return {Object} response - response to the API call
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
     * @return {Object} response - response to the API call
     */
    async redeemToken(transferToken, amount, currency, description, destinations) {
        const payload = {
            refId: Util.generateNonce(),
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

        const signer = await this.getSigner(KeyLevel.LOW);
        const req = {
            payload,
            payloadSignature: {
                memberId: this._memberId,
                keyId: signer.getKeyId(),
                signature: signer.signJson(payload),
            }
        };
        const config = {
            method: 'post',
            url: `/transfers`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Gets a token by its id.
     *
     * @param {string} tokenId - id of the token to get
     * @return {Object} response - response to the API call
     */
    async getToken(tokenId) {
        const config = {
            method: 'get',
            url: `/tokens/${tokenId}`
        };
        return this._instance(config);
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
        const config = {
            method: 'get',
            url: `/tokens?type=${type}&offset=${offset}&limit=${limit}`
        };
        return this._instance(config);
    }

    async _tokenOperation(token, operation, suffix) {
        const tokenId = token.id;
        const config = {
            method: 'put',
            url: `/tokens/${tokenId}/${operation}`,
            data: await this._tokenOperationRequest(token, suffix)
        };
        return this._instance(config);
    }

    async _tokenOperationRequest(token, suffix) {
        return {
            tokenId: token.id,
            signature: await this._tokenOperationSignature(token.payload, suffix)
        };
    }

    async _tokenOperationSignature(tokenPayload, suffix) {
        const payload = stringify(tokenPayload) + `.${suffix}`;
        const signer = await this.getSigner(KeyLevel.STANDARD);
        return {
            memberId: this._memberId,
            keyId: signer.getKeyId(),
            signature: signer.sign(payload),
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
        const config = {
            method: 'get',
            url: `/transfers/${transferId}`
        };
        return this._instance(config);
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
        const config = {
            method: 'get',
            url: `/transfers?tokenId=${tokenId}&offset=${offset}&limit=${limit}`
        };
        return this._instance(config);
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
                            algorithm: key.algorithm
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
                        algorithm: key.algorithm
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
     * Adds a username to the member;
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {string} username - username to add
     * @return {Object} response - response to the API call
     */
    async addUsername(prevHash, username) {
        const update = {
            memberId: this._memberId,
            operations: [
                {
                    addUsername: {
                        username
                    }
                }
            ]
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Adds usernames to the member;
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Array} usernames - usernames to add
     * @return {Object} response - response to the API call
     */
    async addUsernames(prevHash, usernames) {
        const update = {
            memberId: this._memberId,
            operations: usernames.map((username) => ({
                addUsername: {
                    username
                }
            })),
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Removes a username from the member;
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {string} username - username to remove
     * @return {Object} response - response to the API call
     */
    async removeUsername(prevHash, username) {
        const update = {
            memberId: this._memberId,
            operations: [
                {
                    removeUsername: {
                        username
                    }
                }
            ]
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Removes usernames from the member;
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {string} usernames - usernames to remove
     * @return {Object} response - response to the API call
     */
    async removeUsernames(prevHash, usernames) {
        const update = {
            memberId: this._memberId,
            operations: usernames.map((username) => ({
                removeUsername: {
                    username
                }
            })),
        };
        return this._memberUpdate(update, prevHash);
    }

    async _memberUpdate(update, prevHash) {
        if (prevHash !== '') {
            update.prevHash = prevHash;
        }

        const signer = await this.getSigner(KeyLevel.PRIVILEGED);
        const req = {
            update,
            updateSignature: {
                memberId: this._memberId,
                keyId: signer.getKeyId(),
                signature: signer.signJson(update),
            }
        };
        const config = {
            method: 'post',
            url: `/members/${this._memberId}/updates`,
            data: req
        };
        return this._instance(config);
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

        const config = {
            method: 'post',
            url: '/test/create-account',
            data: req,
        };
        return this._instance(config);
    }

    /**
     * Gets test bank notification.
     *
     * @param {string} subscriberId - id of subscriber
     * @param {string} notificationId - id of notification
     * @return {Object} response - response to the API call
     */
    async getTestBankNotification(subscriberId, notificationId) {
        const config = {
            method: 'get',
            url: `/test/subscribers/${subscriberId}/notifications/${notificationId}`,
        };
        return this._instance(config);
    }

    /**
     * Gets test bank notifications.
     *
     * @param {string} subscriberId - id of subscriber
     * @return {Object} response - response to the API call
     */
    async getTestBankNotifications(subscriberId) {
        const config = {
            method: 'get',
            url: `/test/subscribers/${subscriberId}/notifications`,
        };
        return this._instance(config);
    }
}

export default AuthHttpClient;

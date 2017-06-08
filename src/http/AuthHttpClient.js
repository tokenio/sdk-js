import Crypto from "../security/Crypto";
import Util from "../Util";
import AuthHeader from "./AuthHeader";
import AuthContext from "./AuthContext"
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
     * @param {CryptoEngine} cryptoEngine - engine to use for signing
     * @param {function} globalRpcErrorCallback - callback to invoke on any cross-cutting RPC
     * call error. For example: SDK version mismatch
     */
    constructor(env, memberId, cryptoEngine, globalRpcErrorCallback){
        this._instance = axios.create({
            baseURL: urls[env]
        });
        this._memberId = memberId;

        // Creates the necessary signers
        this._signerLow = cryptoEngine.createSigner(KeyLevel.LOW);
        this._signerStandard = cryptoEngine.createSigner(KeyLevel.LOW);
        this._signerPrivileged = cryptoEngine.createSigner(KeyLevel.LOW);
        try {
            this._signerStandard = cryptoEngine.createSigner(KeyLevel.STANDARD);
        } catch (err) {
            this._signerStandard = this._signerLow; // If no Standard signer, uses Low
        }
        try {
            this._signerPrivileged = cryptoEngine.createSigner(KeyLevel.PRIVILEGED);
        } catch (err) {
            this._signerPrivileged = this._signerLow; // If no Privileged signer, uses Low
        }
        this._context = new AuthContext();
        this._authHeader = new AuthHeader(urls[env], this._signerLow);

        this._resetRequestInterceptor();

        const errorHandler = new ErrorHandler(globalRpcErrorCallback);
        this._instance.interceptors.response.use(null, (error) => {
            throw errorHandler.handleError(error);
        })
    }

    _resetRequestInterceptor() {
        this._instance.interceptors.request.eject(this._interceptor);

        const versionHeader = new VersionHeader();
        this._interceptor = this._instance.interceptors.request.use((config) => {
            this._authHeader.addAuthorizationHeader(this._memberId, config, this._context);
            versionHeader.addVersionHeader(config);
            return config;
        })
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
    subscribeToNotifications(handler, handlerInstructions) {
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
    getSubscribers() {
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
    getSubscriber(subscriberId) {
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
    getNotifications(offset, limit) {
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
    getNotification(notificationId) {
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
    unsubscribeFromNotifications(subscriberId) {
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
    addAddress(name, address) {
        const req = {
            name,
            address,
            addressSignature: {
                memberId: this._memberId,
                keyId: this._signerLow.getKeyId(),
                signature: this._signerLow.signJson(address),
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
    getAddress(addressId) {
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
    getAddresses() {
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
    deleteAddress(addressId) {
        const config = {
            method: 'delete',
            url: `/addresses/${addressId}`
        };
        return this._instance(config);
    }

    //
    // ACCOUNTS
    //

    /**
     * Links accounts to the member.
     *
     * @param {Object} bankAuthoriation - encrypted authorization to accounts
     * @return {Object} response - response to the API call
     */
    linkAccounts(bankAuthorization) {
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
    unlinkAccounts(accountIds) {
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
    getAccounts() {
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
    getAccount(accountId) {
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
    setAccountName(accountId, name) {
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
    getBalance(accountId) {
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
    getTransaction(accountId, transactionId) {
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
    getTransactions(accountId, offset, limit) {
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
    createBlob(ownerId, type, name, data) {
        const req = {
            payload: {
                ownerId,
                type,
                name,
                data: base64js.fromByteArray(data),
            },
        }
        const config = {
            method: 'post',
            url: `/blobs`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Gets a blob.
     *
     * @param {string} blobId
     * @return {Object} response - response to the API call
     */
    getBlob(blobId) {
        const req = {
            blobId,
        }
        const config = {
            method: 'get',
            url: `/blobs/${blobId}`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Gets a blob that is a attached to a token.
     *
     * @param {string} tokenId
     * @param {string} blobId
     * @return {Object} response - response to the API call
     */
    getTokenBlob(tokenId, blobId) {
        const req = {
            tokenId,
            blobId,
        }
        const config = {
            method: 'get',
            url: `tokens/${tokenId}/blobs/${blobId}`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Gets a blob from the server.
     *
     * @param {string} blobId
     * @return {Object} response - response to the API call
     */
    getBlob(blobId) {
        const req = {
            blobId,
        }
        const config = {
            method: 'get',
            url: `/blobs/${blobId}`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Gets all banks.
     *
     * @return {Object} response - response to the API call
     */
    getBanks() {
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
    getBankInfo(bankId) {
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
    createTransferToken(payload) {
        const config = {
            method: 'post',
            url: `/tokens`,
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
    createAccessToken(username, resources) {
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
            url: `/tokens`,
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
    replaceToken(tokenToCancel, newResources) {
        const cancelTokenId = tokenToCancel.id;
        const cancelReq = this._tokenOperationRequest(tokenToCancel, 'cancelled');

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
    replaceAndEndorseToken(tokenToCancel, newResources) {
        const cancelTokenId = tokenToCancel.id;
        const cancelReq = this._tokenOperationRequest(tokenToCancel, 'cancelled');

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
            payload_signature: this._tokenOperationSignature(payload, 'endorsed')
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
    endorseToken(token) {
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
    cancelToken(token) {
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
    redeemToken(transferToken, amount, currency, description, destinations) {
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

        const req = {
            payload,
            payloadSignature: {
                memberId: this._memberId,
                keyId: this._signerLow.getKeyId(),
                signature: this._signerLow.signJson(payload),
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
    getToken(tokenId) {
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
    getTokens(type, offset, limit) {
        const config = {
            method: 'get',
            url: `/tokens?type=${type}&offset=${offset}&limit=${limit}`
        };
        return this._instance(config);
    }

    _tokenOperation(token, operation, suffix) {
        const tokenId = token.id;
        const config = {
            method: 'put',
            url: `/tokens/${tokenId}/${operation}`,
            data: this._tokenOperationRequest(token, suffix)
        };
        return this._instance(config);
    }

    _tokenOperationRequest(token, suffix) {
        return {
            tokenId: token.id,
            signature: this._tokenOperationSignature(token.payload, suffix)
        };
    }

    _tokenOperationSignature(tokenPayload, suffix) {
        const payload = stringify(tokenPayload) + `.${suffix}`;
        return {
            memberId: this._memberId,
            keyId: this._signerStandard.getKeyId(),
            signature: this._signerStandard.sign(payload),
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
    getTransfer(transferId) {
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
    getTransfers(tokenId, offset, limit) {
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
     * Gets the member's information.
     *
     * @return {Object} response - response to the API call
     */
    getMember() {
        const config = {
            method: 'get',
            url: `/members`
        };
        return this._instance(config);
    }

    /**
     * Adds a key to the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Object} key - key to add
     * @return {Object} response - response to the API call
     */
    approveKey(prevHash, key) {
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
    approveKeys(prevHash, keys) {
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
    removeKey(prevHash, keyId) {
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
    removeKeys(prevHash, keyIds) {
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
    addUsername(prevHash, username) {
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
    addUsernames(prevHash, usernames) {
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
    removeUsername(prevHash, username) {
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
    removeUsernames(prevHash, usernames) {
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

    _memberUpdate(update, prevHash) {
        if (prevHash !== '') {
            update.prevHash = prevHash;
        }

        const req = {
            update,
            updateSignature: {
                memberId: this._memberId,
                keyId: this._signerPrivileged.getKeyId(),
                signature: this._signerPrivileged.signJson(update),
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
     * @param {string} bankId - bankId of the test bank to use
     * @return {Object} response - response to the API call
     */
    createTestBankAccount(balance, currency, bankId) {
        const req = {
            balance: {
                currency,
                value: balance,
            },
        };

        if (bankId) {
            req.tags = [{
                key: 'bank-id',
                value: bankId,
            }];
        }
        const config = {
            method: 'post',
            url: '/test/create-account',
            data: req,
        };
        return this._instance(config);
    }
}

export default AuthHttpClient;

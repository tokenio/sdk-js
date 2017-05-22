import AuthHttpClient from "../http/AuthHttpClient";
import TransferTokenBuilder from "./TransferTokenBuilder";
import Util from "../Util";
import {maxDecimals, KeyLevel} from "../constants";

/**
 * Member object. Allows member-wide actions. Some calls return a promise, and some return
 * objects
 *
 */
export default class Member {

    /**
     * Represents a Member
     *
     * @constructor
     * @param {string} env - The environment to use for this member
     * @param {string} memberId - The id of this memberId
     * @param {object} cryptoEngine - the cryptoEngine to use for signing and key storage
     * @param {function} globalRpcErrorCallback - callback to invoke on any cross-cutting RPC
     * call error. For example: SDK version mismatch
     */
    constructor(env, memberId, cryptoEngine, globalRpcErrorCallback) {
        this._id = memberId;
        this._client = new AuthHttpClient(env, memberId, cryptoEngine, globalRpcErrorCallback);
    }

    /**
     * Gets the memberId
     *
     * @return {string} memberId
     */
    memberId() {
        return this._id;
    }

    /**
     * Gets all of the member's usernames
     *
     * @return {Promise} usernames - member's usernames
     */
    usernames() {
        return Util.callAsync(this.usernames, async () => {
            const member = await this._getMember();
            return member.usernames;
        });
    }

    /**
     * Gets the member's first username
     *
     * @return {Promise} username - member's username
     */
    firstUsername() {
        return Util.callAsync(this.firstUsername, async () => {
            const member = await this._getMember();
            return member.usernames.length ? member.usernames[0] : undefined;
        });
    }

    /**
     * Gets the member's public keys
     *
     * @return {Promise} keys - keys objects
     */
    keys() {
        return Util.callAsync(this.keys, async () => {
            const member = await this._getMember();
            return member.keys;
        });
    }

    /**
     * Sets the access token id to be used with this client.
     *
     * @param {string} accessTokenId - the access token id
     */
    useAccessToken(accessTokenId) {
        this._client.useAccessToken(accessTokenId);
    }

    /**
     * Clears the access token id used with this client.
     */
    clearAccessToken() {
        this._client.clearAccessToken();
    }


    /**
     * Approves a new key for this member
     *
     * @param {Object} key - key to add
     * @return {Promise} empty - empty promise
     */
    approveKey(key) {
        return Util.callAsync(this.approveKey, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.approveKey(prevHash, key);
            return;
        });
    }

    /**
     * Approves new keys for this member
     *
     * @param {Array} keys - keys to add
     * @return {Promise} empty - empty promise
     */
    approveKeys(keys) {
        return Util.callAsync(this.approveKeys, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.approveKeys(prevHash, keys);
            return;
        });
    }

    /**
     * Removes a key from this member
     *
     * @param {string} keyId - keyId to remove. Note, keyId is the hash of the pk
     * @return {Promise} empty - empty promise
     */
    removeKey(keyId) {
        return Util.callAsync(this.removeKey, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeKey(prevHash, keyId);
            return;
        });
    }

    /**
     * Removes keys from this member
     *
     * @param {Array} keyIds - keyIds to remove. Note, keyId is the hash of the pk
     * @return {Promise} empty - empty promise
     */
    removeKeys(keyIds) {
        return Util.callAsync(this.removeKeys, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeKeys(prevHash, keyIds);
            return;
        });
    }

    /**
     * Adds a username to this member
     *
     * @param {string} username - username to add
     * @return {Promise} empty - empty promise
     */
    addUsername(username) {
        return Util.callAsync(this.addUsername, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.addUsername(prevHash, username);
            return;
        });
    }

    /**
     * Adds usernames to this member
     *
     * @param {Array} usernames - usernames to add
     * @return {Promise} empty - empty promise
     */
    addUsernames(usernames) {
        return Util.callAsync(this.addUsernames, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.addUsernames(prevHash, usernames);
            return;
        });
    }

    /**
     * Removes a username from the memberId
     *
     * @param {string} username - username to remove
     * @return {Promise} empty - empty promise
     */
    removeUsername(username) {
        return Util.callAsync(this.removeUsername, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeUsername(prevHash, username);
            return;
        });
    }

    /**
     * Removes usernames from the memberId
     *
     * @param {Array} usernames - usernames to remove
     * @return {Promise} empty - empty promise
     */
    removeUsernames(usernames) {
        return Util.callAsync(this.removeUsernames, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeUsernames(prevHash, usernames);
            return;
        });
    }

    /**
     * Links bank accounts to the member
     *
     * @param {string} bankId - bank to link
     * @param {string} bankAuthorization - bankAuthorization obtained from bank
     * @return {Promise} accounts - Promise resolving the the Accounts linked
     */
    linkAccounts(bankAuthorization) {
        return Util.callAsync(this.linkAccounts, async () => {
            const res = await this._client.linkAccounts(bankAuthorization);
            return res.data.accounts;
        });
    }

    /**
     * Unlinks bank accounts previously linked by the linkAccounts call.
     *
     * @param {Array} accountIds - account ids to unlink
     * @returns {Promise} empty - empty promise
     */
    unlinkAccounts(accountIds)  {
        return Util.callAsync(this.unlinkAccounts, async() => {
            await this._client.unlinkAccounts(accountIds);
            return;
        })
    }

    /**
     * Looks up the member's accounts
     *
     * @return {Promise} accounts - Promise resolving to the accounts
     */
    getAccounts() {
        return Util.callAsync(this.getAccounts, async () => {
            const res = await this._client.getAccounts();
            return res.data.accounts === undefined
                ? []
                : res.data.accounts;
        });
    }

    /**
     * Looks up a member's account by Id
     *
     * @return {Promise} account - Promise resolving to the account
     */
    getAccount(accountId) {
        return Util.callAsync(this.getAccount, async () => {
            const res = await this._client.getAccount(accountId);
            return res.data.account === undefined
                ? []
                : res.data.account;
        });
    }

    /**
     * Gets a list of all available banks for linking
     *
     * @return {Array[object]} banks - list of banks
     */
    getBanks() {
        return Util.callAsync(this.getBanks, async () => {
            const res = await this._client.getBanks();
            return res.data.banks;
        });
    }

    /**
     * Gets the info of a bank, including a link for pairing accounts at this bank
     *
     * @param {string} bankId - id of the bank
     * @returns {Object} bankInfo - info
     */
    getBankInfo(bankId) {
        return Util.callAsync(this.getBankInfo, async () => {
            const res = await this._client.getBankInfo(bankId);
            return res.data.info;
        });
    }

    /**
     * Creates a subscriber to receive notifications of member events, such as step up auth,
     * new device requests, linking account requests, or transfer notifications
     *
     * @param {string} handler - who is handling the notifications
     * @param {string} handlerInstructions - how to send the notification
     * @return {Promise} subscriber - Subscriber
     */
    subscribeToNotifications(
        handler = "token",
        handlerInstructions = {}) {
        return Util.callAsync(this.subscribeToNotifications, async () => {
            const res = await this._client.subscribeToNotifications(handler, handlerInstructions);
            return res.data.subscriber;
        })
    }

    /**
     * Gets all subscribers for this member
     *
     * @return {Promise} - subscribers
     */
    getSubscribers() {
        return Util.callAsync(this.getSubscribers, async () => {
            const res = await this._client.getSubscribers();
            return res.data.subscribers === undefined
                ? []
                : res.data.subscribers;
        });
    }

    /**
     * Gets a specific subscriber by Id
     *
     * @param {string} subscriberId - id of the subscriber
     * @return {Promise} - subscriber
     */
    getSubscriber(subscriberId) {
        return Util.callAsync(this.getSubscriber, async () => {
            const res = await this._client.getSubscriber(subscriberId);
            return res.data.subscriber;
        });
    }

    /**
     * Gets all notifications for this member
     *
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to look for
     * @return {Promise} - notifications
     */
    getNotifications(offset, limit) {
        return Util.callAsync(this.getNotifications, async () => {
            const res = await this._client.getNotifications(offset, limit);
            const data = res.data.notifications === undefined
                    ? []
                    : res.data.notifications;
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Gets a specific notification by Id
     *
     * @param {string} notificationId - id of the notification
     * @return {Promise} - notification
     */
    getNotification(notificationId) {
        return Util.callAsync(this.getNotification, async () => {
            const res = await this._client.getNotification(notificationId);
            return res.data.notification;
        });
    }

    /**
     * Unsubscribes from notifications (removes a subscriber)
     *
     * @param {string} subscriberId - subscriber to remove
     * @return {Promise} empty - empty promise
     */
    unsubscribeFromNotifications(subscriberId) {
        return Util.callAsync(this.unsubscribeFromNotifications, async () => {
            await this._client.unsubscribeFromNotifications(subscriberId);
            return;
        });
    }

    /**
     * Creates an address for this member, and saves it
     *
     * @param {string} name - name of the address (e.g 'Home')
     * @param {object} address - address
     * @return {Promise} empty - empty promise
     */
    addAddress(name, address) {
        return Util.callAsync(this.addAddress, async () => {
            const res = await this._client.addAddress(name, address);
            return res.data.address;
        });
    }

    /**
     * Gets the member's address
     *
     * @param {string} addressId - the address id
     * @return {Promise} address - the address
     */
    getAddress(addressId) {
        return Util.callAsync(this.getAddress, async () => {
            const res = await this._client.getAddress(addressId);
            return res.data.address;
        });
    }

    /**
     * Gets the member's addresses
     *
     * @return {Promise} addresses - Addresses
     */
    getAddresses() {
        return Util.callAsync(this.getAddresses, async () => {
            const res = await this._client.getAddresses();
            return res.data.addresses === undefined
                ? []
                : res.data.addresses;
        });
    }

    /**
     * Deletes a member's address by id
     *
     * @param {string} addressId - the address id
     * @return {Promise} empty - empty promise
     */
    deleteAddress(addressId) {
        return Util.callAsync(this.deleteAddress, async () => {
            const res = await this._client.deleteAddress(addressId);
            return;
        });
    }

    /**
     * Creates a new unendorsed access token.
     *
     * @param {string} username - the username of the grantee of the Access Token
     * @param {array} resources - a list of resources to give access to
     * @return {Promise} token - promise of a created Access Token
     */
    createAccessToken(username, resources) {
        return Util.callAsync(this.createAccessToken, async () => {
            const res = await this._client.createAccessToken(username, resources);
            return res.data.token;
        });
    }

    /**
     * Cancels the existing token and creates a replacement for it.
     *
     * @param {Object} tokenToCancel - the old token to cancel
     * @param {Array} newResources - the new resources for this token to grant access to
     * @returns {Promise} operationResult - the result of the operation
     */
    replaceAccessToken(tokenToCancel, newResources) {
        return Util.callAsync(this.replaceAccessToken, async () => {
            const finalTokenToCancel = await this._resolveToken(tokenToCancel);
            const res = await this._client.replaceToken(
                finalTokenToCancel,
                newResources);
            return res.data.result;
        });
    }

    /**
     * Cancels the existing token, creates a replacement and endorses it.
     *
     * @param {Object} tokenToCancel - the old token to cancel
     * @param {Array} newResources - the new resources for this token to grant access to
     * @returns {Promise} operationResult - the result of the operation
     */
    replaceAndEndorseAccessToken(tokenToCancel, newResources) {
        return Util.callAsync(this.replaceAndEndorseAccessToken, async () => {
            const finalTokenToCancel = await this._resolveToken(tokenToCancel);
            const res = await this._client.replaceAndEndorseToken(
                finalTokenToCancel,
                newResources);
            return res.data.result;
        });
    }

    /**
     * Creates a transfer token builder, that when executed, will create an transfer token by
     * performing an API call.
     *
     * @param {double} lifetimeAmount - amount limit on the token
     * @param {string} currency - 3 letter currency code ('EUR', 'USD', etc)
     * @return {TransferTokenBuilder} builder - builder for the token
     */
    createTransferToken(lifetimeAmount, currency) {
        return Util.callSync(this.createTransferToken, () => {
            return new TransferTokenBuilder(this._client, this, lifetimeAmount, currency);
        });
    }

    /**
     * Looks up a token by its Id
     *
     * @param {string} tokenId - id of the token
     * @return {Promise} token - token
     */
    getToken(tokenId) {
        return Util.callAsync(this.getToken, async () => {
            const res = await this._client.getToken(tokenId);
            return res.data.token;
        });
    }

    /**
     * Looks up all transfer tokens
     *
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to look for
     * @return {Promise} tokens - returns a list of Transfer Tokens
     */
    getTransferTokens(offset, limit) {
        return Util.callAsync(this.getTransferTokens, async () => {
            const res = await this._client.getTokens('TRANSFER', offset, limit);
            const data = res.data.tokens === undefined
                    ? []
                    : res.data.tokens;
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Looks up all access tokens
     *
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to look for
     * @return {Promise} access tokens - returns a list of access tokens
     */
    getAccessTokens(offset, limit) {
        return Util.callAsync(this.getAccessTokens, async () => {
            const res = await this._client.getTokens('ACCESS', offset, limit);
            const data = res.data.tokens === undefined
                    ? []
                    : res.data.tokens;
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Endorses a token
     *
     * @param {Token} token - Transfer token to endorse. Can also be a {string} tokenId
     * @return {Promise} token - Promise of endorsed transfer token
     */
    endorseToken(token) {
        return Util.callAsync(this.endorseToken, async () => {
            const finalToken = await this._resolveToken(token);
            const endorsed = await this._client.endorseToken(finalToken);
            if (typeof token !== 'string' && !(token instanceof String)) {
                token.payloadSignatures = endorsed.data.result.token.payloadSignatures;
            }
            return endorsed.data.result;
        });
    }

    /**
     * Cancels a token. (Called by the payer or the redeemer)
     *
     * @param {Token} token - token to cancel. Can also be a {string} tokenId
     * @return {Promise} TokenOperationResult - cancelled token
     */
    cancelToken(token) {
        return Util.callAsync(this.cancelToken, async () => {
            const finalToken = await this._resolveToken(token);
            const cancelled = await this._client.cancelToken(finalToken);
            if (typeof token !== 'string' && !(token instanceof String)) {
                token.payloadSignatures = cancelled.data.result.token.payloadSignatures;
            }
            return cancelled.data.result;
        });
    }

    /**
     * Redeems a token. (Called by the payee or redeemer)
     *
     * @param {object} token - token to redeem. Can also be a {string} tokenId
     * @param {int} amount - amount to redeemer
     * @param {string} currency - currency to redeem
     * @param {string} description - optional transfer description
     * @param {arr} destinations - transfer destinations
     * @return {Promise} transfer - Transfer created as a result of this redeem call
     */
    redeemToken(token, amount, currency, description, destinations = []) {
        return Util.callAsync(this.redeemToken, async () => {
            const finalToken = await this._resolveToken(token);
            if (amount === undefined) {
                amount = finalToken.payload.transfer.amount;
            }
            if (currency === undefined) {
                currency = finalToken.payload.transfer.currency;
            }
            if (Util.countDecimals(amount) > maxDecimals) {
                throw new Error(`Number of decimals in amount should be at most ${maxDecimals}`);
            }
            const res = await this._client.redeemToken(
                finalToken,
                amount,
                currency,
                description,
                destinations)
            return res.data.transfer;
        })
    }

    /**
     * Looks up a transfer
     *
     * @param {string} transferId - id to look up
     * @return {Promise} transfer - transfer if found
     */
    getTransfer(transferId) {
        return Util.callAsync(this.getTransfer, async () => {
            const res = await this._client.getTransfer(transferId);
            return res.data.transfer;
        });
    }

    /**
     * Looks up all of the member's transfers
     *
     * @param {string} tokenId - token to use for lookup
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to retrieve
     * @return {Promise} transfers - Transfers
     */
    getTransfers(tokenId, offset, limit) {
        return Util.callAsync(this.getTransfers, async () => {
            const res = await this._client.getTransfers(tokenId, offset, limit);
            const data = res.data.transfers === undefined
                    ? []
                    : res.data.transfers;
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Looks up the balance of an account
     *
     * @param {string} accountId - id of the account
     * @return {Promise} balance - Promise of balance object
     */
    getBalance(accountId) {
        return Util.callAsync(this.getBalance, async () => {
            const res = await this._client.getBalance(accountId);
            return res.data;
        });
    }

    /**
     * Looks up a transaction
     *
     * @param {string} accountId - id of the account
     * @param {string} transactionId - which transaction to look up
     * @return {Promise} transaction - the Transaction
     */
    getTransaction(accountId, transactionId) {
        return Util.callAsync(this.getTransaction, async () => {
            const res = await this._client.getTransaction(accountId, transactionId);
            return res.data.transaction;
        });
    }

    /**
     * Looks up all of the member's transactions for an account
     *
     * @param {string} accountId - id of the account
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to retrieve
     * @return {Promise} transactions - Transactions
     */
    getTransactions(accountId, offset, limit) {
        return Util.callAsync(this.getTransactions, async () => {
            const res = await this._client.getTransactions(accountId, offset, limit);
            const data = res.data.transactions === undefined
                    ? []
                    : res.data.transactions;
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Uploads a blob to the server.
     *
     * @param {string} ownerId - owner of the blob
     * @param {string} type - MIME type
     * @param {string} name - name of the file
     * @param {Buffer} data - data in bytes
     * @return {Object} attachment - attachment
     */
    uploadAttachment(ownerId, type, name, data) {
        return Util.callAsync(this.uploadAttachment, async () => {
            const res = await this._client.createBlob(ownerId, type, name, data)
            return {
                blobId: res.data.blobId,
                type,
                name,
            };
        });
    }

    /**
     * Downloads a blob from the server.
     *
     * @param {string} blobId - id of the blob
     * @return {Object} blob - downloaded blob
     */
    downloadAttachment(blobId) {
        return Util.callAsync(this.downloadAttachment, async () => {
            const res = await this._client.getBlob(blobId)
            return res.data.blob;
        });
    }

    /**
     * Downloads a blob from the server, that is attached to a token.
     *
     * @param {string} tokenId - id of the token
     * @param {string} blobId - id of the blob
     * @return {Object} blob - downloaded blob
     */
    downloadTokenAttachment(tokenId, blobId) {
        return Util.callAsync(this.downloadTokenAttachment, async () => {
            const res = await this._client.getTokenBlob(tokenId, blobId)
            return res.data.blob;
        });
    }

    /**
     * Creates a test bank account in a fake bank
     *
     * @param {double} balance - balance of the account
     * @param {string} currency - currency of the account
     * @param {string} bankId - bankId of the test bank to use
     * @returns {Array} bank authorization to use with linkAccounts
     */
    createTestBankAccount(balance, currency, bankId) {
        return Util.callAsync(this.createTestBankAccount, async () => {
            const res = await this._client.createTestBankAccount(balance, currency, bankId);
            return res.data.bankAuthorization;
        });
    }

    _getPreviousHash() {
        return Util.callAsync(this._getPreviousHash, async () => {
            const member = await this._getMember();
            return member.lastHash;
        });
    }

    _getMember() {
        return Util.callAsync(this._getMember, async () => {
            const res = await this._client.getMember();
            return res.data.member;
        });
    }

    _resolveToken(token) {
        return new Promise((resolve, reject) => {
            if (typeof token === 'string' || token instanceof String) {
                this.getToken(token)
                    .then(lookedUp => resolve(lookedUp));
            } else {
                resolve(token);       // Token, already in json representation
            }
        });
    }
}

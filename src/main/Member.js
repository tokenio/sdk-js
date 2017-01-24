import Crypto from "../Crypto";
import LocalStorage from "../LocalStorage";
import AuthHttpClient from "../http/AuthHttpClient";
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
     * @param {string} memberId - The id of this memberId
     * @param {object} keys - An object representing the keypair of the user
     */
    constructor(env, memberId, keys) {
        this._id = memberId;
        this._keys = keys;
        this._client = new AuthHttpClient(env, memberId, keys);
    }

    /**
     * Gets the memberId
     *
     * @return {string} memberId
     */
    get id() {
        return this._id;
    }

    /**
     * Returns the member's key pair
     *
     * @return {object} keyPair
     */
    get keys() {
        return this._keys;
    }

    /**
     * Save the member to localStorage, to be loaded in the future. Only works on browsers
     */
    saveToLocalStorage() {
        LocalStorage.saveMember(this);
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
     * @param {string} keyLevel - Security level of this new key. PRIVILEGED is root security
     * @return {Promise} empty - empty promise
     */
    approveKey(key, keyLevel = KeyLevel.PRIVILEGED) {
        return Util.callAsync(this.approveKey, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.addKey(prevHash, key, keyLevel);
            return;
        });
    }

    /**
     * Removes a key from this member
     *
     * @param {string} keyId - keyId to remove. Note, keyId is the hash of the pk
     * @return {Promise} empty empty promise
     */
    removeKey(keyId) {
        return Util.callAsync(this.removeKey, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeKey(prevHash, keyId);
            return;
        });
    }

    /**
     * Adds an username to this member
     *
     * @param {string} username - username to add
     * @return {Promise} empty empty promise
     */
    addUsername(username) {
        return Util.callAsync(this.addUsername, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.addUsername(prevHash, username);
            return;
        });
    }

    /**
     * Removes an username from the memberId
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
     * Links bank accounts to the member
     *
     * @param {string} bankId - bank to link
     * @param {string} accountLinkPayloads - accountLinkPayload obtained from bank
     * @return {Promise} accounts - Promise resolving the the Accounts linked
     */
    linkAccounts(bankId, accountLinkPayloads) {
        return Util.callAsync(this.linkAccounts, async () => {
            const res = await this._client.linkAccounts(bankId, accountLinkPayloads);
            return res.data.accounts;
        });
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
            return res.data === undefined
                ? []
                : res.data;
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
     * @param {string} target - the notification target for this device. (e.g iOS push token)
     * @param {string} platform - platform of the devices (IOS, ANDROID, WEB, etc)
     * @return {Promise} subscriber - Subscriber
     */
    subscribeToNotifications(
        target,
        platform = "IOS") {
        return Util.callAsync(this.subscribeToNotifications, async () => {
            const res = await this._client.subscribeToNotifications(target, platform);
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
     * @return {Promise} - notifications
     */
    getNotifications() {
        return Util.callAsync(this.getNotifications, async () => {
            const res = await this._client.getNotifications();
            return res.data.notifications === undefined
                ? []
                : res.data.notifications;
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
     * Gets the member's addresse
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
     * Gets all of the member's usernames
     *
     * @return {Promise} usernames - member's usernames
     */
    getAllUsernames() {
        return Util.callAsync(this.getAllUsernames, async () => {
            const member = await this._getMember();
            return member.usernames;
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
     * @param {string} newUsername - the username of the old grantee
     * @returns {array] newResources - the new resources for this token to grant access to
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
     * @param {string} newUsername - the username of the old grantee
     * @returns {array] newResources - the new resources for this token to grant access to
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
     * Creates an unendorsed Transfer Token
     *
     * @param {string} accountId - id of the source account
     * @param {double} lifetimeAmount - amount limit on the token
     * @param {string} currency - 3 letter currency code ('EUR', 'USD', etc)
     * @param {string} username - username of the redeemer of this token
     * @param {string} description - optional description for the token
     * @param {double} amount - optional charge limit on the token
     * @return {Promise} token - promise of a created transfer token
     */
    createToken(accountId, lifetimeAmount, currency, username, description = undefined, amount=0) {
        if (Util.countDecimals(lifetimeAmount) > maxDecimals) {
            throw new Error(`Number of decimals in lifetimeAmount should be at most ${maxDecimals}`);
        }
        if (Util.countDecimals(amount) > maxDecimals) {
            throw new Error(`Number of decimals in amount should be at most ${maxDecimals}`);
        }
        return Util.callAsync(this.createToken, async () => {
            const res = await this._client.createTransferToken(
                this._id,
                accountId,
                lifetimeAmount,
                currency,
                username,
                description,
                amount);
            return res.data.token;
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
     * Looks up all transfer tokens (not just for this account)
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
     * Looks up all access tokens (not just for this account)
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
    createTransfer(token, amount, currency, description, destinations = []) {
        return Util.callAsync(this.createTransfer, async () => {
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
            const res = await this._client.createTransfer(finalToken, amount, currency, description, destinations)
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
            return {
                data: res.data.transactions,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Gets the member's public keys
     *
     * @return {Promise} keys - keys objects
     */
    getPublicKeys() {
        return Util.callAsync(this.getPublicKeys, async () => {
            const member = await this._getMember();
            return member.keys;
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

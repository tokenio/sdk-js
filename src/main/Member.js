import Crypto from "../Crypto";
import LocalStorage from "../LocalStorage";
import Account from "./Account";
import Subscriber from "./Subscriber";
import Address from "./Address";
import KeyLevel from "./KeyLevel";
import AuthHttpClient from "../http/AuthHttpClient";
import PagedResult from "./PagedResult";
import TokenOperationResult from "./TokenOperationResult";
import TransferToken from "./TransferToken";
import AccessToken from "./AccessToken";
import Transfer from "./Transfer";
import Util from "../Util";
import {maxDecimals} from "../constants";

/**
 * Member object. Allows member-wide actions. Some calls return a promise, and some return
 * objects
 */
export default class Member {

    /**
     * Represents a Member
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
     * @return {string} memberId
     */
    get id() {
        return this._id;
    }

    /**
     * Returns the member's key pair
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
     * @param {Buffer} publicKey - key to add
     * @param {string} keyLevel - Security level of this new key. PRIVILEGED is root security
     * @return {Promise} empty - empty promise
     */
    approveKey(publicKey, keyLevel = KeyLevel.PRIVILEGED) {
        return Util.tryToDo(this.approveKey, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.addKey(prevHash, Crypto.bufferKey(publicKey), keyLevel);
            return;
        });
    }

    /**
     * Removes a key from this member
     * @param {string} keyId - keyId to remove. Note, keyId is the hash of the pk
     * @return {Promise} empty empty promise
     */
    removeKey(keyId) {
        return Util.tryToDo(this.removeKey, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeKey(prevHash, keyId);
            return;
        });
    }

    /**
     * Adds an username to this member
     * @param {string} username - username to add
     * @return {Promise} empty empty promise
     */
    addUsername(username) {
        return Util.tryToDo(this.addUsername, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.addUsername(prevHash, username);
            return;
        });
    }

    /**
     * Removes an username from the memberId
     * @param {string} username - username to remove
     * @return {Promise} empty - empty promise
     */
    removeUsername(username) {
        return Util.tryToDo(this.removeUsername, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeUsername(prevHash, username);
            return;
        });
    }

    /**
     * Links bank accounts to the member
     * @param {string} bankId - bank to link
     * @param {string} accountLinkPayloads - accountLinkPayload obtained from bank
     * @return {Promise} accounts - Promise resolving the the Accounts linked
     */
    linkAccounts(bankId, accountLinkPayloads) {
        return Util.tryToDo(this.linkAccounts, async () => {
            const res = await this._client.linkAccounts(bankId, accountLinkPayloads);
            return res.data.accounts.map(acc => new Account(this, acc));
        });
    }

    /**
     * Looks up the member's accounts
     * @return {Promise} accounts - Promise resolving to the accounts
     */
    getAccounts() {
        return Util.tryToDo(this.getAccounts, async () => {
            const res = await this._client.getAccounts();
            return res.data.accounts.map(acc => new Account(this, acc));
        });
    }

    /**
     * Creates a subscriber to receive notifications of member events, such as step up auth,
     * new device requests, linking account requests, or transfer notifications
     * @param {string} target - the notification target for this device. (e.g iOS push token)
     * @param {string} platform - platform of the devices (IOS, ANDROID, WEB, etc)
     * @return {Promise} subscriber - Subscriber object
     */
    subscribeToNotifications(
        target,
        platform = "IOS") {
        return Util.tryToDo(this.subscribeToNotifications, async () => {
            const res = await this._client.subscribeToNotifications(target, platform);
            return new Subscriber(res.data.subscriber);
        })
    }

    /**
     * Gets all subscribers for this member
     *
     * @return {Promise} - subscribers
     */
    getSubscribers() {
        return Util.tryToDo(this.getSubscribers, async () => {
            const res = await this._client.getSubscribers();
            return res.data.subscribers.map(s => new Subscriber(s));
        });
    }

    /**
     * Gets a specific subscriber by Id
     *
     * @param {string} subscriberId - id of the subscriber
     * @return {Promise} - subscriber
     */
    getSubscriber(subscriberId) {
        return Util.tryToDo(this.getSubscriber, async () => {
            const res = await this._client.getSubscriber(subscriberId);
            return new Subscriber(res.data.subscriber);
        });
    }

    /**
     * Unsubscribes from notifications (removes a subscriber)
     * @param {string} subscriberId - subscriber to remove
     * @return {Promise} empty - empty promise
     */
    unsubscribeFromNotifications(subscriberId) {
        return Util.tryToDo(this.unsubscribeFromNotifications, async () => {
            await this._client.unsubscribeFromNotifications(subscriberId);
            return;
        });
    }

    /**
     * Creates an address for this member, and saves it
     * @param {string} name - name of the address (e.g 'Home')
     * @param {object} address - address
     * @return {Promise} empty - empty promise
     */
    addAddress(name, address) {
        return Util.tryToDo(this.addAddress, async () => {
            const res = await this._client.addAddress(name, address);
            return new Address(res.data.address);
        });
    }

    /**
     * Gets the member's addresse
     *
     * @param {string} addressId - the address id
     * @return {Promise} address - the address
     */
    getAddress(addressId) {
        return Util.tryToDo(this.getAddress, async () => {
            const res = await this._client.getAddress(addressId);
            return new Address(res.data.address);
        });
    }

    /**
     * Gets the member's addresses
     * @return {Promise} addresses - Addresses
     */
    getAddresses() {
        return Util.tryToDo(this.getAddresses, async () => {
            const res = await this._client.getAddresses();
            return res.data.addresses.map(address => new Address(address));
        });
    }

    /**
     * Gets all of the member's usernames
     * @return {Promise} usernames - member's usernames
     */
    getAllUsernames() {
        return Util.tryToDo(this.getAllUsernames, async () => {
            const member = await this._getMember();
            return member.usernames;
        });
    }

    /**
     * Creates a new unendorsed access token.
     *
     * @param {AccessToken} accessToken - the access token configuration
     * @return {Promise} token - promise of a created AccessToken
     */
    createAccessToken(accessToken) {
        return Util.tryToDo(this.createAccessToken, async () => {
            const res = await this._client.createToken(accessToken.from(this).json);
            return AccessToken.createFromToken(res.data.token);
        });
    }

    /**
     * Cancels the existing token and creates a replacement for it.
     *
     * @param {AccessToken} tokenToCancel - the old token to cancel
     * @param {AccessToken} tokenToCreate - the new token to create
     * @returns {Promise} operationResult - the result of the operation
     */
    replaceAccessToken(tokenToCancel, tokenToCreate) {
        return Util.tryToDo(this.replaceAccessToken, async () => {
            const res = await this._client.replaceToken(tokenToCancel, tokenToCreate);
            return new TokenOperationResult(
                res.data.result,
                AccessToken.createFromToken(res.data.result.token));
        });
    }

    /**
     * Cancels the existing token, creates a replacement and endorses it.
     *
     * @param {AccessToken} tokenToCancel - the old token to cancel
     * @param {AccessToken} tokenToCreate - the new token to create
     * @returns {Promise} operationResult - the result of the operation
     */
    replaceAndEndorseAccessToken(tokenToCancel, tokenToCreate) {
        return Util.tryToDo(this.replaceAndEndorseAccessToken, async () => {
            const res = await this._client.replaceAndEndorseToken(tokenToCancel, tokenToCreate);
            return new TokenOperationResult(
                res.data.result,
                AccessToken.createFromToken(res.data.result.token));
        });
    }

    /**
     * Creates an unendorsed Transfer Token
     *
     * @param {string} accountId - id of the source account
     * @param {double} amount - amount limit on the token
     * @param {string} currency - 3 letter currency code ('EUR', 'USD', etc)
     * @param {string} username - username of the redeemer of this token
     * @param {string} description - optional description for the token
     * @return {Promise} token - promise of a created TransferToken
     */
    createToken(accountId, amount, currency, username, description = undefined) {
        const token = TransferToken.create(this, accountId, amount,
            currency, username, description);
        return Util.tryToDo(this.createToken, async () => {
            const res = await this._client.createToken(token.json);
            return TransferToken.createFromToken(res.data.token);
        });
    }

    /**
     * Looks up a token by its Id
     * @param {string} tokenId - id of the token
     * @return {Promise} token - TransferToken
     */
    getToken(tokenId) {
        return Util.tryToDo(this.getToken, async () => {
            const res = await this._client.getToken(tokenId);
            if (res.data.token.payload.access !== undefined) {
                return AccessToken.createFromToken(res.data.token);
            } else {
                return TransferToken.createFromToken(res.data.token);
            }
        });
    }

    /**
     * Looks up all transfer tokens (not just for this account)
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to look for
     * @return {TransferToken} tokens - returns a list of Transfer Tokens
     */
    getTransferTokens(offset, limit) {
        return Util.tryToDo(this.getTransferTokens, async () => {
            const res = await this._client.getTokens('TRANSFER', offset, limit);
            return new PagedResult(
                res.data.tokens === undefined
                    ? []
                    :res.data.tokens.map(tk => TransferToken.createFromToken(tk)),
                res.data.offset);
        });
    }

    /**
     * Looks up all access tokens (not just for this account)
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to look for
     * @return {Promise} AccessTokens - returns a list of Access Tokens
     */
    getAccessTokens(offset, limit) {
        return Util.tryToDo(this.getAccessTokens, async () => {
            const res = await this._client.getTokens('ACCESS', offset, limit);
            return new PagedResult(
                res.data.tokens === undefined
                    ? []
                    :res.data.tokens.map(tk => AccessToken.createFromToken(tk)),
                res.data.offset);
        });
    }

    /**
     * Endorses a token
     * @param {Token} token - Transfer token to endorse. Can also be a {string} tokenId
     * @return {Promise} token - Promise of endorsed transfer token
     */
    endorseToken(token) {
        return Util.tryToDo(this.endorseToken, async () => {
            const finalToken = await this._resolveToken(token);
            const endorsed = await this._client.endorseToken(finalToken);
            if (typeof token !== 'string' && !(token instanceof String)) {
                token.payloadSignatures = endorsed.data.result.token.payloadSignatures;
            }
            return new TokenOperationResult(endorsed.data.result, token);
        });
    }

    /**
     * Cancels a token. (Called by the payer or the redeemer)
     * @param {Token} token - token to cancel. Can also be a {string} tokenId
     * @return {Promise} TokenOperationResult.js - cancelled token
     */
    cancelToken(token) {
        return Util.tryToDo(this.cancelToken, async () => {
            const finalToken = await this._resolveToken(token);
            const cancelled = await this._client.cancelToken(finalToken);
            if (typeof token !== 'string' && !(token instanceof String)) {
                token.payloadSignatures = cancelled.data.result.token.payloadSignatures;
            }
            return new TokenOperationResult(cancelled.data.result, token);
        });
    }

    /**
     * Redeems a token. (Called by the payee or redeemer)
     * @param {BankTransferToken} token - token to redeem. Can also be a {string} tokenId
     * @param {int} amount - amount to redeemer
     * @param {string} currency - currency to redeem
     * @param {string} description - optional transfer description
     * @param {arr} destinations - transfer destinations
     * @return {Promise} transfer - Transfer created as a result of this redeem call
     */
    createTransfer(token, amount, currency, description, destinations = []) {
        return Util.tryToDo(this.createTransfer, async () => {
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
            return new Transfer(res.data.transfer);
        })
    }

    /**
     * Looks up a transfer
     * @param {string} transferId - id to look up
     * @return {Transfer} transfer - transfer if found
     */
    getTransfer(transferId) {
        return Util.tryToDo(this.getTransfer, async () => {
            const res = await this._client.getTransfer(transferId);
            return new Transfer(res.data.transfer);
        });
    }

    /**
     * Looks up all of the member's transfers
     * @param {string} tokenId - token to use for lookup
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to retrieve
     * @return {Promise} transfers - Transfers
     */
    getTransfers(tokenId, offset, limit) {
        return Util.tryToDo(this.getTransfers, async () => {
            const res = await this._client.getTransfers(tokenId, offset, limit);
            return new PagedResult(
                res.data.transfers.map(pt => new Transfer(pt)),
                res.data.offset);
        });
    }

    /**
     * Gets the member's public keys
     * @return {Promise} keys - keys objects
     */
    getPublicKeys() {
        return Util.tryToDo(this.getPublicKeys, async () => {
            const member = await this._getMember();
            return member.keys;
        });
    }

    _getPreviousHash() {
        return Util.tryToDo(this._getPreviousHash, async () => {
            const member = await this._getMember();
            return member.lastHash;
        });
    }

    _getMember() {
        return Util.tryToDo(this._getMember, async () => {
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
                resolve(token);
            }
        });

    }
}

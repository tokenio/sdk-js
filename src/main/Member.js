import AuthHttpClient from "../http/AuthHttpClient";
import HttpClient from "../http/HttpClient";
import TransferTokenBuilder from "./TransferTokenBuilder";
import Util from "../Util";
import config from "../config.json";
import AccessTokenBuilder from "./AccessTokenBuilder";

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
     * @param {Object} cryptoEngine - the cryptoEngine to use for signing and key storage
     * @param {string} developerKey - the developer key
     * @param {function} globalRpcErrorCallback - callback to invoke on any cross-cutting RPC
     * call error. For example: SDK version mismatch
     */
    constructor(env, memberId, cryptoEngine, developerKey, globalRpcErrorCallback) {
        this._id = memberId;
        this._client = new AuthHttpClient(
            env,
            memberId,
            cryptoEngine,
            developerKey,
            globalRpcErrorCallback);
        this._unauthenticatedClient = new HttpClient(env, developerKey, globalRpcErrorCallback);
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
     * Gets all of the member's aliases
     *
     * @return {Promise} aliases - member's aliases
     */
    aliases() {
        return Util.callAsync(this.aliases, async () => {
            const res = await this._client.getAliases();
            return res.data.aliases;
        });
    }

    /**
     * Gets the member's first alias
     *
     * @return {Promise} alias - member's alias
     */
    firstAlias() {
        return Util.callAsync(this.firstAlias, async () => {
            const res = await this._client.getAliases();
            return res.data.aliases[0];
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
     * @param {boolean} customerInitiated - whether the user initiated this session / request
     */
    useAccessToken(accessTokenId, customerInitiated = false) {
        this._client.useAccessToken(accessTokenId, customerInitiated);
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
        });
    }

    /**
     * Adds an alias to this member
     *
     * @param {Object} alias - alias to add
     * @return {Promise} empty - empty promise
     */
    addAlias(alias) {
        return Util.callAsync(this.addAlias, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.addAlias(prevHash, alias);
        });
    }

    /**
     * Adds aliases to this member
     *
     * @param {Array} aliases - aliases to add
     * @return {Promise} empty - empty promise
     */
    addAliases(aliases) {
        return Util.callAsync(this.addAliases, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.addAliases(prevHash, aliases);
        });
    }

    /**
     * Removes an alias from the memberId
     *
     * @param {Object} alias - alias to remove
     * @return {Promise} empty - empty promise
     */
    removeAlias(alias) {
        return Util.callAsync(this.removeAlias, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeAlias(prevHash, alias);
        });
    }

    /**
     * Removes aliases from the memberId
     *
     * @param {Array} aliases - aliases to remove
     * @return {Promise} empty - empty promise
     */
    removeAliases(aliases) {
        return Util.callAsync(this.removeAliases, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeAliases(prevHash, aliases);
        });
    }

    /**
     * Set the "normal consumer" rule as member's recovery rule.
     * (As of Nov 2017, this rule was: To recover, verify an alias.)
     * @return {Promise} promise containing RecoveryRule proto buffer.
     */
    useDefaultRecoveryRule() {
        return Util.callAsync(this.useDefaultRecoveryRule, async () => {
            const agentResponse = await this._client.getDefaultRecoveryAgent();
            const prevHash = await this._getPreviousHash();
            const rule = {
                recoveryRule: {
                    primaryAgent: agentResponse.data.memberId
                }
            };
            const res = await this._client.addRecoveryRule(prevHash, rule);
            return res.data.member.recoveryRule;
        });
    }

    /**
     * Links bank accounts to the member
     *
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
     * @return {Promise} empty - empty promise
     */
    unlinkAccounts(accountIds) {
        return Util.callAsync(this.unlinkAccounts, async() => {
            await this._client.unlinkAccounts(accountIds);
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
            return res.data.accounts === undefined ?
                [] :
                res.data.accounts;
        });
    }

    /**
     * Looks up a member's account by Id
     *
     * @param {string} accountId - accountId
     * @return {Promise} account - Promise resolving to the account
     */
    getAccount(accountId) {
        return Util.callAsync(this.getAccount, async () => {
            const res = await this._client.getAccount(accountId);
            return res.data.account === undefined ?
                [] :
                res.data.account;
        });
    }

    /**
     * Gets the default bank account.
     *
     * @return {Promise} the default bank account
     */
    getDefaultAccount() {
        return Util.callAsync(this.getDefaultAccount, async () => {
            const res = await this._client.getDefaultAccount(this.memberId());
            return res.data.account;
        });
    }

    /**
     * Sets the member's default bank account.
     *
     * @param {string} accountId - the bank account id
     * @return {Promise} account - the account if found
     */
    setDefaultAccount(accountId) {
        return Util.callAsync(this.setDefaultAccount, async () => {
            const res = await this._client.setDefaultAccount(accountId, this.memberId());
            return res.data.account;
        });
    }

    /**
     * Looks up if this account is default.
     *
     * @param {string} accountId - the bank account id
     * @return {Promise} response - true if the account is default; false otherwise
     */
    isDefaultAccount(accountId) {
        return Util.callAsync(this.isDefaultAccount, async () => {
            return await this.getDefaultAccount().id === accountId;
        });
    }

    /**
     * Gets the info of a bank, including a link for pairing accounts at this bank
     *
     * @param {string} bankId - id of the bank
     * @return {Object} bankInfo - info
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
     * @param {Object} handlerInstructions - map of strings with delivery options
     * @return {Promise} subscriber - Subscriber
     */
    subscribeToNotifications(
        handler = "token",
        handlerInstructions = {}) {
        return Util.callAsync(this.subscribeToNotifications, async () => {
            const res = await this._client.subscribeToNotifications(handler, handlerInstructions);
            return res.data.subscriber;
        });
    }

    /**
     * Gets all subscribers for this member
     *
     * @return {Promise} - subscribers
     */
    getSubscribers() {
        return Util.callAsync(this.getSubscribers, async () => {
            const res = await this._client.getSubscribers();
            return res.data.subscribers === undefined ?
                [] :
                res.data.subscribers;
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
            const data = res.data.notifications === undefined ?
                    [] :
                    res.data.notifications;
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
        });
    }

    /**
     * Triggers a token step up notification on the user's app
     *
     * @param {Object} stepUp - token step up notification payload
     * @return {Promise} - notification status
     */
    triggerStepUpNotification(stepUp) {
        return Util.callAsync(this.triggerStepUpNotification, async () => {
            const res = await this._client.triggerStepUpNotification(stepUp);
            return res.data.status;
        });
    }

    /**
     * Triggers a balance step up notification on the user's app
     * @param {Array} accountIds - array of account ids
     * @return {Promise} - notification status
     */
    triggerBalanceStepUpNotification(accountIds) {
        return Util.callAsync(this.triggerBalanceStepUpNotification, async () => {
            const res = await this._client.triggerBalanceStepUpNotification(accountIds);
            return res.data.status;
        });
    }

    /**
     * Triggers a transaction step up notification on the user's app
     * @param {String} accountId - account id
     * @param {String} transactionId - transaction id
     * @return {Promise} - notification status
     */
    triggerTransactionStepUpNotification(accountId, transactionId) {
        return Util.callAsync(this.triggerTransactionStepUpNotification, async () => {
            const res = await this._client.triggerTransactionStepUpNotification(
                accountId,
                transactionId);
            return res.data.status;
        });
    }

    /**
     * Creates an address for this member, and saves it
     *
     * @param {string} name - name of the address (e.g 'Home')
     * @param {object} address - address
     * @return {Promise} promise of AddressRecord structure
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
     * @return {Promise} address - AddressRecord structure
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
     * @return {Promise} addresses - list of AddressRecord structures
     */
    getAddresses() {
        return Util.callAsync(this.getAddresses, async () => {
            const res = await this._client.getAddresses();
            return res.data.addresses === undefined ?
                [] :
                res.data.addresses;
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
            await this._client.deleteAddress(addressId);
        });
    }

    /**
     * Replaces the authenticated member's public profile.
     *
     * @param {Object} profile - profile to set
     * @return {Promise} profile - newly-set profile
     */
    setProfile(profile) {
        return Util.callAsync(this.setProfile, async () => {
            const res = await this._client.setProfile(profile);
            return res.data.profile;
        });
    }

    /**
     * Gets a member's public profile.
     *
     * @param {string} id - member id whose profile to get
     * @return {Promise} profile - profile
     */
    getProfile(id) {
        return Util.callAsync(this.getProfile, async () => {
            const res = await this._client.getProfile(id);
            return res.data.profile;
        });
    }

    /**
     * Uploads the authenticated member's public profile.
     *
     * @param {string} type - MIME type
     * @param {Buffer} data - data in bytes
     * @return {Promise} empty - empty promise
     */
    setProfilePicture(type, data) {
        return Util.callAsync(this.setProfilePicture, async () => {
            await this._client.setProfilePicture(type, data);
        });
    }

    /**
     * Gets a member's public profile picture.
     *
     * @param {string} id - member id whose picture to get
     * @param {Object} size - desired size category SMALL/MEDIUM/LARGE/ORIGINAL
     * @return {Object} blob - downloaded blob
     */
    getProfilePicture(id, size) {
        return Util.callAsync(this.getProfilePicture, async () => {
            const res = await this._client.getProfilePicture(id, size);
            return res.data.blob;
        });
    }

    /**
     * Stores a request for a token. Called by a merchant or a TPP that wants access from a user.
     *
     * @param {Object} tokenRequest - token request to store
     * @return {Promise} requestId - requestId
     */
    storeTokenRequest(tokenRequest) {
        return Util.callAsync(this.storeTokenRequest, async () => {
            const res = await this._client.storeTokenRequest(tokenRequest);
            return res.data.tokenRequest;
        });
    }

    /**
     * Creates a new unendorsed access token.
     *
     * @param {Object} alias - the alias of the grantee of the Access Token
     * @param {array} resources - a list of resources to give access to
     * @return {Promise} token - promise of a created Access Token
     */
    createAccessToken(alias, resources) {
        return Util.callAsync(this.createAccessToken, async () => {
            return await (new AccessTokenBuilder(this._client, this, resources)
                .setFromId(this.memberId())
                .setToAlias(alias)
                .execute());
        });
    }

    /**
     * Creates a new access token builder, that must be executed.
     *
     * @return {Promise} token - promise of a created Access Token
     */
    createAccessTokenBuilder() {
        return Util.callSync(this.createAccessTokenBuilder, () => {
            return new AccessTokenBuilder(this._client, this, []);
        });
    }

    /**
     * Cancels the existing token and creates a replacement for it.
     *
     * @param {Object} tokenToCancel - the old token to cancel
     * @param {Array} newResources - the new resources for this token to grant access to
     * @return {Promise} operationResult - the result of the operation
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
     * @return {Promise} operationResult - the result of the operation
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
     * @deprecated - use createTransferTokenBuilder instead
     * Creates a transfer token builder, that when executed, will create a transfer token by
     * performing an API call.
     *
     * @param {double} lifetimeAmount - amount limit on the token
     * @param {string} currency - 3 letter currency code ('EUR', 'USD', etc)
     * @return {TransferTokenBuilder} builder - builder for the token
     */
    createTransferToken(lifetimeAmount, currency) {
        return Util.callSync(this.createTransferToken, () => {
            return new TransferTokenBuilder(this._client, this, lifetimeAmount, currency)
                .setFromId(this.memberId());
        });
    }

    /**
     * Creates a transfer token builder, that when executed, will create a transfer token by
     * performing an API call.
     *
     * @param {double} lifetimeAmount - amount limit on the token
     * @param {string} currency - 3 letter currency code ('EUR', 'USD', etc)
     * @return {TransferTokenBuilder} builder - builder for the token
     */
    createTransferTokenBuilder(lifetimeAmount, currency) {
        return Util.callSync(this.createTransferTokenBuilder, () => {
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
            const data = res.data.tokens === undefined ?
                    [] :
                    res.data.tokens;
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
            const data = res.data.tokens === undefined ?
                    [] :
                    res.data.tokens;
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Endorses a token. If this SDK client doesn't have a sufficiently
     * privileged key to endorse the token, this will return
     * MORE_SIGNATURES_NEEDED and the system pushes a notification to
     * the member prompting them to use a higher-privilege key.
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
     * @param {Array} destinations - transfer destinations
     * @param {string} refId - Id that will be set on created Transfer.
     *                         Token uses this to detect duplicates.
     *                         Caller might use this to recognize the transfer.
     *                         If param empty, transfer will have random refId.
     * @return {Promise} transfer - Transfer created as a result of this redeem call
     */
    redeemToken(token, amount, currency, description, destinations = [], refId = null) {
        return Util.callAsync(this.redeemToken, async () => {
            const finalToken = await this._resolveToken(token);
            if (amount === undefined) {
                amount = finalToken.payload.transfer.amount;
            }
            if (currency === undefined) {
                currency = finalToken.payload.transfer.currency;
            }
            if (Util.countDecimals(amount) > config.decimalPrecision) {
                throw new Error(
                    `Number of decimals in amount should be at most ${config.decimalPrecision}`);
            }
            const res = await this._client.redeemToken(
                finalToken,
                amount,
                currency,
                description,
                destinations,
                refId);
            return res.data.transfer;
        });
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
            const data = res.data.transfers === undefined ?
                    [] :
                    res.data.transfers;
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
     * @param {string} keyLevel - key level
     * @return {Promise} balance - Promise of get balance response object
     */
    getBalance(accountId, keyLevel) {
        return Util.callAsync(this.getBalance, async () => {
            const res = await this._client.getBalance(accountId, keyLevel);
            return res.data;
        });
    }

    /**
     * Looks up the balances of an array of accounts
     *
     * @param {Array} accountIds - array of account ids
     * @param {string} keyLevel - key level
     * @return {Promise} balance - Promise of get balances response object
     */
    getBalances(accountIds, keyLevel) {
        return Util.callAsync(this.getBalances, async () => {
            const res = await this._client.getBalances(accountIds, keyLevel);
            return res.data;
        });
    }

    /**
     * Looks up a transaction
     *
     * @param {string} accountId - id of the account
     * @param {string} transactionId - which transaction to look up
     * @param {string} keyLevel - key level
     * @return {Promise} transaction - the Transaction
     */
    getTransaction(accountId, transactionId, keyLevel) {
        return Util.callAsync(this.getTransaction, async () => {
            const res = await this._client.getTransaction(accountId, transactionId, keyLevel);
            return res.data.transaction;
        });
    }

    /**
     * Looks up all of the member's transactions for an account
     *
     * @param {string} accountId - id of the account
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to retrieve
     * @param {string} keyLevel - key level
     * @return {Promise} transactions - Transactions
     */
    getTransactions(accountId, offset, limit, keyLevel) {
        return Util.callAsync(this.getTransactions, async () => {
            const res = await this._client.getTransactions(accountId, offset, limit, keyLevel);
            const data = res.data.transactions === undefined ?
                    [] :
                    res.data.transactions;
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
    createBlob(ownerId, type, name, data) {
        return Util.callAsync(this.createBlob, async () => {
            const res = await this._client.createBlob(ownerId, type, name, data);
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
    getBlob(blobId) {
        return Util.callAsync(this.getBlob, async () => {
            const res = await this._client.getBlob(blobId);
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
    getTokenBlob(tokenId, blobId) {
        return Util.callAsync(this.getTokenBlob, async () => {
            const res = await this._client.getTokenBlob(tokenId, blobId);
            return res.data.blob;
        });
    }

    /**
     * Creates a test bank account in a fake bank
     *
     * @param {double} balance - balance of the account
     * @param {string} currency - currency of the account
     * @return {Array} bank authorization to use with linkAccounts
     */
    createTestBankAccount(balance, currency) {
        return Util.callAsync(this.createTestBankAccount, async () => {
            const res = await this._client.createTestBankAccount(balance, currency);
            return res.data.bankAuthorization;
        });
    }

    /**
     * Gets test bank notification.
     *
     * @param {string} subscriberId - id of subscriber
     * @param {string} notificationId - id of notification
     * @return {Object} response - response to the API call
     */
    getTestBankNotification(subscriberId, notificationId) {
        return Util.callAsync(this.getTestBankNotification, async () => {
            const res = await this._client.getTestBankNotification(subscriberId, notificationId);
            return res.data.notification;
        });
    }

    /**
     * Gets test bank notifications.
     *
     * @param {string} subscriberId - id of subscriber
     * @return {Object} response - response to the API call
     */
    getTestBankNotifications(subscriberId) {
        return Util.callAsync(this.getTestBankNotifications, async () => {
            const res = await this._client.getTestBankNotifications(subscriberId);
            return res.data.notifications;
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
            const res = await this._unauthenticatedClient.getMember(this._id);
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

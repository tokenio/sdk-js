import Crypto from "../Crypto";
import LocalStorage from "../LocalStorage";
import Account from "./Account";
import Address from "./Address";
import KeyLevel from "./KeyLevel";
import AuthHttpClient from "../http/AuthHttpClient";
import PaymentToken from "./PaymentToken";
import AccessToken from "./AccessToken";
import Payment from "./Payment";
import UnauthenticatedClient from "../http/UnauthenticatedClient";
import {defaultNotificationProvider} from "../constants";

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
    constructor(memberId, keys) {
        this._id = memberId;
        this._keys = keys;
        this._client = new AuthHttpClient(memberId, keys);
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
     * @param accessTokenId the access token id
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
     * @param {array} tags - Tags to attach to this key
     * @return {Promise} empty empty promise
     */
    approveKey(publicKey, keyLevel = KeyLevel.PRIVILEGED, tags = []) {
        return this._getPreviousHash()
            .then(prevHash =>
                this._client
                    .addKey(prevHash, Crypto.bufferKey(publicKey), keyLevel, tags)
                    .then(res => undefined));
    }

    /**
     * Removes a key from this member
     * @param {string} keyId - keyId to remove. Note, keyId is the hash of the pk
     * @return {Promise} empty empty promise
     */
    removeKey(keyId) {
        return this._getPreviousHash()
            .then(prevHash =>
                this._client
                    .removeKey(prevHash, keyId)
                    .then(res => undefined));
    }

    /**
     * Checks if a given alias already exists
     * @param {string} alias - alias to check
     * @return {Promise} result - true if alias exists, false otherwise
     */
    aliasExists(alias) {
        return UnauthenticatedClient
            .aliasExists(alias)
            // Workaround for a default value case when protobuf does not serialize it.
            .then(res => res.data.exists ? res.data.exists : false);
    }

    /**
     * Adds an alias to this member
     * @param {string} alias - alias to add
     * @return {Promise} empty empty promise
     */
    addAlias(alias) {
        return this._getPreviousHash()
            .then(prevHash =>
                this._client
                    .addAlias(prevHash, alias)
                    .then(res => undefined));
    }

    /**
     * Removes an alias from the memberId
     * @param {string} alias - alias to remove
     * @return {Promise} empty - empty promise
     */
    removeAlias(alias) {
        return this
            ._getPreviousHash()
            .then(prevHash =>
                this._client
                    .removeAlias(prevHash, alias)
                    .then(res => undefined));
    }

    /**
     * Links bank accounts to the member
     * @param {string} bankId - bank to link
     * @param {string} accountsLinkPayload - accountLinkPayload obtained from bank
     * @return {Promise} accounts - Promise resolving the the Accounts linked
     */
    linkAccounts(bankId, accountsLinkPayload) {
        return this._client
            .linkAccounts(bankId, accountsLinkPayload)
            .then(res => {
                return res.data.accounts.map(acc => new Account(this, acc));
            });
    }

    /**
     * Looks up the member's accounts
     * @return {Promise} accounts - Promise resolving to the accounts
     */
    getAccounts() {
        return this._client
            .getAccounts()
            .then(res => {
                return res.data.accounts.map(acc => new Account(this, acc));
            });
    }

    /**
     * Subscribes a device to receive notifications of member events, such as step up auth,
     * new device requests, linking account requests, or payment notifications
     * @param {string} notificationUri - the notification Uri for this device. (e.g iOS push token)
     * @param {string} provider - provider to send the notification (default Token)
     * @param {string} platform - platform of the devices (IOS, ANDROID, WEB, etc)
     * @param {string} tags - tags of this device, for future categorization, etc
     * @return {Promise} empty - empty promise
     */
    subscribeDevice(
        notificationUri,
        provider = defaultNotificationProvider,
        platform = "IOS",
        tags = []) {
        return this._client
            .subscribeDevice(notificationUri, provider, platform, tags);
    }

    /**
     * Creates an address for this member, and saves it
     * @param {string} name - name of the address (e.g 'Home')
     * @param {string} data - data of the address (e.g '123 Broadway rd, San Francisco, CA 94158')
     * @return {Promise} empty - empty promise
     */
    addAddress(name, data) {
        return this._client
            .addAddress(name, data)
            .then(res => {
                return new Address(res.data.address)
            });
    }

    /**
     * Gets the member's addresse
     *
     * @param {string} addressId - the address id
     * @return {Promise} address - the address
     */
    getAddress(addressId) {
        return this._client
            .getAddress(addressId)
            .then(res => {
                return new Address(res.data.address);
            });
    }

    /**
     * Gets the member's addresses
     * @return {Promise} addresses - Addresses
     */
    getAddresses() {
        return this._client
            .getAddresses()
            .then(res => {
                return res.data.addresses
                    .map(address => new Address(address));
            });
    }

    /**
     * Gets all of the member's aliases
     * @return {Promise} aliases - member's aliases
     */
    getAllAliases() {
        return this
            ._getMember()
            .then(member => member.aliases);
    }

    /**
     * Creates a new unendorsed Access Token
     *
     * @param {string} grantee - the alias of the grantee
     * @param {object} resources - an array of resources
     * @return {Promise} token - promise of a created AccessToken
     */
    createAccessToken(grantee, resources) {
        const token = new AccessToken(undefined, this, grantee, resources);
        return this._client
            .createAccessToken(token.json)
            .then(res => {
                return AccessToken.createFromToken(res.data.token);
            });
    }

    /**
     * Creates a new Address Access Token
     *
     * @param {string} grantee - the alias of the grantee
     * @param {string} addressId - an optional addressId
     * @return {Promise} token - promise of a created AccessToken
     */
    createAddressAccessToken(grantee, addressId) {
        const token = AccessToken.addressAccessToken(this, grantee, addressId);
        return this._client
            .createAccessToken(token.json)
            .then(res => {
                return AccessToken.createFromToken(res.data.token);
            });
    }

    /**
     * Creates a new Account Access Token
     *
     * @param {string} grantee - the alias of the grantee
     * @param {string} accountId - an optional accountId
     * @return {Promise} token - promise of a created AccessToken
     */
    createAccountAccessToken(grantee, accountId) {
        const token = AccessToken.accountAccessToken(this, grantee, accountId);
        return this._client
            .createAccessToken(token.json)
            .then(res => {
                return AccessToken.createFromToken(res.data.token);
            });
    }

    /**
     * Creates a new Transaction Access Token
     *
     * @param {string} grantee - the alias of the grantee
     * @param {string} accountId - an optional accountId
     * @return {Promise} token - promise of a created AccessToken
     */
    createTransactionAccessToken(grantee, accountId) {
        const token = AccessToken.transactionAccessToken(this, grantee, accountId);
        return this._client
            .createAccessToken(token.json)
            .then(res => {
                return AccessToken.createFromToken(res.data.token);
            });
    }

    /**
     * Creates an unendorsed Payment Token
     *
     * @param {string} accountId - id of the source account
     * @param {double} amount - amount limit on the token
     * @param {string} currency - 3 letter currency code ('EUR', 'USD', etc)
     * @param {string} alias - alias of the redeemer of this token
     * @param {string} description - optional description for the token
     * @return {Promise} token - promise of a created PaymentToken
     */
    createPaymentToken(accountId, amount, currency, alias, description = undefined) {
        const token = PaymentToken.create(this, accountId, amount,
            currency, alias, description);
        return this._client
            .createPaymentToken(token.json)
            .then(res => {
                return PaymentToken.createFromToken(res.data.token);
            });
    }

    /**
     * Looks up a token by its Id
     * @param {string} tokenId - id of the token
     * @return {Promise} token - PaymentToken
     */
    getPaymentToken(tokenId) {
        return this._client
            .getPaymentToken(tokenId)
            .then(res => {
                return PaymentToken.createFromToken(res.data.token);
            });
    }

    /**
     * Looks up all tokens (not just for this account)
     * @param {int} offset - where to start looking
     * @param {int} limit - how many to look for
     * @return {PaymentTokens} tokens - returns a list of Payment Tokens
     */
    getPaymentTokens(offset = 0, limit = 100) {
        return this._client
            .getPaymentTokens(offset, limit)
            .then(res => {
                if (res.data.tokens === undefined) return [];
                return res.data.tokens
                    .map(tk => PaymentToken.createFromToken(tk));
            });
    }

    /**
     * Endorses a token
     * @param {PaymentToken} token - Payment token to endorse. Can also be a {string} tokenId
     * @return {Promise} token - Promise of endorsed payment token
     */
    endorsePaymentToken(token) {
        return this
            ._resolveToken(token)
            .then(finalToken => {
                return this._client
                    .endorsePaymentToken(finalToken)
                    .then(res => {
                        if (typeof token !== 'string' && !(token instanceof String)) {
                            token.payloadSignatures = res.data.token.payloadSignatures;
                        }
                    });
            });
    }

    /**
     * Cancels a token. (Called by the payer or the redeemer)
     * @param {PaymentToken} token - token to cancel. Can also be a {string} tokenId
     * @return {PaymentToken} token - cancelled token
     */
    cancelPaymentToken(token) {
        return this._resolveToken(token)
            .then(finalToken => {
                return this._client
                    .cancelPaymentToken(finalToken)
                    .then(res => {
                        if (typeof token !== 'string' && !(token instanceof String)) {
                            token.payloadSignatures = res.data.token.payloadSignatures;
                        }
                    });
            });
    }

    /**
     * Redeems a token. (Called by the payee)
     * @param {PaymentToken} token - token to redeem. Can also be a {string} tokenId
     * @param {int} amount - amount to redeemer
     * @param {string} currency - currency to redeem
     * @return {Promise} payment - Payment created as a result of this redeem call
     */
    redeemPaymentToken(token, amount, currency) {
        return this._resolveToken(token)
            .then(finalToken => {
                if (amount === undefined) {
                    amount = finalToken.amount;
                }
                if (currency === undefined) {
                    currency = finalToken.currency;
                }
                return this._client
                    .redeemPaymentToken(finalToken, amount, currency)
                    .then(res => {
                        return new Payment(res.data.payment);
                    });
            });
    }

    /**
     * Looks up a payment
     * @param {string} paymentId - id to look up
     * @return {Payment} payment - payment if found
     */
    getPayment(paymentId) {
        return this._client
            .getPayment(paymentId)
            .then(res => {
                return new Payment(res.data.payment);
            });
    }

    /**
     * Looks up all of the member's payments
     * @param {string} tokenId - token to use for lookup
     * @param {int} offset - where to start looking
     * @param {int} limit - how many to retrieve
     * @return {Promise} payments - Payments
     */
    getPayments(tokenId, offset = 0, limit = 100) {
        return this._client
            .getPayments(tokenId, offset, limit)
            .then(res => {
                return res.data.payments.map(pt => new Payment(pt));
            });
    }

    /**
     * Gets the member's public keys
     * @return {Promise} keys - keys objects
     */
    getPublicKeys() {
        return this
            ._getMember()
            .then(member => member.keys);
    }

    _getPreviousHash() {
        return this
            ._getMember()
            .then(member => member.lastHash);
    }

    _getMember() {
        return this._client
            .getMember()
            .then(res => {
                return res.data.member;
            });
    }

    _resolveToken(token) {
        return new Promise((resolve, reject) => {
            if (typeof token === 'string' || token instanceof String) {
                this.getPaymentToken(token).then(lookedUp => resolve(lookedUp));
            } else {
                resolve(token);
            }
        });
    }
}

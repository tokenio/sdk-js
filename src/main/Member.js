import Crypto from '../Crypto';
import LocalStorage from '../LocalStorage';
import Account from './Account';
import Address from './Address';
import KeyLevel from './KeyLevel';
import AuthHttpClient from '../http/AuthHttpClient';
import PaymentToken from './PaymentToken';
import Payment from './Payment';
import {defaultNotificationProvider} from '../constants';

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
 * Approves a new key for this member
 * @param {Buffer} publicKey - key to add
 * @param {string} keyLevel - Security level of this new key. PRIVILEGED is root security
 * @param {array} tags - Tags to attach to this key
 * @return {Promise} empty empty promise
 */
  approveKey(publicKey, keyLevel = KeyLevel.PRIVILEGED, tags = []) {
    return this._getPreviousHash()
    .then(prevHash =>
        AuthHttpClient.addKey(this._keys, this._id,
          prevHash, Crypto.bufferKey(publicKey), keyLevel, tags)
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
      AuthHttpClient.removeKey(this._keys, this._id, prevHash, keyId)
      .then(res => undefined));
  }

  /**
   * Adds an alias to this member
   * @param {string} alias - alias to add
   * @return {Promise} empty empty promise
   */
  addAlias(alias) {
    return this._getPreviousHash()
    .then(prevHash =>
        AuthHttpClient.addAlias(this._keys, this._id, prevHash, alias)
        .then(res => undefined));
  }

  /**
   * Removes an alias from the memberId
   * @param {string} alias - alias to remove
   * @return {Promise} empty - empty promise
   */
  removeAlias(alias) {
    return this._getPreviousHash()
      .then(prevHash =>
        AuthHttpClient.removeAlias(this._keys, this._id, prevHash, alias)
        .then(res => undefined));
  }

  /**
   * Links bank accounts to the member
   * @param {string} bankId - bank to link
   * @param {string} accountLinkPayload - accountLinkPayload obtained from bank
   * @return {Promise} accounts - Promise resolving the the Accounts linked
   */
  linkAccounts(bankId, accountLinkPayload) {
    return AuthHttpClient.linkAccounts(this._keys, this._id,
      bankId, accountLinkPayload)
    .then(res => {
      return res.data.accounts.map(acc => new Account(this, acc));
    });
  }

  /**
   * Looks up the member's accounts
   * @return {Promise} accounts - Promise resolving to the accounts
   */
  lookupAccounts() {
    return AuthHttpClient.lookupAccounts(this._keys, this._id)
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
  subscribeDevice(notificationUri, provider = defaultNotificationProvider,
        platform = "IOS", tags = []) {
    return AuthHttpClient.subscribeDevice(this._keys, this._id,
      notificationUri, provider, platform, tags);
  }

  //   /**
  //  * Unsubscribes a device from push notifications
  //  * @param {string} notificationUri - the notification Uri for this device. (e.g iOS push token)
  //  * @param {string} provider - provider to send the notification (default Token)
  //  * @return {Promise} empty - empty promise
  //  */
  // unsubscribeDevice(notificationUri, provider = defaultNotificationProvider) {
  //   return AuthHttpClient.unsubscribeDevice(this._keys, this._id,
  //     notificationUri, provider);
  // }

  /**
   * Creates an address for this member, and saves it
   * @param {string} name - name of the address (e.g 'Home')
   * @param {string} data - data of the address (e.g '123 Broadway rd, San Francisco, CA 94158')
   * @return {Promise} empty - empty promise
   */
  createAddress(name, data) {
    return AuthHttpClient.createAddress(this._keys, this._id, name, data)
    .then(res => {
      return;
    });
  }

  /**
   * Gets the member's addresses
   * @return {Promise} addresses - Addresses
   */
  getAddresses() {
    return AuthHttpClient.getAddresses(this._keys, this._id)
    .then(res => {
      return res.data.addresses.map(address => new Address(address));
    });
  }

  /**
   * Gets all of the member's aliases
   * @return {Promise} aliases - member's aliases
   */
  getAllAliases() {
    return this._getMember(this._keys, this._id)
    .then(member => member.aliases);
  }

  /**
   * Creates an unendorsed token
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
    return AuthHttpClient.createPaymentToken(this._keys,
      this._id, token.json)
    .then(res => {
      return PaymentToken.createFromToken(res.data.token);
    });
  }

  /**
   * Looks up a token by its Id
   * @param {string} tokenId - id of the token
   * @return {Promise} token - PaymentToken
   */
  lookupPaymentToken(tokenId) {
    return AuthHttpClient.lookupPaymentToken(this._keys, this._id,
      tokenId)
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
  lookupPaymentTokens(offset = 0, limit = 100) {
    return AuthHttpClient.lookupPaymentTokens(this._keys, this._id,
      offset, limit)
    .then(res => {
      if (res.data.tokens === undefined) return [];
      return res.data.tokens.map(tk => PaymentToken.createFromToken(tk));
    });
  }

  /**
   * Endorses a token
   * @param {PaymentToken} token - Payment token to endorse. Can also be a {string} tokenId
   * @return {Promise} token - Promise of endorsed payment token
   */
  endorsePaymentToken(token) {
    return this._resolveToken(token)
    .then(finalToken => {
      return AuthHttpClient.endorsePaymentToken(this._keys, this._id,
          finalToken)
      .then(res => {
        if (typeof token !== 'string' && !(token instanceof String)) {
          token.signatures = res.data.token.signatures;
        }
        return;
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
      return AuthHttpClient.cancelPaymentToken(this._keys, this._id,
          finalToken)
      .then(res => {
        if (typeof token !== 'string' && !(token instanceof String)) {
          token.signatures = res.data.token.signatures;
        }
        return;
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
      return AuthHttpClient.redeemPaymentToken(this._keys, this._id,
          finalToken, amount, currency)
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
  lookupPayment(paymentId) {
    return AuthHttpClient.lookupPayment(this._keys, this._id,
      paymentId)
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
  lookupPayments(tokenId, offset = 0, limit = 100) {
    return AuthHttpClient.lookupPayments(this._keys, this._id,
      tokenId, offset, limit)
    .then(res => {
      return res.data.payments.map(pt => new Payment(pt));
    });
  }

  /**
   * Gets the member's public keys
   * @return {Promise} keys - keys objects
   */
  getPublicKeys() {
    return this._getMember(this._keys, this._id)
    .then(member => member.keys);
  }

  _getPreviousHash() {
    return this._getMember(this._keys, this._id)
    .then(member => member.lastHash);
  }

  _getMember() {
    return AuthHttpClient.getMember(this._keys, this._id)
    .then(res => {
      return res.data.member;
    });
  }

  _resolveToken(token) {
    return new Promise((resolve, reject) => {
      if (typeof token === 'string' || token instanceof String) {
        this.lookupPaymentToken(token).then(lookedUp => resolve(lookedUp));
      } else {
        resolve(token);
      }
    });
  }
}

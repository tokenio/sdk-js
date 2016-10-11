import Crypto from "./Crypto";
import Util from "./Util";
import PaymentToken from "./main/PaymentToken";
import Member from "./main/Member";
import KeyLevel from "./main/KeyLevel";
import LocalStorage from "./LocalStorage";
import UnauthenticatedClient from "./http/UnauthenticatedClient";
import AuthHttpClient from "./http/AuthHttpClient";

// Promise polyfill for IE and older browsers
require('es6-promise').polyfill();

// Main entry object
const Token = {

    /**
     * Creates a member with an alias and a keypair
     * @param  {string} alias - alias to set for member
     * @return {Promise} member - Promise of created Member
     */
    createMember: alias => {
        const keys = Crypto.generateKeys();
        return UnauthenticatedClient
            .createMemberId()
            .then(response => UnauthenticatedClient
                .addFirstKey(keys, response.data.memberId)
                .then(() => {
                    const member = new Member(response.data.memberId, keys);
                    return member
                        .addAlias(alias)
                        .then(() => member);
                })
            );
    },

    /**
     * Log in a member (Instantiate a member object from keys and Id)
     * @param  {string} memberId - id of the member
     * @param  {object} keys - member's keys
     * @return {Promise} member - Promise of instantiated Member
     */
    login: (memberId, keys) => {
        return Promise.resolve(new Member(memberId, keys));
    },

    /**
     * Log in a member by keys and alias. This is useful for checking whether we are
     * authenticated, after requesting to add a key (by notification). Can call this
     * every n seconds until it succeeds
     * @param  {object} keys - Member keys
     * @param  {string} alias - alias to authenticate with
     * @return {Promise} member - instantiated Member, if successful
     */
    loginWithAlias: (keys, alias) => {
        return AuthHttpClient
          .getMemberByAlias(keys, alias)
          .then(res => new Member(res.data.member.id, keys));
    },

    /**
     * Logs a member in from keys stored in localStorage
     * @return {Promise} member - instantiated member
     */
    loginFromLocalStorage: () => {
        return new Promise(LocalStorage.loadMember());
    },

    /**
     * Notifies subscribed devices that accounts should be linked, and passes the bank id and
     * payload
     * @param {string} alias - alias to notify
     * @param {string} bankId - If of the bank owning the accounts
     * @param {string} accountsLinkPayload - accountsLinkPayload retrieved from the bank
     * @return {Promise} empty - empty
     */
    notifyLinkAccounts(alias, bankId, accountsLinkPayload) {
        return UnauthenticatedClient.notifyLinkAccounts(alias, bankId, accountsLinkPayload);
    },

    /**
     * Notifies subscribed devices that a key should be added and passes the public Key and
     * optional tags
     * @param {string} alias - alias to notify
     * @param {string} publicKey - public
     * @param {array} tags - tags for the new key
     * @return {Promise} empty - empty
     */
    notifyAddKey(alias, publicKey, tags = []) {
        return UnauthenticatedClient.notifyAddKey(alias, publicKey, tags);
    },

    /**
     * Notifies subscribed devices that accounts should be linked, and passes the bank id and
     * payload
     * @param {string} alias - alias to notify
     * @param {string} bankId - If of the bank owning the accounts
     * @param {string} accountsLinkPayload - accountsLinkPayload retrieved from the bank
     * @param {string} publicKey - public
     * @param {array} tags - tags for the new key
     * @return {Promise} empty - empty
     */
    notifyLinkAccountsAndAddKey(alias, bankId, accountsLinkPayload, publicKey, tags = []) {
        return UnauthenticatedClient.notifyLinkAccountsAndAddKey(
            alias,
            bankId,
            accountsLinkPayload,
            publicKey,
            tags);
    },

    Crypto,
    Util,
    PaymentToken,
    KeyLevel
};

module.exports = Token;

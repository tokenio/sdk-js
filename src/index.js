import Crypto from "./Crypto";
import Util from "./Util";
import Member from "./main/Member";
import KeyLevel from "./main/KeyLevel";
import LocalStorage from "./LocalStorage";
import HttpClient from "./http/HttpClient";
import AuthHttpClientUsername from "./http/AuthHttpClientUsername";

// Promise polyfill for IE and older browsers
require('es6-promise').polyfill();

// Main entry object
class Token {

    constructor(env = 'prd') {
        this._env = env;
        this._unauthenticatedClient = new HttpClient(env);
        this.Crypto = Crypto;
        this.Util = Util;
        this.KeyLevel = KeyLevel;
    }

    /**
     * Checks if a given username already exists
     * @param {string} username - username to check
     * @return {Promise} result - true if username exists, false otherwise
     */
    usernameExists(username) {
        return this._unauthenticatedClient
            .usernameExists(username)
            // Workaround for a default value case when protobuf does not serialize it.
            .then(res => res.data.exists ? res.data.exists : false)
            .catch(err => Util.reject(this.usernameExists, err));
    }

    /**
     * Creates a member with an username and a keypair
     * @param  {string} username - username to set for member
     * @return {Promise} member - Promise of created Member
     */
    createMember(username) {
        const keys = Crypto.generateKeys();
        return this._unauthenticatedClient
            .createMemberId()
            .then(response => this._unauthenticatedClient
                .addFirstKey(keys, response.data.memberId)
                .then(() => {
                    const member = new Member(this._env, response.data.memberId, keys);
                    return member
                        .addUsername(username)
                        .then(() => member);
                })
            )
            .catch(err => Util.reject(this.createMember, err));
    }

    /**
     * Log in a member (Instantiate a member object from keys and Id)
     * @param  {string} memberId - id of the member
     * @param  {object} keys - member's keys
     * @return {Promise} member - Promise of instantiated Member
     */
    login(memberId, keys) {
        return Promise.resolve(new Member(this._env, memberId, keys))
            .catch(err => Util.reject(this.login, err));
    }

    /**
     * Log in a member by keys and username. This is useful for checking whether we are
     * authenticated, after requesting to add a key (by notification). Can call this
     * every n seconds until it succeeds
     * @param  {object} keys - Member keys
     * @param  {string} username - username to authenticate with
     * @return {Promise} member - instantiated Member, if successful
     */
    loginWithUsername(keys, username) {
        return new AuthHttpClientUsername(this._env, username, keys)
            .getMemberByUsername()
            .then(res => new Member(this._env, res.data.member.id, keys))
            .catch(err => Util.reject(this.loginWithUsername, err));
    }

    /**
     * Logs a member in from keys stored in localStorage
     * @return {Promise} member - instantiated member
     */
    loginFromLocalStorage() {
        try {
            const member = LocalStorage.loadMember(this._env);
            return Promise.resolve(member);
        } catch (err) {
            return Util.reject(this.loginFromLocalStorage, err)
        }
    }

    /**
     * Notifies subscribers that accounts should be linked, and passes the bank id and
     * payload
     * @param {string} username - username to notify
     * @param {string} bankId - ID of the bank owning the accounts
     * @param {string} bankName - name of the bank owning the accounts
     * @param {string} accountsLinkPayload - accountsLinkPayload retrieved from the bank
     * @return {Promise} empty - empty
     */
    notifyLinkAccounts(username, bankId, bankName, accountsLinkPayload) {
        const notification = {
            linkAccounts: {
                bankId,
                bankName,
                accountsLinkPayload
            }
        };
        return this._unauthenticatedClient.notify(username, notification)
            .catch(err => Util.reject(this.notifyLinkAccounts, err));
    }

    /**
     * Notifies subscribers that a key should be added and passes the public Key and
     * optional name
     * @param {string} username - username to notify
     * @param {string} publicKey - public
     * @param {string} name - name for the new key, (e.g Chrome 53.0)
     * @return {Promise} empty - empty
     */
    notifyAddKey(username, publicKey, name = '') {
        const notification = {
            addKey: {
                publicKey: Crypto.strKey(publicKey),
                name
            }
        };
        return this._unauthenticatedClient.notify(username, notification)
            .catch(err => Util.reject(this.notifyAddKey, err));
    }

    /**
     * Notifies subscribed devices that accounts should be linked, and passes the bank id and
     * payload
     * @param {string} username - username to notify
     * @param {string} bankId - ID of the bank owning the accounts
     * @param {string} bankName - name of the bank owning the accounts
     * @param {string} accountsLinkPayload - accountsLinkPayload retrieved from the bank
     * @param {string} publicKey - public
     * @param {array} name - name for the new key, (e.g Chrome 53.0)
     * @return {Promise} empty - empty
     */
    notifyLinkAccountsAndAddKey(username, bankId, bankName, accountsLinkPayload, publicKey, name = "") {
        const notification = {
            linkAccountsAndAddKey: {
                linkAccounts: {
                    bankId,
                    bankName,
                    accountsLinkPayload
                },
                addKey: {
                    publicKey: Crypto.strKey(publicKey),
                    name
                }
            }
        };
        return this._unauthenticatedClient.notify(username, notification)
            .catch(err => Util.reject(this.notifyLinkAccountsAndAddKey, err));
    }
};

module.exports = Token;


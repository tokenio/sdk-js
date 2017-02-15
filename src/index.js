import Crypto from "./security/Crypto";
import LocalStorageCryptoEngine from "./security/LocalStorageCryptoEngine";
import MemoryCryptoEngine from "./security/MemoryCryptoEngine";
import Util from "./Util";
import Member from "./main/Member";
import {KeyLevel} from "./constants";
import HttpClient from "./http/HttpClient";

// Promise polyfill for IE and older browsers
require('es6-promise').polyfill();

// Main entry object
class Token {
    constructor(env = 'prd') {
        this._env = env;
        this._unauthenticatedClient = new HttpClient(env);
        this.KeyLevel = KeyLevel;
        this.Crypto = Crypto;
        this.Util = Util;
        this.LocalStorageCryptoEngine = LocalStorageCryptoEngine;
        this.MemoryCryptoEngine = MemoryCryptoEngine;
    }

    /**
     * Checks if a given username already exists
     *
     * @param {string} username - username to check
     * @return {Promise} result - true if username exists, false otherwise
     */
    usernameExists(username) {
        return Util.callAsync(this.usernameExists, async () => {
            const res = await this._unauthenticatedClient.getMemberId(username);
            return res.data.memberId != null && res.data.memberId !== "";
        });
    }

    /**
     * Retrieved a memberId given a username
     *
     * @param {string} username - username to lookup
     * @return {Promise} result - true if username exists, false otherwise
     */
    getMemberId(username) {
        return Util.callAsync(this.getMemberId, async () => {
            const res = await this._unauthenticatedClient.getMemberId(username);
            return res.data.memberId;
        });
    }

    /**
     * Creates a member with a username and a keypair, using the provided engine
     *
     * @param  {string} username - username to set for member
     * @param  {CryptoEngine class} CryptoEngine - engine to use for key creation and storage
     * @return {Promise} member - Promise of created Member
     */
    createMember(username, CryptoEngine) {
        return Util.callAsync(this.createMember, async () => {
            const keys = Crypto.generateKeys();
            const response = await this._unauthenticatedClient.createMemberId();
            const engine = new CryptoEngine(response.data.memberId);
            const pk1 = engine.generateKey('PRIVILEGED');
            const pk2 = engine.generateKey('STANDARD');
            const pk3 = engine.generateKey('LOW');
            await this._unauthenticatedClient.approveFirstKeys(
                response.data.memberId,
                [pk1, pk2, pk3],
                engine);
            const member = new Member(this._env, response.data.memberId, engine);
            await member.addUsername(username);
            return member;
        });
    }

    /**
     * Provisions a new device for an existing user. The call generates a set
     * of keys that are returned back. The keys need to be approved by an
     * existing device/keys.
     *
     * @param {string} username - user to provision the device for
     * @param  {CryptoEngine class} CryptoEngine - engine to use for key creation and storage
     * @return {Promise} deviceInfo - information about the device provisioned
     */
    provisionDevice(username, CryptoEngine) {
        return Util.callAsync(this.provisionDevice, async () => {
            const res = await this._unauthenticatedClient.getMemberId(username);
            if (!(res.data.memberId)) {
                throw new Error('Invalid username');
        }
            const engine = new CryptoEngine(res.data.memberId);
            const pk1 = engine.generateKey('PRIVILEGED');
            const pk2 = engine.generateKey('STANDARD');
            const pk3 = engine.generateKey('LOW');
            return {
                memberId: res.data.memberId,
                keys: [pk1, pk2, pk3],
            }
        });
    }

    /**
     * Provisions a new device for an existing user. The call generates a set
     * of keys that are returned back. The keys need to be approved by an
     * existing device/keys. This only generates one (LOW) key.
     *
     * @param {string} username - user to provision t he device for
     * @param  {CryptoEngine class} CryptoEngine - engine to use for key creation and storage
     * @return {Promise} deviceInfo - information about the device provisioned
     */
    provisionDeviceLow(username, CryptoEngine) {
        return Util.callAsync(this.provisionDeviceLow, async () => {
            const res = await this._unauthenticatedClient.getMemberId(username);
            if (!(res.data.memberId)) {
                throw new Error('Invalid username');
            }

            const engine = new CryptoEngine(res.data.memberId);
            const pk1 = engine.generateKey('LOW');
            return {
                memberId: res.data.memberId,
                keys: [pk1],
            }
        });
    }

    /**
     * Logs a member in from keys stored in the CryptoEngine. If memberId is not provided,
     * the last member to log on will be used
     *
     * @param  {CryptoEngine class} CryptoEngine - engine to use for key creation and storage
     * @param {string} memberId - optional id of the member we want to log in
     * @return {Promise} member - instantiated member
     */
    login(CryptoEngine, memberId) {
        return Util.callSync(this.login, () => {
            if (!memberId && typeof CryptoEngine["getActiveMemberId"] === 'function') {
                memberId = CryptoEngine.getActiveMemberId();
            }
            const engine = new CryptoEngine(memberId);
            return new Member(this._env, memberId, engine);
        });
    }

    /**
     * Notifies subscribers that accounts should be linked, and passes the bank id and
     * payload
     *
     * @param {string} username - username to notify
     * @param {string} bankId - ID of the bank owning the accounts
     * @param {string} bankName - name of the bank owning the accounts
     * @param {string} accountLinkPayloads - accountLinkPayloads retrieved from the bank
     * @return {Promise} NotifyStatus - status
     */
    notifyLinkAccounts(username, bankId, bankName, accountLinkPayloads) {
        const body = {
            linkAccounts: {
                bankId,
                bankName,
                accountLinkPayloads
            }
        };
        return Util.callAsync(this.notifyLinkAccounts, async () => {
            const res = await this._unauthenticatedClient.notify(username, body);
            return res.data.status;
        });
    }

    /**
     * Notifies subscribers that a key should be added and passes the public Key and
     * optional name
     *
     * @param {string} username - username to notify
     * @param {string} keyName - name for the new key, (e.g Chrome 53.0)
     * @param {Object} key - key
     * @param {string} level - key level
     * @return {Promise} NotifyStatus - status
     */
    notifyAddKey(username, keyName, key, level) {
        const body = {
            addKey: {
                name: keyName,
                key: {
                    id: key.id,
                    level: level,
                    algorithm: key.algorithm,
                    publicKey: Crypto.strKey(key.publicKey)
                }
            }
        };
        return Util.callAsync(this.notifyAddKey, async () => {
            const res = await this._unauthenticatedClient.notify(username, body);
            return res.data.status;
        });
    }

    /**
     * Notifies subscribed devices that accounts should be linked, and passes the bank id and
     * payload
     *
     * @param {string} username - username to notify
     * @param {string} bankId - ID of the bank owning the accounts
     * @param {string} bankName - name of the bank owning the accounts
     * @param {string} accountLinkPayloads - accountsLinkPayload retrieved from the bank
     * @param {string} keyName - name for the new key, (e.g Chrome 53.0)
     * @param {Object} key - key
     * @param {string} level - key level
     * @return {Promise} NotifyStatus - status
     */
    notifyLinkAccountsAndAddKey(username, bankId, bankName, accountLinkPayloads, keyName, key, level) {
        const body = {
            linkAccountsAndAddKey: {
                linkAccounts: {
                    bankId,
                    bankName,
                    accountLinkPayloads
                },
                addKey: {
                    name: keyName,
                    key: {
                        id: key.id,
                        level: level,
                        algorithm: key.algorithm,
                        publicKey: Crypto.strKey(key.publicKey)
                    }
                }
            }
        };
        return Util.callAsync(this.notifyLinkAccountsAndAddKey, async () => {
            const res = await this._unauthenticatedClient.notify(username, body);
            return res.data.status;
        });
    }
}

module.exports = Token;


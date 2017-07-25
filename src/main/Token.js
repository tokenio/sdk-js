import Crypto from "../security/Crypto";
import BrowserCryptoEngine from "../security/engines/BrowserCryptoEngine";
import MemoryCryptoEngine from "../security/engines/MemoryCryptoEngine";
import UnsecuredFileCryptoEngine from "../security/engines/UnsecuredFileCryptoEngine";
import Util from "../Util";
import Member from "../main/Member";
import {KeyLevel} from "../constants";
import HttpClient from "../http/HttpClient";

// Promise polyfill for IE and older browsers
require('es6-promise').polyfill();

/**
 * Main entry object. Allows creation of members, provisioning of devices, logging in,
 * sending notifications, etc, as well as access to other SDK classes.
 */
class Token {
    /**
     * Construct the Token SDK object, pointing to the given environment.
     *
     * @param {string} env - which environment (gateway) to use, (e.g. prd)
     * @param {string} keyDir - absolute directory name of key storage directory
     * @param {function} globalRpcErrorCallback - callback to invoke on any cross-cutting RPC
     * call error. For example: SDK version mismatch
     */
    constructor(env = 'prd', keyDir, globalRpcErrorCallback) {
        this._env = env;
        this._globalRpcErrorCallback = globalRpcErrorCallback;
        this._unauthenticatedClient = new HttpClient(env, this._globalRpcErrorCallback);

        /** Available security levels for keys */
        this.KeyLevel = KeyLevel;

        /** Crypto utility functions */
        this.Crypto = Crypto;

        /** Other utility functions */
        this.Util = Util;

        /** Class for using the browser crypto engine */
        this.BrowserCryptoEngine = BrowserCryptoEngine;

        /** Class for using the memory crypto engine */
        this.MemoryCryptoEngine = MemoryCryptoEngine;

        if (keyDir) {
            UnsecuredFileCryptoEngine.setDirRoot(keyDir);
        }

        /** Class for the Unsecured filestore key root */
        this.UnsecuredFileCryptoEngine = UnsecuredFileCryptoEngine;
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
            return (res.data.memberId ? res.data.memberId !== "" : false);
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
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @return {Promise} member - Promise of created Member
     */
    createMember(username, CryptoEngine) {
        return Util.callAsync(this.createMember, async () => {
            const response = await this._unauthenticatedClient.createMemberId();
            const engine = new CryptoEngine(response.data.memberId);
            const pk1 = await engine.generateKey('PRIVILEGED');
            const pk2 = await engine.generateKey('STANDARD');
            const pk3 = await engine.generateKey('LOW');
            await this._unauthenticatedClient.approveFirstKeys(
                response.data.memberId,
                [pk1, pk2, pk3],
                engine);
            const member = new Member(
                    this._env,
                    response.data.memberId,
                    engine,
                    this._globalRpcErrorCallback);
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
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @return {Promise} deviceInfo - information about the device provisioned
     */
    provisionDevice(username, CryptoEngine) {
        return Util.callAsync(this.provisionDevice, async () => {
            const res = await this._unauthenticatedClient.getMemberId(username);
            if (!(res.data.memberId)) {
                throw new Error('Invalid username');
            }
            const engine = new CryptoEngine(res.data.memberId);
            const pk1 = await engine.generateKey('PRIVILEGED');
            const pk2 = await engine.generateKey('STANDARD');
            const pk3 = await engine.generateKey('LOW');
            return {
                memberId: res.data.memberId,
                keys: [pk1, pk2, pk3],
            };
        });
    }

    /**
     * Provisions a new device for an existing user. The call generates a set
     * of keys that are returned back. The keys need to be approved by an
     * existing device/keys. This only generates one (LOW) key.
     *
     * @param {string} username - user to provision t he device for
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @return {Promise} deviceInfo - information about the device provisioned
     */
    provisionDeviceLow(username, CryptoEngine) {
        return Util.callAsync(this.provisionDeviceLow, async () => {
            const res = await this._unauthenticatedClient.getMemberId(username);
            if (!(res.data.memberId)) {
                throw new Error('Invalid username');
            }

            const engine = new CryptoEngine(res.data.memberId);
            const pk1 = await engine.generateKey('LOW');
            return {
                memberId: res.data.memberId,
                keys: [pk1],
            };
        });
    }

    /**
     * Logs a member in from keys stored in the CryptoEngine. If memberId is not provided,
     * the last member to log on will be used
     *
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @param {string} memberId - optional id of the member we want to log in
     * @return {Promise} member - instantiated member
     */
    login(CryptoEngine, memberId) {
        return Util.callSync(this.login, () => {
            if (!memberId && typeof CryptoEngine.getActiveMemberId === 'function') {
                memberId = CryptoEngine.getActiveMemberId();
            }
            const engine = new CryptoEngine(memberId);
            return new Member(this._env, memberId, engine, this._globalRpcErrorCallback);
        });
    }

    /**
     * Notifies subscribers that accounts should be linked, and passes the bank id and
     * payload
     *
     * @param {string} username - username to notify
     * @param {string} bankId - id of the bank
     * @param {string} bankName - Name of the bank
     * @param {string} bankAuthorization - bankAuthorization retrieved from bank
     * @return {Promise} NotifyStatus - status
     */
    notifyLinkAccounts(username, bankId, bankName, bankAuthorization) {
        const body = {
            linkAccounts: {
                bankAuthorization,
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
     * @param {string} bankAuthorization - bankAuthorization retrieved from bank
     * @param {string} keyName - name for the new key, (e.g Chrome 53.0)
     * @param {Object} key - key
     * @param {string} level - key level
     * @return {Promise} NotifyStatus - status
     */
    notifyLinkAccountsAndAddKey(username, bankAuthorization, keyName, key, level) {
        const body = {
            linkAccountsAndAddKey: {
                linkAccounts: {
                    bankAuthorization,
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

export default Token;

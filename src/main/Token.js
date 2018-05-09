import Crypto from "../security/Crypto";
import BrowserCryptoEngine from "../security/engines/BrowserCryptoEngine";
import MemoryCryptoEngine from "../security/engines/MemoryCryptoEngine";
import ManualCryptoEngine from "../security/engines/ManualCryptoEngine";
import UnsecuredFileCryptoEngine from "../security/engines/UnsecuredFileCryptoEngine";
import Util from "../Util";
import Member from "../main/Member";
import config from "../config.json";
import HttpClient from "../http/HttpClient";
import TokenRequest from "./TokenRequest";

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
     * @param {string} developerKey - the developer key
     * @param {string} keyDir - absolute directory name of key storage directory
     * @param {function} globalRpcErrorCallback - callback to invoke on any cross-cutting RPC
     * @param {bool} loggingEnabled - enable HTTP error logging if true
     * call error. For example: SDK version mismatch
     */
    constructor(env = 'prd', developerKey, keyDir, globalRpcErrorCallback, loggingEnabled) {
        this._env = env;
        this._globalRpcErrorCallback = globalRpcErrorCallback;
        this._developerKey = developerKey;
        this._loggingEnabled = loggingEnabled;
        this._unauthenticatedClient = new HttpClient(
            env,
            developerKey,
            this._globalRpcErrorCallback,
            loggingEnabled);

        /* Available security levels for keys */
        this.KeyLevel = config.KeyLevel;

        /* Crypto utility functions */
        this.Crypto = Crypto;

        /* Other utility functions */
        this.Util = Util;

        /* Class for using the browser crypto engine */
        this.BrowserCryptoEngine = BrowserCryptoEngine;

        /* Class for using the memory crypto engine */
        this.MemoryCryptoEngine = MemoryCryptoEngine;

        /* Class for using the hardcoded crypto engine */
        this.ManualCryptoEngine = ManualCryptoEngine;

        if (keyDir) {
            UnsecuredFileCryptoEngine.setDirRoot(keyDir);
        }
        /* Class for the Unsecured filestore key root */
        this.UnsecuredFileCryptoEngine = UnsecuredFileCryptoEngine;

        /* Class for constructing TokenRequest objects */
        this.TokenRequest = TokenRequest;
    }

    /**
     * If we're on a token page, sets up an iframe to avoid CORS preflights. All requests in this
     * window will be routed through the iframe.
     *
     * @param {string} env - which environment (gateway) to use, (e.g. prd)
     */
    static enableIframePassthrough(env) {
        Util.enableIframePassthrough(config.corsDomainSuffix, config.urls[env]);
    }

    /**
     * If we're on a token page, this disables passthrough
     */
    static disableIframePassthrough() {
        Util.disableIframePassthrough(config.corsDomainSuffix);
    }

    /**
     * Checks if a given alias already exists
     *
     * @param {Object} alias - alias to check
     * @param {string} realm - realm of the alias
     * @return {Promise} result - true if alias exists, false otherwise
     */
    aliasExists(alias, realm) {
        return Util.callAsync(this.aliasExists, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias, realm);
            return (res.data.member && res.data.member.id ? res.data.member.id !== "" : false);
        });
    }

    /**
     * Resolve an alias to a member
     *
     * @param {Object} alias - alias to lookup
     * @param {string} realm - realm of the alias
     * @return {Promise} result - TokenMember protobuf object
     */
    resolveAlias(alias, realm) {
        return Util.callAsync(this.resolveAlias, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias, realm);
            return res.data.member;
        });
    }

    /**
     * Creates a member with a alias and a keypair, using the provided engine and member type.
     *
     * @param  {Object} alias - alias to set for member,
     *                  falsy value or empty object for a temporary member without an alias
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @param  {String} memberType - type of member to create. "PERSONAL" if undefined
     * @param  {String} realm - realm of the alias
     * @return {Promise} member - Promise of created Member
     */
    createMember(alias, CryptoEngine, memberType, realm) {
        return Util.callAsync(this.createMember, async () => {
            const response = await this._unauthenticatedClient.createMemberId(memberType);
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
                this._developerKey,
                this._globalRpcErrorCallback,
                this._loggingEnabled);
            if (alias && Object.keys(alias).length !== 0) {
                await member.addAlias(alias, realm);
            }
            return member;
        });
    }

    /**
     * Creates a member with a alias and a keypair, using the provided engine
     *
     * @param  {Object} alias - alias to set for member,
     *                  falsy value or empty object for a temporary member without an alias
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @param  {string} realm - realm of the alias
     * @return {Promise} member - Promise of created Member
     */
    createBusinessMember(alias, CryptoEngine, realm) {
        return this.createMember(alias, CryptoEngine, "BUSINESS", realm);
    }

    /**
     * Provisions a new device for an existing user. The call generates a set
     * of keys that are returned back. The keys need to be approved by an
     * existing device/keys.
     *
     * @param {string} alias - user to provision the device for
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @param {string} realm - realm of the alias
     * @return {Promise} deviceInfo - information about the device provisioned
     */
    provisionDevice(alias, CryptoEngine, realm) {
        return Util.callAsync(this.provisionDevice, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias, realm);
            if (!res.data.member || !res.data.member.id) {
                throw new Error('Invalid alias');
            }
            const engine = new CryptoEngine(res.data.member.id);
            const pk1 = await engine.generateKey('PRIVILEGED');
            const pk2 = await engine.generateKey('STANDARD');
            const pk3 = await engine.generateKey('LOW');
            return {
                memberId: res.data.member.id,
                keys: [pk1, pk2, pk3],
            };
        });
    }

    /**
     * Provisions a new device for an existing user. The call generates a set
     * of keys that are returned back. The keys need to be approved by an
     * existing device/keys. This only generates one (LOW) key.
     *
     * @param {string} alias - user to provision t he device for
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @param {string} realm - realm of the alias
     * @return {Promise} deviceInfo - information about the device provisioned
     */
    provisionDeviceLow(alias, CryptoEngine, realm) {
        return Util.callAsync(this.provisionDeviceLow, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias, realm);
            if (!res.data.member || !res.data.member.id) {
                throw new Error('Invalid alias');
            }

            const engine = new CryptoEngine(res.data.member.id);
            const pk1 = await engine.generateKey('LOW');
            return {
                memberId: res.data.member.id,
                keys: [pk1],
            };
        });
    }

    /**
     * Returns "logged-in" member that uses keys already in the CryptoEngine.
     * If memberId is not provided, the last member to "log in" will be used.
     *
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @param {string} memberId - optional id of the member we want to log in
     * @return {Promise} member - instantiated member
     */
    getMember(CryptoEngine, memberId) {
        return Util.callSync(this.getMember, () => {
            if (!memberId && typeof CryptoEngine.getActiveMemberId === 'function') {
                memberId = CryptoEngine.getActiveMemberId();
            }
            const engine = new CryptoEngine(memberId);
            return new Member(
                this._env,
                memberId,
                engine,
                this._developerKey,
                this._globalRpcErrorCallback,
                this._loggingEnabled);
        });
    }

    /**
     * Notifies subscribers that accounts should be linked, and passes the bank id and
     * payload
     *
     * @param {Object} alias - alias to notify
     * @param {string} bankAuthorization - bankAuthorization retrieved from bank
     * @param {string} realm - realm of the alias
     * @return {Promise} NotifyStatus - status
     */
    notifyLinkAccounts(alias, bankAuthorization, realm) {
        const body = {
            linkAccounts: {
                bankAuthorization,
            }
        };
        return Util.callAsync(this.notifyLinkAccounts, async () => {
            const res = await this._unauthenticatedClient.notify(alias, body, realm);
            return res.data.status;
        });
    }

    /**
     * Notifies subscribers that a key should be added and passes the public Key and
     * optional name
     *
     * @param {Object} alias - alias to notify
     * @param {string} keyName - name for the new key, (e.g Chrome 53.0)
     * @param {Object} key - key
     * @param {string} level - key level
     * @param {string} expiresMs - when the UI will time out
     * @param {string} realm - realm of the alias
     * @return {Promise} NotifyStatus - status
     */
    notifyAddKey(alias, keyName, key, level, expiresMs, realm) {
        const body = {
            addKey: {
                name: keyName,
                expiresMs,
                key: {
                    id: key.id,
                    level: level,
                    algorithm: key.algorithm,
                    publicKey: Crypto.strKey(key.publicKey)
                }
            }
        };
        return Util.callAsync(this.notifyAddKey, async () => {
            const res = await this._unauthenticatedClient.notify(alias, body, realm);
            return res.data.status;
        });
    }

    /**
     * Notifies subscribed devices that accounts should be linked, and passes the bank id and
     * payload
     *
     * @param {Object} alias - alias to notify
     * @param {string} bankAuthorization - bankAuthorization retrieved from bank
     * @param {string} keyName - name for the new key, (e.g Chrome 53.0)
     * @param {Object} key - key
     * @param {string} level - key level
     * @param {string} realm - realm of the alias
     * @return {Promise} NotifyStatus - status
     */
    notifyLinkAccountsAndAddKey(alias, bankAuthorization, keyName, key, level, realm) {
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
            const res = await this._unauthenticatedClient.notify(alias, body, realm);
            return res.data.status;
        });
    }

    /**
     * Sends a notification to a user to request a payment.
     *
     * @param {Object} tokenPayload - requested transfer token
     * @return {Promise} NotifyStatus - status
     */
    notifyPaymentRequest(tokenPayload) {
        if (!tokenPayload.refId) {
            tokenPayload.refId = Util.generateNonce();
        }
        return Util.callAsync(this.notifyPaymentRequest, async () => {
            const res = await this._unauthenticatedClient.notifyPaymentRequest(tokenPayload);
            return res.data.status;
        });
    }

    /**
     * Gets a list of available banks for linking
     *
     * @param {Object} options - optional parameters for getBanks
     * @return {Promise} banks - list of banks
     */
    getBanks(options) {
        return Util.callAsync(this.getBanks, async () => {
            const res = await this._unauthenticatedClient.getBanks(options);
            return res.data;
        });
    }

    /**
     * Retrieves a request for a token. Called by the web(user) or by a TPP, to get request details.
     *
     * @param {string} requestId - token request id
     * @return {Promise} TokenRequest - token request
     */
    retrieveTokenRequest(requestId) {
        return Util.callAsync(this.retrieveTokenRequest, async () => {
            const res = await this._unauthenticatedClient.retrieveTokenRequest(requestId);
            return res.data.tokenRequest;
        });
    }

    /**
     * Generate a token request authorization URL.
     *
     * @param {string} requestId - request id
     * @param {string} state - original state
     * @param {string} csrfToken - CSRF token
     * @return {string} tokenRequestUrl - token request URL
     */
    generateTokenRequestUrl(requestId, state = "", csrfToken = "") {
        return Util.callSync(this.generateTokenRequestUrl, () => {
            const tokenRequestState = {
                csrfTokenHash: Util.hashString(csrfToken),
                innerState: state
            };
            const serializedState = encodeURIComponent(JSON.stringify(tokenRequestState));

            return config.webAppUrls[this._env] +
                `/request-token/${requestId}?state=${serializedState}`;
        });
    }

    /**
     * Parse a token request callback URL, verify the state and signature,
     * and return the inner state and token id.
     *
     * @param {string} callbackUrl - callback URL
     * @param {string} csrfToken - CSRF token
     * @return {Promise} result - inner state and token id
     */
    parseTokenRequestCallbackUrl(callbackUrl, csrfToken = "") {
        return Util.callAsync(this.parseTokenRequestCallbackUrl, async () => {
            const tokenMember = await this._unauthenticatedClient.getTokenMember();
            const urlParams = Util.parseParamsFromUrl(callbackUrl);

            const params = {
                tokenId: decodeURIComponent(urlParams.tokenId),
                state: JSON.parse(decodeURIComponent(urlParams.state)),
                signature: JSON.parse(decodeURIComponent(urlParams.signature))
            };

            if (params.state.csrfTokenHash !== Util.hashString(csrfToken)) {
                throw new Error('Invalid state.');
            }

            const signingKey = Util.getSigningKey(tokenMember.keys, params.signature);
            Crypto.verifyJson(
                {
                    state: encodeURIComponent(JSON.stringify(params.state)),
                    tokenId: params.tokenId
                },
                params.signature.signature,
                Crypto.bufferKey(signingKey.publicKey)
            );

            return {
                tokenId: params.tokenId,
                innerState: params.state.innerState
            };
        });
    }

    /**
     * Get a token ID based on its token request ID.
     *
     * @param {string} tokenRequestId - token request id
     * @return {Promise} tokenId - token id
     */
    getTokenId(tokenRequestId) {
        return Util.callAsync(this.getTokenId, async () => {
            const res = await this._unauthenticatedClient.getTokenId(tokenRequestId);
            return res.data.tokenId;
        });
    }
}

export default Token;

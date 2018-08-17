// @flow
import Util from '../Util';
import Member from './Member';
import config from '../config.json';
import Crypto from '../security/Crypto';
import TokenRequest from './TokenRequest';
import HttpClient from '../http/HttpClient';
import MemoryCryptoEngine from '../security/engines/MemoryCryptoEngine';
import ManualCryptoEngine from '../security/engines/ManualCryptoEngine';
import BrowserCryptoEngine from '../security/engines/BrowserCryptoEngine';
import KeyStoreCryptoEngine from '../security/engines/KeyStoreCryptoEngine';
import UnsecuredFileCryptoEngine from '../security/engines/UnsecuredFileCryptoEngine';
import {
    Key,
    Bank,
    Alias,
    Paging,
    TokenMember,
    TokenPayload, Signature, DeviceMetadata,
} from '../proto/classes';

/**
 * Main entry object. Allows creation of members, provisioning of devices, logging in,
 * sending notifications, etc, as well as access to other SDK classes.
 */
export class TokenIO {
    _env: string;
    _globalRpcErrorCallback: ?({name: string, message: string}) => void;
    _developerKey: ?string;
    _loggingEnabled: ?boolean;
    _customSdkUrl: ?string;
    _unauthenticatedClient: HttpClient;
    KeyLevel: {
        PRIVILEGED?: string,
        STANDARD?: string,
        LOW?: string,
    };
    Crypto: Crypto;
    Util: Util;
    BrowserCryptoEngine: BrowserCryptoEngine;
    MemoryCryptoEngine: MemoryCryptoEngine;
    ManualCryptoEngine: ManualCryptoEngine;
    UnsecuredFileCryptoEngine: UnsecuredFileCryptoEngine;
    TokenRequest: TokenRequest;

    /**
     * Construct the Token SDK object, pointing to the given environment.
     *
     * @param {Object} options - see below
     */
    constructor(options: {
        env?: string, // Token environment to target, defaults to production
        developerKey?: string, // dev key
        keyDir?: string, // absolute path of the key storage directory (if using UnsecuredFileCryptoEngine)
        globalRpcErrorCallback?: ({name: string, message: string}) => void, // callback to invoke on any cross-cutting RPC
        loggingEnabled?: boolean, // enable HTTP error logging if true
        customSdkUrl?: string, // override the default SDK URL
    }): void {
        const {
            env,
            developerKey,
            keyDir,
            globalRpcErrorCallback,
            loggingEnabled,
            customSdkUrl,
        } = options;
        this._env = env || 'prd';
        this._globalRpcErrorCallback = globalRpcErrorCallback;
        this._developerKey = developerKey;
        this._loggingEnabled = loggingEnabled;
        this._customSdkUrl = customSdkUrl;
        this._unauthenticatedClient = new HttpClient(options);

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
    static enableIframePassthrough(env: string): void {
        Util.enableIframePassthrough(config.corsDomainSuffix, config.urls[env]);
    }

    /**
     * If we're on a token page, this disables passthrough
     */
    static disableIframePassthrough(): void {
        Util.disableIframePassthrough(config.corsDomainSuffix);
    }

    /**
     * Checks if a given alias already exists
     *
     * @param {Object} alias - alias to check
     * @return {Promise} result - true if alias exists, false otherwise
     */
    aliasExists(alias: Alias): Promise<boolean> {
        return Util.callAsync(this.aliasExists, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias);
            return !!res.data?.member?.id;
        });
    }

    /**
     * Resolve an alias to a member
     *
     * @param {Object} alias - alias to lookup
     * @return {Promise} result - TokenMember protobuf object
     */
    resolveAlias(alias: Alias): Promise<?TokenMember> {
        return Util.callAsync(this.resolveAlias, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias);
            return res.data.member && TokenMember.create(res.data.member);
        });
    }

    /**
     * Creates a member with a alias and a keypair, using the provided engine and member type.
     *
     * @param  {Object} alias - alias to set for member,
     *                  falsy value or empty object for a temporary member without an alias
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @param  {String} memberType - type of member to create. "PERSONAL" if undefined
     * @return {Promise} member - Promise of created Member
     */
    createMember(
        alias: ?Alias,
        CryptoEngine: KeyStoreCryptoEngine,
        memberType?: string
    ): Promise<Member> {
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
            const member = new Member({
                env: this._env,
                memberId: response.data.memberId,
                cryptoEngine: engine,
                developerKey: this._developerKey,
                globalRpcErrorCallback: this._globalRpcErrorCallback,
                loggingEnabled: this._loggingEnabled,
                customSdkUrl: this._customSdkUrl,
            });
            alias && await member.addAlias(alias);
            return member;
        });
    }

    /**
     * Creates a member with a alias and a keypair, using the provided engine
     *
     * @param  {Object} alias - alias to set for member,
     *                  falsy value or empty object for a temporary member without an alias
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @return {Promise} member - Promise of created Member
     */
    createBusinessMember(
        alias: ?Alias,
        CryptoEngine: KeyStoreCryptoEngine
    ): Promise<Member> {
        return this.createMember(alias, CryptoEngine, 'BUSINESS');
    }

    /**
     * Provisions a new device for an existing user. The call generates a set
     * of keys that are returned back. The keys need to be approved by an
     * existing device/keys.
     *
     * @param {string} alias - user to provision the device for
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @return {Promise} deviceInfo - information about the device provisioned
     */
    provisionDevice(
        alias: Alias,
        CryptoEngine: KeyStoreCryptoEngine
    ): Promise<{memberId: string, keys: Array<Key>}> {
        return Util.callAsync(this.provisionDevice, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias);
            if (!res.data.member || !res.data.member.id) {
                throw new Error('Invalid alias');
            }
            const engine = new CryptoEngine(res.data.member.id);
            const pk1 = Key.create(await engine.generateKey('PRIVILEGED'));
            const pk2 = Key.create(await engine.generateKey('STANDARD'));
            const pk3 = Key.create(await engine.generateKey('LOW'));
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
     * @param {string} alias - user to provision the device for
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @param {number} expirationMs - (optional) expiration duration of key in milliseconds
     * @return {Promise} deviceInfo - information about the device provisioned
     */
    provisionDeviceLow(
        alias: Alias,
        CryptoEngine: KeyStoreCryptoEngine,
        expirationMs?: number = config.lowKeyExpiration
    ): Promise<{memberId: string, keys: Array<Key>}> {
        return Util.callAsync(this.provisionDeviceLow, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias);
            if (!res.data.member || !res.data.member.id) {
                throw new Error('Invalid alias');
            }

            const engine = new CryptoEngine(res.data.member.id);
            const pk1 = Key.create(await engine.generateKey('LOW', expirationMs));
            return {
                memberId: res.data.member.id,
                keys: [pk1],
            };
        });
    }

    /**
     * Returns 'logged-in' member that uses keys already in the CryptoEngine.
     * If memberId is not provided, the last member to 'log in' will be used.
     *
     * @param  {Class} CryptoEngine - engine to use for key creation and storage
     * @param {string} memberId - optional id of the member we want to log in
     * @return {Promise} member - instantiated member
     */
    getMember(
        CryptoEngine: KeyStoreCryptoEngine,
        memberId?: string
    ): Member {
        return Util.callSync(this.getMember, () => {
            if (!memberId && typeof CryptoEngine.getActiveMemberId === 'function') {
                memberId = CryptoEngine.getActiveMemberId();
            }
            const engine = new CryptoEngine(memberId);
            return new Member({
                env: this._env,
                memberId,
                cryptoEngine: engine,
                developerKey: this._developerKey,
                globalRpcErrorCallback: this._globalRpcErrorCallback,
                loggingEnabled: this._loggingEnabled,
                customSdkUrl: this._customSdkUrl,
            });
        });
    }

    /**
     * Notifies subscribers that accounts should be linked, and passes the bank id and
     * payload
     *
     * @param {Object} alias - alias to notify
     * @param {string} bankAuthorization - bankAuthorization retrieved from bank
     * @return {Promise} NotifyStatus - status
     */
    notifyLinkAccounts(
        alias: Alias,
        bankAuthorization: any
    ): Promise<?string> {
        const body = {
            linkAccounts: {
                bankAuthorization,
            },
        };
        return Util.callAsync(this.notifyLinkAccounts, async () => {
            const res = await this._unauthenticatedClient.notify(alias, body);
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
     * @return {Promise} NotifyStatus - status
     */
    notifyAddKey(
        alias: Alias,
        keyName: string,
        key: Key,
        level: string,
        expiresMs: string
    ): Promise<?string> {
        const body = {
            addKey: {
                name: keyName,
                expiresMs,
                key: {
                    id: key.id,
                    level: level,
                    algorithm: key.algorithm,
                    publicKey: Crypto.strKey(key.publicKey),
                    ...key.expiresAtMs && {expiresAtMs: key.expiresAtMs},
                },
            },
        };
        return Util.callAsync(this.notifyAddKey, async () => {
            const res = await this._unauthenticatedClient.notify(alias, body);
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
     * @return {Promise} NotifyStatus - status
     */
    notifyLinkAccountsAndAddKey(
        alias: Alias,
        bankAuthorization: string,
        keyName: string,
        key: Key,
        level: string
    ): Promise<?string> {
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
                        publicKey: Crypto.strKey(key.publicKey),
                        ...key.expiresAtMs && {expiresAtMs: key.expiresAtMs},
                    },
                },
            },
        };
        return Util.callAsync(this.notifyLinkAccountsAndAddKey, async () => {
            const res = await this._unauthenticatedClient.notify(alias, body);
            return res.data.status;
        });
    }

    /**
     * Sends a notification to a user to request a payment.
     *
     * @param {Object} tokenPayload - requested transfer token
     * @return {Promise} NotifyStatus - status
     */
    notifyPaymentRequest(tokenPayload: TokenPayload): Promise<?string> {
        if (!tokenPayload.refId) {
            tokenPayload.refId = Util.generateNonce();
        }
        return Util.callAsync(this.notifyPaymentRequest, async () => {
            const res = await this._unauthenticatedClient.notifyPaymentRequest(tokenPayload);
            return res.data.status;
        });
    }

    /**
     * Notifies subscribed devices that a token payload should be endorsed and keys should be
     * added.
     *
     * @param {Object} tokenPayload - the endorseAndAddKey payload to be sent
     * @param {Array} keys - token keys to be added
     * @param {Object} deviceMetadata - device metadata of the keys
     * @param {string} tokenRequestId - (optional) token request Id
     * @param {string} bankId - (optional) bank Id
     * @param {string} state - (optional) token request state for signing
     * @return {Promise} result - notification Id and notify status
     */
    notifyEndorseAndAddKey(
        tokenPayload: TokenPayload,
        keys: Array<Key>,
        deviceMetadata: DeviceMetadata,
        tokenRequestId: string,
        bankId: string,
        state: string
    ): Promise<{notificationId: ?string, status: ?string}> {
        const endorseAndAddKey = {
            payload: tokenPayload,
            addKey: {
                keys: keys,
                deviceMetadata: deviceMetadata,
            },
            tokenRequestId: tokenRequestId,
            bankId: bankId,
            state: state,
        };
        return Util.callAsync(this.notifyEndorseAndAddKey, async () => {
            const res = await this._unauthenticatedClient.notifyEndorseAndAddKey(endorseAndAddKey);
            return {
                notificationId: res.data.notificationId,
                status: res.data.status,
            };
        });
    }

    /**
     * Invalidate a notification.
     *
     * @param {Object} notificationId - the notification id to invalidate
     * @return {Promise} NotifyStatus - status
     */
    invalidateNotification(notificationId: string): Promise<?string> {
        return Util.callAsync(this.invalidateNotification, async () => {
            const res = await this._unauthenticatedClient.invalidateNotification(notificationId);
            return res.data.status;
        });
    }

    /**
     * Gets a list of available banks for linking
     *
     * @param {Object} options - optional parameters for getBanks
     * @return {Promise} banks - list of banks
     */
    getBanks(
        options?: {
            ids?: Array<string>,
            search?: string,
            country?: string,
            page?: number,
            perPage?: number,
            provider?: string,
        }
    ): Promise<{banks: ?Array<Bank>, paging: Paging}> {
        return Util.callAsync(this.getBanks, async () => {
            const res = await this._unauthenticatedClient.getBanks(options);
            return {
                banks: res.data.banks && res.data.banks.map(b => Bank.create(b)),
                paging: Paging.create(res.data.paging),
            };
        });
    }

    /**
     * Retrieves a request for a token. Called by the web(user) or by a TPP, to get request details.
     *
     * @param {string} requestId - token request id
     * @return {Promise} TokenRequest - token request
     */
    retrieveTokenRequest(requestId: string): Promise<?TokenRequest> {
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
    generateTokenRequestUrl(
        requestId: string,
        state?: string = '',
        csrfToken?: string = ''
    ): string {
        return Util.callSync(this.generateTokenRequestUrl, () => {
            const tokenRequestState = {
                csrfTokenHash: Util.hashString(csrfToken),
                innerState: state,
            };
            const serializedState = encodeURIComponent(JSON.stringify(tokenRequestState));

            return `${this._customSdkUrl || config.webAppUrls[this._env]}/request-token/${requestId}?state=${serializedState}`;
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
    parseTokenRequestCallbackUrl(
        callbackUrl: string,
        csrfToken?: string = ''
    ): Promise<{tokenId: string, innerState: string}> {
        return Util.callAsync(this.parseTokenRequestCallbackUrl, async () => {
            const tokenMember = await this._unauthenticatedClient.getTokenMember();
            const urlParams = Util.parseParamsFromUrl(callbackUrl);

            const params = {
                tokenId: decodeURIComponent(urlParams.tokenId),
                state: JSON.parse(decodeURIComponent(urlParams.state)),
                signature: JSON.parse(decodeURIComponent(urlParams.signature)),
            };

            if (params.state.csrfTokenHash !== Util.hashString(csrfToken)) {
                throw new Error('Invalid state.');
            }
            const signingKey = Util.getSigningKey(tokenMember.keys, params.signature);
            await Crypto.verifyJson(
                {
                    state: encodeURIComponent(JSON.stringify(params.state)),
                    tokenId: params.tokenId,
                },
                params.signature.signature,
                Crypto.bufferKey(signingKey.publicKey)
            );
            return {
                tokenId: params.tokenId,
                innerState: params.state.innerState,
            };
        });
    }

    /**
     * Get the token request result based on its token request ID.
     *
     * @param {string} tokenRequestId - token request id
     * @return {Promise} tokenId - token id and signature
     */
    getTokenRequestResult(tokenRequestId: string): Promise<{tokenId: ?string, signature: ?Signature}> {
        return Util.callAsync(this.getTokenRequestResult, async () => {
            const res = await this._unauthenticatedClient.getTokenRequestResult(tokenRequestId);
            return {
                tokenId: res.data.tokenId,
                signature: Signature.create(res.data.signature),
            };
        });
    }
}

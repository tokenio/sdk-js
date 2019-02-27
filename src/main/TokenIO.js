// @flow
import BrowserCryptoEngine from '../security/engines/BrowserCryptoEngine';
import config from '../config.json';
import Crypto from '../security/Crypto';
import HttpClient from '../http/HttpClient';
import KeyStoreCryptoEngine from '../security/engines/KeyStoreCryptoEngine';
import ManualCryptoEngine from '../security/engines/ManualCryptoEngine';
import Member from './Member';
import MemoryCryptoEngine from '../security/engines/MemoryCryptoEngine';
import TokenRequest from './TokenRequest';
import TransferTokenRequest from './TransferTokenRequest';
import UnsecuredFileCryptoEngine from '../security/engines/UnsecuredFileCryptoEngine';
import Util from '../Util';
import {
    Alias,
    Bank,
    Blob,
    DeviceMetadata,
    Key,
    NotifyStatus,
    Paging,
    ReceiptContact,
    Signature,
    TokenMember,
    TokenPayload,
    Customization,
} from '../proto';
import type {
    NotifyStatusEnum,
    ResourceTypeEnum,
    TokenRequestOptions,
} from '../proto';

/**
 * Main entry object. Allows creation of members, provisioning of devices, logging in,
 * sending notifications, etc, as well as access to other SDK classes.
 */
export class TokenIO {
    options: Object;
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
     * @param options - see below
     */
    constructor(options: {
        env?: string, // Token environment to target, defaults to production
        developerKey?: string, // dev key
        // absolute path of the key storage directory (if using UnsecuredFileCryptoEngine)
        keyDir?: string,
        // callback to invoke on any cross-cutting RPC
        globalRpcErrorCallback?: ({name: string, message: string}) => void,
        loggingEnabled?: boolean, // enable HTTP error logging if true
        customSdkUrl?: string, // override the default SDK URL
        customResponseInterceptor?: Object, // custom HTTP response interceptor for axios
    }): void {
        this.options = options;
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

        if (options.keyDir) {
            UnsecuredFileCryptoEngine.setDirRoot(options.keyDir);
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
     * @param env - which environment (gateway) to use, (e.g. prd)
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
     * @param alias - alias to check
     * @return true if alias exists, false otherwise
     */
    aliasExists(alias: Alias): Promise<boolean> {
        return Util.callAsync(this.aliasExists, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias.toJSON());
            const ret = res.data && res.data.member && res.data.member.id;
            return !!ret;
        });
    }

    /**
     * Normalizes an alias
     * you probably won't need to call this as this is automatically called before addAlias()
     *
     * @param alias - alias to normalize
     * @return normalized alias
     */
    normalizeAlias(alias: Alias): Promise<Alias> {
        return Util.callAsync(this.normalizeAlias, async () => {
            const res = await this._unauthenticatedClient.normalizeAlias(alias.toJSON());
            return Alias.create(res.data.alias);
        });
    }

    /**
     * Resolve an alias to a member
     *
     * @param alias - alias to lookup
     * @return {Promise<TokenMember|undefined>} TokenMember protobuf object
     */
    resolveAlias(alias: Alias): Promise<?TokenMember> {
        return Util.callAsync(this.resolveAlias, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias.toJSON());
            return res.data.member && TokenMember.create(res.data.member);
        });
    }

    /**
     * Create a TokenRequest for an access token
     *
     * @param resources - resources to request access of
     * @returns The created TokenRequest
     */
    createAccessTokenRequest(
        resources: Array<ResourceTypeEnum>
    ): TokenRequest {
        return Util.callSync(this.createAccessTokenRequest, () => {
            const payload = {
                refId: Util.generateNonce(),
                accessBody: {type: resources},
                to: {},
                callbackState: {
                    csrfTokenHash: Util.hashString(''),
                    innerState: '',
                },
            };
            return new TokenRequest(payload);
        });
    }

    /**
     * Create a TokenRequest for a transfer token
     *
     * @param lifetimeAmount - lifetime amount of the token
     * @param currency - 3 letter currency code for the amount, e.g. 'USD'
     * @returns The created TokenRequest
     */
    createTransferTokenRequest(
        lifetimeAmount: number | string,
        currency: string
    ): TokenRequest {
        return Util.callSync(this.createTransferTokenRequest, () => {
            const payload = {
                refId: Util.generateNonce(),
                transferBody: {
                    currency: currency,
                    lifetimeAmount: lifetimeAmount.toString(),
                    destinations: [],
                },
                to: {},
                callbackState: {
                    csrfTokenHash: Util.hashString(''),
                    innerState: '',
                },
            };
            return new TransferTokenRequest(payload);
        });
    }

    /**
     * Creates a member with a alias and a keypair, using the provided engine and member type.
     *
     * @param  alias - alias to set for member,
     *                  falsy value or empty object for a temporary member without an alias
     * @param  CryptoEngine - engine to use for key creation and storage
     * @param  memberType - type of member to create. "PERSONAL" if undefined
     * @param  tokenRequestId - (optional) token request id if the member is being claimed
     * @return Promise of created Member
     */
    createMember(
        alias: ?Alias,
        CryptoEngine: KeyStoreCryptoEngine,
        memberType?: string,
        tokenRequestId?: string
    ): Promise<Member> {
        return Util.callAsync(this.createMember, async () => {
            const response = await this._unauthenticatedClient.createMemberId(
                memberType,
                tokenRequestId
            );
            const engine = new CryptoEngine(response.data.memberId);
            const pk1 = await engine.generateKey('PRIVILEGED');
            const pk2 = await engine.generateKey('STANDARD');
            const pk3 = await engine.generateKey('LOW');
            await this._unauthenticatedClient.approveFirstKeys(
                response.data.memberId,
                [pk1, pk2, pk3],
                engine);
            const member = new Member({
                memberId: response.data.memberId,
                cryptoEngine: engine,
                ...this.options,
            });
            alias && await member.addAlias(alias);
            return member;
        });
    }

    /**
     * Creates a member with a alias and a keypair, using the provided engine
     *
     * @param  alias - alias to set for member,
     *                  falsy value or empty object for a temporary member without an alias
     * @param  CryptoEngine - engine to use for key creation and storage
     * @return Promise of created Member
     */
    createBusinessMember(
        alias: ?Alias,
        CryptoEngine: KeyStoreCryptoEngine
    ): Promise<Member> {
        return this.createMember(alias, CryptoEngine, 'BUSINESS');
    }

    /**
     * Creates a claimed member with a alias and a keypair, using the provided engine
     *
     * @param  alias - alias to set for member,
     *                  falsy value or empty object for a temporary member without an alias
     * @param  CryptoEngine - engine to use for key creation and storage
     * @param  tokenRequestId - token request id
     * @return Promise of created Member
     */
    createClaimedMember(
        alias: ?Alias,
        CryptoEngine: KeyStoreCryptoEngine,
        tokenRequestId: string
    ): Promise<Member> {
        return this.createMember(alias, CryptoEngine, 'TRANSIENT', tokenRequestId);
    }

    /**
     * Provisions a new device for an existing app. The call generates a set
     * of keys that are returned back. The keys need to be approved by an
     * existing device/keys.
     *
     * @param alias - app to provision the device for
     * @param  CryptoEngine - engine to use for key creation and storage
     * @return information about the device provisioned
     */
    provisionDevice(
        alias: Alias,
        CryptoEngine: KeyStoreCryptoEngine
    ): Promise<{memberId: string, keys: Array<Key>}> {
        return Util.callAsync(this.provisionDevice, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias.toJSON());
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
     * Provisions a new device for an existing app. The call generates a set
     * of keys that are returned back. The keys need to be approved by an
     * existing device/keys. This only generates one (LOW) key.
     *
     * @param alias - app to provision the device for
     * @param  CryptoEngine - engine to use for key creation and storage
     * @param expirationMs - (optional) expiration duration of key in milliseconds
     * @return information about the device provisioned
     */
    provisionDeviceLow(
        alias: Alias,
        CryptoEngine: KeyStoreCryptoEngine,
        expirationMs?: number = config.lowKeyExpiration
    ): Promise<{memberId: string, keys: Array<Key>}> {
        return Util.callAsync(this.provisionDeviceLow, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias.toJSON());
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
     * @param  CryptoEngine - engine to use for key creation and storage
     * @param memberId - optional id of the member we want to log in
     * @return instantiated member
     */
    getMember(
        CryptoEngine: KeyStoreCryptoEngine,
        memberId: any
    ): Member {
        return Util.callSync(this.getMember, () => {
            if (!memberId && typeof CryptoEngine.getActiveMemberId === 'function') {
                memberId = CryptoEngine.getActiveMemberId();
            }
            const engine = new CryptoEngine(memberId);
            return new Member({
                memberId,
                cryptoEngine: engine,
                ...this.options,
            });
        });
    }

    /**
     * Notifies subscribers that a key should be added and passes the public Key and
     * optional name
     *
     * @param alias - alias to notify
     * @param keys - token keys to be added
     * @param deviceMetadata - device metadata of the keys
     * @return status
     */
    notifyAddKey(
        alias: Alias,
        keys: Array<Key>,
        deviceMetadata: DeviceMetadata,
    ): Promise<NotifyStatusEnum> {
        const body = {
            addKey: {
                keys: keys.map(k => k.toJSON()),
                deviceMetadata: deviceMetadata.toJSON(),
            },
        };
        return Util.callAsync(this.notifyAddKey, async () => {
            const res = await this._unauthenticatedClient.notify(alias.toJSON(), body);
            return NotifyStatus[res.data.status];
        });
    }

    /**
     * Sends a notification to a app to request a payment.
     *
     * @param tokenPayload - requested transfer token
     * @return status
     */
    notifyPaymentRequest(tokenPayload: TokenPayload): Promise<NotifyStatusEnum> {
        tokenPayload = tokenPayload.toJSON();
        if (!tokenPayload.refId) {
            tokenPayload.refId = Util.generateNonce();
        }
        return Util.callAsync(this.notifyPaymentRequest, async () => {
            const res = await this._unauthenticatedClient.notifyPaymentRequest(tokenPayload);
            return NotifyStatus[res.data.status];
        });
    }

    /**
     * Notifies subscribed devices that a token should be created and endorsed.
     *
     * @param tokenRequestId - token request ID
     * @param keys - (optional) token keys to be added
     * @param deviceMetadata - device metadata of the keys
     * @param receiptContact - (optional) receipt contact
     * @return {Object} response to the API call
     */
    notifyCreateAndEndorseToken(
        tokenRequestId: string,
        keys: Array<Key>,
        deviceMetadata: DeviceMetadata,
        receiptContact: ReceiptContact
    ): Promise<{notificationId: string, status: NotifyStatusEnum}> {
        const addKey = {
            keys: keys.map(k => k.toJSON()),
            deviceMetadata: deviceMetadata.toJSON(),
        };
        return Util.callAsync(this.notifyCreateAndEndorseToken, async () => {
            const res = await this._unauthenticatedClient.notifyCreateAndEndorseToken(
                tokenRequestId,
                addKey,
                receiptContact);
            return {
                notificationId: res.data.notificationId,
                status: NotifyStatus[res.data.status],
            };
        });
    }

    /**
     * Notifies subscribed devices that a token payload should be endorsed and keys should be
     * added.
     *
     * @param tokenPayload - the endorseAndAddKey payload to be sent
     * @param keys - token keys to be added
     * @param deviceMetadata - device metadata of the keys
     * @param tokenRequestId - (optional) token request Id
     * @param bankId - (optional) bank Id
     * @param state - (optional) token request state for signing
     * @param receiptContact - (optional) receipt contact
     * @return notification Id and notify status
     * @deprecated use notifyCreateAndEndorseToken instead
     */
    notifyEndorseAndAddKey(
        tokenPayload: TokenPayload,
        keys: Array<Key>,
        deviceMetadata: DeviceMetadata,
        tokenRequestId: string,
        bankId: string,
        state: string,
        receiptContact: ReceiptContact,
    ): Promise<{notificationId: string, status: NotifyStatusEnum}> {
        const endorseAndAddKey = {
            payload: tokenPayload.toJSON(),
            addKey: {
                keys: keys.map(k => k.toJSON()),
                deviceMetadata: deviceMetadata.toJSON(),
            },
            tokenRequestId: tokenRequestId,
            bankId: bankId,
            state: state,
            contact: receiptContact,
        };
        return Util.callAsync(this.notifyEndorseAndAddKey, async () => {
            const res = await this._unauthenticatedClient.notifyEndorseAndAddKey(endorseAndAddKey);
            return {
                notificationId: res.data.notificationId,
                status: NotifyStatus[res.data.status],
            };
        });
    }

    /**
     * Invalidate a notification.
     *
     * @param notificationId - the notification id to invalidate
     * @return status
     */
    invalidateNotification(notificationId: string): Promise<NotifyStatusEnum> {
        return Util.callAsync(this.invalidateNotification, async () => {
            const res = await this._unauthenticatedClient.invalidateNotification(notificationId);
            return NotifyStatus[res.data.status];
        });
    }

    /**
     * Gets a list of available banks for linking
     *
     * @param options - optional parameters for getBanks
     * @return list of banks
     */
    getBanks(
        options?: {
            ids?: Array<string>,
            search?: string,
            country?: string,
            page?: number,
            perPage?: number,
            provider?: string,
            destinationCountry?: string,
        }
    ): Promise<{banks: Array<Bank>, paging: Paging}> {
        return Util.callAsync(this.getBanks, async () => {
            const res = await this._unauthenticatedClient.getBanksOrCountries(options);
            return {
                banks: res.data.banks ? res.data.banks.map(b => Bank.create(b)) : [],
                paging: Paging.create(res.data.paging),
            };
        });
    }

    /**
     * Gets a list of available countries for linking
     *
     * @param options - optional parameters for getBanksCountries
     * @return list of countries with linkable banks
     */
    getCountries(
        options?: {
            ids?: Array<string>,
            search?: string,
            country?: string,
            provider?: string,
            destinationCountry?: string,
        }
    ): Promise<{banks: Array<Bank>, paging: Paging}> {
        return Util.callAsync(this.getBanks, async () => {
            const res = await this._unauthenticatedClient.getBanksOrCountries(options, true);
            return res.data.countries || [];
        });
    }

    /**
     * Updates an existing token request.
     *
     * @param {string} requestId - token request ID
     * @param {Object} options - new token request options
     * @return empty promise
     */
    updateTokenRequest(requestId: string, options: TokenRequestOptions): Promise<void> {
        return Util.callAsync(this.updateTokenRequest, async () => {
            await this._unauthenticatedClient.updateTokenRequest(requestId, options);
        });
    }

    /**
     * Retrieves a request for a token. Called by the web(app) or by a TPP, to get request details.
     *
     * @param requestId - token request id
     * @return information about the tokenRequest
     */
    retrieveTokenRequest(
        requestId: string
    ): Promise<?{tokenRequest: TokenRequest, customization?: Customization}> {
        return Util.callAsync(this.retrieveTokenRequest, async () => {
            const res = await this._unauthenticatedClient.retrieveTokenRequest(requestId);
            return {
                tokenRequest: res.data.tokenRequest,
                customization: res.data.customization &&
                    Customization.create(res.data.customization),
            };
        });
    }

    /**
     * Generate a token request authorization URL.
     *
     * @param requestId - request id
     * @param state - original state
     * @param csrfToken - CSRF token
     * @return token request URL
     */
    generateTokenRequestUrl(
        requestId: string,
        state?: string = '',
        csrfToken?: string = ''
    ): string {
        const tokenRequestState = {
            csrfTokenHash: Util.hashString(csrfToken),
            innerState: state,
        };
        const serializedState = encodeURIComponent(JSON.stringify(tokenRequestState));
        return `${this.options.customSdkUrl || config.webAppUrls[this.options.env]}/app/request-token/${requestId}?state=${serializedState}`; // eslint-disable-line max-len
    }

    /**
     * Downloads a blob from the server.
     *
     * @param blobId - id of the blob
     * @return downloaded blob
     * @throws error if blob not found
     */
    getBlob(blobId: string): Promise<Blob> {
        return Util.callAsync(this.getBlob, async () => {
            const res = await this._unauthenticatedClient.getBlob(blobId);
            return Blob.create(res.data.blob);
        });
    }

    /**
     * Parse a token request callback URL, verify the state and signature,
     * and return the inner state and token id.
     *
     * @param callbackUrl - callback URL
     * @param csrfToken - CSRF token
     * @return inner state and token id
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
     * @param tokenRequestId - token request id
     * @return token id and signature
     */
    getTokenRequestResult(
        tokenRequestId: string
    ): Promise<{tokenId: string, signature: Signature}> {
        return Util.callAsync(this.getTokenRequestResult, async () => {
            const res = await this._unauthenticatedClient.getTokenRequestResult(tokenRequestId);
            return {
                tokenId: res.data.tokenId,
                signature: Signature.create(res.data.signature),
            };
        });
    }
}

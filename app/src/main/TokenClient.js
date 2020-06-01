// @flow
import {TokenClient as Core} from '@token-io/core';
import config from '../config.json';
import BrowserCryptoEngine from '../security/engines/BrowserCryptoEngine';
import Member from './Member';
import Util from '../Util';
import HttpClient from '../http/HttpClient';
import type {
    Alias,
    Blob,
    DeviceMetadata,
    Key,
    NotifyStatus,
    ReceiptContact,
    Signature,
    TokenRequest,
    TokenRequestOptions,
    KeyStoreCryptoEngine,
} from '@token-io/core';

/**
 * Token SDK entry point.
 */
export class TokenClient extends Core {
    BrowserCryptoEngine: Class<KeyStoreCryptoEngine>;

    constructor(options: {
        // Token environment to target, defaults to 'prd'
        env?: string,
        // dev key
        developerKey?: string,
        // callback to invoke on any cross-cutting RPC
        globalRpcErrorCallback?: ({name: string, message: string}) => void,
        // enables HTTP error logging if true
        loggingEnabled?: boolean,
        // custom API URL to override the default
        customSdkUrl?: string,
        // custom HTTP response interceptor for axios
        customResponseInterceptor?: Object,
    }) {
        super(options);
        this._unauthenticatedClient = new HttpClient(options);
        this.BrowserCryptoEngine = BrowserCryptoEngine;
        this.Util = Util;
    }

    /**
     * Creates a Token member with an alias.
     *
     * @param alias - the member's alias
     * @param CryptoEngine - engine to use for key creation and storage
     * @param memberType - type of member to create. "PERSONAL" if undefined
     * @param tokenRequestId - (optional) token request ID if the member is being claimed
     * @return Promise of created Member
     */
    createMember(
        alias: ?Alias,
        CryptoEngine: Class<KeyStoreCryptoEngine> = this.BrowserCryptoEngine,
        memberType?: string,
        tokenRequestId?: string
    ): Promise<Member> {
        return super.createMemberCore(alias, CryptoEngine, Member, memberType, tokenRequestId);
    }

    /**
     * Returns 'logged-in' member that uses keys already in the CryptoEngine.
     * If memberId is not provided, the last member to 'log in' will be used.
     *
     * @param CryptoEngine - engine to use for key creation and storage
     * @param memberId - optional ID of the member we want to log in
     * @return instantiated member
     */
    getMember(
        CryptoEngine: Class<KeyStoreCryptoEngine> = this.BrowserCryptoEngine,
        memberId: string
    ): Member {
        return super.getMemberCore(CryptoEngine, Member, memberId);
    }

    /**
     * Provisions a new device for an existing user. The call generates a set
     * of keys that are returned back. The keys need to be approved by an
     * existing device/keys.
     *
     * @param alias - user to provision the device for
     * @param CryptoEngine - engine to use for key creation and storage
     * @return information about the device provisioned
     */
    provisionDevice(
        alias: Alias,
        CryptoEngine: Class<KeyStoreCryptoEngine>
    ): Promise<{memberId: string, keys: Array<Key>}> {
        return Util.callAsync(this.provisionDevice, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias);
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
     * @param alias - user to provision the device for
     * @param  CryptoEngine - engine to use for key creation and storage
     * @param expirationMs - (optional) expiration duration of key in milliseconds
     * @return information about the device provisioned
     */
    provisionDeviceLow(
        alias: Alias,
        CryptoEngine: Class<KeyStoreCryptoEngine>,
        expirationMs?: number = config.lowKeyExpiration
    ): Promise<{memberId: string, keys: Array<Key>}> {
        return Util.callAsync(this.provisionDeviceLow, async () => {
            const res = await this._unauthenticatedClient.resolveAlias(alias);
            if (!res.data.member || !res.data.member.id) {
                throw new Error('Invalid alias');
            }
            const engine = new CryptoEngine(res.data.member.id);
            const pk1 = await engine.generateKey('LOW', expirationMs);
            return {
                memberId: res.data.member.id,
                keys: [pk1],
            };
        });
    }

    /**
     * Notifies subscribers that a key should be added and passes the public Key and
     * optional name.
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
    ): Promise<NotifyStatus> {
        const body = {
            addKey: {
                keys,
                deviceMetadata,
            },
        };
        return Util.callAsync(this.notifyAddKey, async () => {
            const res = await this._unauthenticatedClient.notify(alias, body);
            return res.data.status;
        });
    }

    /**
     * Sends a notification to a user to request a payment.
     *
     * @param tokenPayload - requested transfer token
     * @return status
     */
    notifyPaymentRequest(tokenPayload: Object): Promise<NotifyStatus> {
        if (!tokenPayload.refId) {
            tokenPayload.refId = Util.generateNonce();
        }
        return Util.callAsync(this.notifyPaymentRequest, async () => {
            const res = await this._unauthenticatedClient.notifyPaymentRequest(tokenPayload);
            return res.data.status;
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
    ): Promise<{notificationId: string, status: NotifyStatus}> {
        const addKey = {
            keys,
            deviceMetadata,
        };
        return Util.callAsync(this.notifyCreateAndEndorseToken, async () => {
            const res = await this._unauthenticatedClient.notifyCreateAndEndorseToken(
                tokenRequestId,
                addKey,
                receiptContact);
            return res.data;
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
        tokenPayload: Object,
        keys: Array<Key>,
        deviceMetadata: DeviceMetadata,
        tokenRequestId: string,
        bankId: string,
        state: string,
        receiptContact: ReceiptContact,
    ): Promise<{notificationId: string, status: NotifyStatus}> {
        const endorseAndAddKey = {
            payload: tokenPayload,
            addKey: {
                keys,
                deviceMetadata,
            },
            tokenRequestId: tokenRequestId,
            bankId: bankId,
            state: state,
            contact: receiptContact,
        };
        return Util.callAsync(this.notifyEndorseAndAddKey, async () => {
            const res = await this._unauthenticatedClient.notifyEndorseAndAddKey(endorseAndAddKey);
            return res.data;
        });
    }

    /**
     * Invalidates a notification.
     *
     * @param notificationId - the notification ID to invalidate
     * @return status
     */
    invalidateNotification(notificationId: string): Promise<NotifyStatus> {
        return Util.callAsync(this.invalidateNotification, async () => {
            const res = await this._unauthenticatedClient.invalidateNotification(notificationId);
            return res.data.status;
        });
    }

    /**
     * Generates a blocking function to invalidate a notification.
     *
     * @param notificationId - the notification ID to invalidate
     * @return {Promise<function|undefined>} blocking function to invalidate the notification
     */
    getBlockingInvalidateNotificationFunction(notificationId: string): Promise<?() => void> {
        return Util.callAsync(this.getBlockingInvalidateNotificationFunction, async () => {
            const res = await this._unauthenticatedClient.invalidateNotification(
                notificationId,
                true
            );
            if (res && res.data &&
                typeof res.data.dispatchRequest === 'function') {
                return res.data.dispatchRequest;
            }
        });
    }

    /**
     * Updates an existing token request.
     *
     * @param requestId - token request ID
     * @param options - new token request options
     * @return empty promise
     */
    updateTokenRequest(requestId: string, options: TokenRequestOptions): Promise<void> {
        return Util.callAsync(this.updateTokenRequest, async () => {
            await this._unauthenticatedClient.updateTokenRequest(requestId, options);
        });
    }

    /**
     * Completes account recovery if the default recovery rule was set.
     *
     * @param memberId - the member id
     * @param verificationId - the verification id
     * @param code - the code
     * @param cryptoEngine - crypto engine
     * @return the new member
     */
    completeRecoveryWithDefaultRule(
        memberId: string, verificationId: string, code: string,
        cryptoEngine: Class<KeyStoreCryptoEngine>
    ): Promise<Member>{
        return Util.callAsync(this.completeRecoveryWithDefaultRule,async () => {
            const {ENV: TEST_ENV = 'dev'} = process.env;
            const devKey = require('../../src/config.json').devKey[TEST_ENV];
            const privilegedKey = await cryptoEngine.generateKey('PRIVILEGED');
            const standardKey = await cryptoEngine.generateKey('STANDARD');
            const lowKey = await cryptoEngine.generateKey('LOW');
            const signer = await cryptoEngine.createSigner('PRIVILEGED');
            const recoveryResponse = await this._unauthenticatedClient.completeRecovery(
                verificationId, code, privilegedKey);
            const updateMember = await this._unauthenticatedClient.getMember(memberId);
            const res = await this._unauthenticatedClient.updateMember(
                updateMember.data.member.id, updateMember.data.member.lastHash,
                [privilegedKey,standardKey,lowKey], signer, [recoveryResponse.data.recoveryEntry]);
            return new Member({
                env: TEST_ENV,
                memberId: res.data.member.id,
                cryptoEngine: cryptoEngine,
                developerKey: devKey,
            });
        });
    }

    /**
     * Completes account recovery.
     *
     * @param memberId - the member id
     * @param memberRecoveryOperation - the member recovery operations
     * @param privilegedKey the privileged public key in the member recovery operations
     * @param cryptoEngine the new crypto engine
     * @return the updated member
     */
    completeRecovery(
        memberId: string, memberRecoveryOperation: Array<Object>,
        privilegedKey: Key, cryptoEngine: Class<KeyStoreCryptoEngine>
    ): Promise<Member> {
        return Util.callAsync(this.completeRecovery, async () => {
            const member = await this._unauthenticatedClient.getMember(memberId);
            const prevHash = member.data.member.lastHash;
            const {ENV: TEST_ENV = 'dev'} = process.env;
            const devKey = require('../../src/config.json').devKey[TEST_ENV];
            const standardKey = await cryptoEngine.generateKey('STANDARD');
            const lowKey = await cryptoEngine.generateKey('LOW');
            const signer = await cryptoEngine.createSignerById(privilegedKey.id);
            const updatedMember = await this._unauthenticatedClient.updateMember(
                memberId, prevHash, [privilegedKey, standardKey, lowKey],
                signer, memberRecoveryOperation);
            return new Member({
                env: TEST_ENV,
                memberId: updatedMember.data.member.id,
                cryptoEngine: cryptoEngine,
                developerKey: devKey,
            });
        });
    }

    /**
     * Retrieves a request for a token. Called by the web (user) or by a TPP to get request details.
     *
     * @param requestId - token request ID
     * @return information about the tokenRequest
     */
    retrieveTokenRequest(
        requestId: string
    ): Promise<?{tokenRequest: TokenRequest, customization?: Object}> {
        return Util.callAsync(this.retrieveTokenRequest, async () => {
            const res = await this._unauthenticatedClient.retrieveTokenRequest(requestId);
            return res.data;
        });
    }

    /**
     * Downloads a blob from the server.
     *
     * @param blobId - ID of the blob
     * @return downloaded blob
     */
    getBlob(blobId: string): Promise<Blob> {
        return Util.callAsync(this.getBlob, async () => {
            const res = await this._unauthenticatedClient.getBlob(blobId);
            return res.data.blob;
        });
    }

    /**
     * Gets the token request result based on its token request ID.
     *
     * @param tokenRequestId - token request ID
     * @return token ID and signature
     */
    getTokenRequestResult(
        tokenRequestId: string
    ): Promise<{tokenId: string, signature: Signature}> {
        return Util.callAsync(this.getTokenRequestResult, async () => {
            const res = await this._unauthenticatedClient.getTokenRequestResult(tokenRequestId);
            return res.data;
        });
    }

    /**
     * Gets directly integrated bank auth URL.
     *
     * @param bankId - ID of the bank
     * @param tokenRequestId - ID of the token request
     * @return url
     */
    getDirectBankAuthUrl(bankId: string, tokenRequestId: string): Promise<string> {
        return Util.callAsync(this.getDirectBankAuthUrl, async () => {
            const res = await this._unauthenticatedClient.getDirectBankAuthUrl(bankId, tokenRequestId);
            return res.data.url;
        });
    }
}

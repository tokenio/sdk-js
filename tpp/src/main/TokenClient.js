// @flow
import {TokenClient as Core} from '@token-io/core';
import config from '../config.json';
import HttpClient from '../http/HttpClient';
import Member from './Member';
import Util from '../Util';
import UnsecuredFileCryptoEngine from '../security/engines/UnsecuredFileCryptoEngine';
import TransferTokenRequestBuilder from './TransferTokenRequestBuilder';
import AccessTokenRequestBuilder from './AccessTokenRequestBuilder';
import StandingOrderTokenRequestBuilder from './StandingOrderTokenRequestBuilder';
import type {
    Alias,
    Key,
    ResourceType,
    AccountResources,
    Signature,
    TokenRequest,
    KeyStoreCryptoEngine,
    TokenRequestTransferDestinationsCallbackParameters,
    TransferEndpoint,
    BulkTransferBodyTransfers,
    RegisterWithEidasPayload,
} from '@token-io/core';
import BulkTransferTokenRequestBuilder from './BulkTransferTokenRequestBuilder';

/**
 * Token SDK entry point.
 */
export class TokenClient extends Core {
    UnsecuredFileCryptoEngine: Class<KeyStoreCryptoEngine>;

    constructor(options: {
        // Token environment to target, defaults to 'prd'
        env?: string,
        // dev key
        developerKey?: string,
        // absolute path of the key storage directory (if using UnsecuredFileCryptoEngine)
        keyDir?: string,
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
        this.options.keyDir = options.keyDir;
        this._unauthenticatedClient = new HttpClient(options);
        this.UnsecuredFileCryptoEngine = UnsecuredFileCryptoEngine;
        options.keyDir && this.UnsecuredFileCryptoEngine.setDirRoot(options.keyDir);
        this.Util = Util;
    }

    /**
     * Creates a business member with a alias and a key pair using the provided engine.
     *
     * @param  alias - alias for the member
     * @param  CryptoEngine - engine to use for key creation and storage
     * @param  realmId - (optional) member id of the Member to which this new member will belong
     * @return Promise of created Member
     */
    createMember(
        alias: ?Alias,
        CryptoEngine: Class<KeyStoreCryptoEngine>,
        realmId?: string
    ): Promise<Member> {
        return super.createMemberCore(alias, CryptoEngine, Member, 'BUSINESS', undefined, realmId);
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
        CryptoEngine: Class<KeyStoreCryptoEngine>,
        memberId: string
    ): Member {
        return super.getMemberCore(CryptoEngine, Member, memberId);
    }

    /**
     * Creates a TokenRequestBuilder for an access token.
     *
     * @param resources - resources to request access of, either an array of either ResourceType or AccountResourceType
     * @return The created TokenRequestBuilder
     */
    createAccessTokenRequest(
        resources: Array<AccountResources> | Array<ResourceType>
    ): AccessTokenRequestBuilder {
        return Util.callSync(this.createAccessTokenRequest, () => {
            let payload;
            if (typeof resources[0] === 'string') {
                payload = {
                    accessBody: {
                        type: resources,
                        resourceTypeList: {
                            resources,
                        },
                    },
                };
            } else {
                payload = {
                    accessBody: {
                        accountResourceList: {
                            resources,
                        },
                    },
                };
            }
            return new AccessTokenRequestBuilder(payload);
        });
    }

    /**
     * Creates a funds confirmation request.
     *
     * @param bankId - bank ID
     * @param account - user's account
     * @param customerData - optional customer data
     * @return The created funds confirmation request builder
     */
    createFundsConfirmationRequest(
        bankId: string,
        account: Object,
        customerData?: Object,
    ): AccessTokenRequestBuilder {
        return Util.callSync(this.createFundsConfirmationRequest, () => {
            const payload = {
                accessBody: {
                    accountResourceList: {
                        resources: [{
                            type: 'ACCOUNT_FUNDS_CONFIRMATION',
                            bankAccount: account,
                            customerData: customerData,
                        }],
                    },
                },
            };
            return new AccessTokenRequestBuilder(payload).setBankId(bankId);
        });
    }

    /**
     * Creates a TokenRequestBuilder for a transfer token.
     *
     * @param lifetimeAmount - lifetime amount of the token
     * @param currency - 3 letter currency code for the amount, e.g. 'USD'
     * @return The created TokenRequestBuilder
     */
    createTransferTokenRequest(
        lifetimeAmount: number | string,
        currency: string
    ): TransferTokenRequestBuilder {
        return Util.callSync(this.createTransferTokenRequest, () => {
            const payload = {
                transferBody: {
                    currency: currency,
                    lifetimeAmount: lifetimeAmount.toString(),
                },
            };
            return new TransferTokenRequestBuilder(payload);
        });
    }

    /**
     * Creates a StandingOrderTokenRequestBuilder for a standing order submission token.
     *
     * @param amount
     * @param currency
     * @param frequency Sets the frequency of the standing order. ISO 20022: DAIL, WEEK, TOWK,
                        MNTH, TOMN, QUTR, SEMI, YEAR
     * @param startDate ISO 8601: YYYY-MM-DD or YYYYMMDD.
     * @param endDate   ISO 8601: YYYY-MM-DD or YYYYMMDD. If not specified, the standing order will occur indefinitely.
     * @returns The created StandingOrderTokenRequestBuilder
     */
    createStandingOrderTokenRequest(
        amount: number | string,
        currency: string,
        frequency: string,
        startDate: string,
        endDate: string,
    ): StandingOrderTokenRequestBuilder {
        return Util.callSync(this.createStandingOrderTokenRequest, () => {
            const payload = {
                standingOrderBody: {
                    amount: amount.toString(),
                    currency,
                    frequency,
                    startDate,
                    endDate,
                    instructions: {
                        transferDestinations: [],
                        metadata: {},
                    },
                },
            };
            return new StandingOrderTokenRequestBuilder(payload);
        });
    }

    /**
     * Creates a createBulkTransferTokenRequestBuilder for a bulk transfer token request.
     *
     * @param transfers List of transfers
     * @param totalAmount Total amount irrespective of currency. Used for redundancy check.
     * @returns Builder instance
     */
    createBulkTransferTokenRequest(
        transfers: Array<BulkTransferBodyTransfers>,
        totalAmount: string | number,
    ): BulkTransferTokenRequestBuilder {
        return Util.callSync(this.createBulkTransferTokenRequest, () => {
            const payload = {
                bulkTransferBody: {
                    transfers,
                    totalAmount: totalAmount.toString(),
                },
            };
            return new BulkTransferTokenRequestBuilder(payload);
        });
    }

    /**
     * Retrieves a request for a token to get request details.
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
     * Completes account recovery if the default recovery rule was set.
     *
     * @param memberId the member id
     * @param verificationId the verification id
     * @param code the code
     * @param cryptoEngine crypto engine
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
     * @param privilegedKey - the privileged public key in the member recovery operations
     * @param cryptoEngine - the new crypto engine
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
     * Generates a token request authorization URL.
     *
     * @param requestId - request ID
     * @return token request URL
     */
    generateTokenRequestUrl(requestId: string): string {
        return Util.callSync(this.generateTokenRequestUrl, () => {
            return `${this.options.customSdkUrl || config.webAppUrls[this.options.env]}/app/request-token/${requestId}`; // eslint-disable-line max-len
        });
    }

    /**
     * Parses the Set Transfer Destinations URL callback parameters to extract supported types, bank and country.
     *
     * @param url - setSetTransferDestinations URL
     * @return TokenRequestTransferDestinationsCallbackParameters - Object
     */
    parseSetTransferDestinationsUrl(url: string): TokenRequestTransferDestinationsCallbackParameters {
        return Util.callSync(this.parseSetTransferDestinationsUrl, () => {
            return Util.parseParamsFromUrl(url);
        });
    }

    /**
     * Parses a token request callback URL and verifies the state and signature.
     * This is used at the end of the redirect flow before redeeming the token.
     *
     * @param callbackUrl - callback URL
     * @param csrfToken - CSRF token
     * @return inner state and token ID
     */
    parseTokenRequestCallbackUrl(
        callbackUrl: string,
        csrfToken?: string
    ): Promise<{tokenId: string, innerState: string}> {
        return Util.callAsync(this.parseTokenRequestCallbackUrl, async () => {
            const urlParams = Util.parseParamsFromUrl(callbackUrl);
            if (urlParams.error) throw new Error(`Error at bank: ${urlParams.error}`);
            return await this.parseTokenRequestCallbackParams(urlParams, csrfToken);
        });
    }

    /**
     * Parses a token request callback object and verifies the state and signature.
     * This is similar to parseTokenRequestCallbackUrl
     * but used in the popup flow instead of redirect.
     *
     * @param callback
     * @param csrfToken
     */
    parseTokenRequestCallbackParams(
        callback: {tokenId: string, signature: string, state: string},
        csrfToken?: string
    ): Promise<{tokenId: string, innerState: string}> {
        return Util.callAsync(this.parseTokenRequestCallbackParams, async () => {
            const tokenMember = await this._unauthenticatedClient.getTokenMember();
            const params = {
                tokenId: callback.tokenId,
                state: JSON.parse(decodeURIComponent(callback.state)),
                signature: JSON.parse(callback.signature),
            };

            if (csrfToken &&
                params.state.csrfTokenHash !== Util.hashString(csrfToken)) {
                throw new Error('Invalid CSRF token');
            }
            const signingKey = Util.getSigningKey(tokenMember.keys, params.signature);
            await this.Crypto.verifyJson(
                {
                    state: callback.state,
                    tokenId: params.tokenId,
                },
                params.signature.signature,
                Util.bufferKey(signingKey.publicKey)
            );
            return {
                tokenId: params.tokenId,
                innerState: params.state.innerState,
            };
        });
    }

    /**
     * Recovers an eIDAS-verified member with eIDAS payload.
     *
     * @param payload a payload containing member id, the certificate and a new key to add to the
     *     member
     * @param signature a payload signature with the private key corresponding to the certificate
     * @param engine a crypto engine that must contain the privileged key that is included in
     *     the payload (if it does not contain keys for other levels they will be generated)
     * @return a new member
     */
    recoverEidasMember(
        payload: EidasRecoveryPayload,
        signature: string,
        engine: KeyStoreCryptoEngine
    ): Promise<Member> {
        const memberId = payload.memberId;
        const devKey = require('../../src/config.json').devKey[TEST_ENV];
        return Util.callAsync(this.recoverEidasMember, async () => {
            const privilegedKey = payload.key;
            const standardKey = await engine.generateKey('STANDARD');
            const lowKey = await engine.generateKey('LOW');
            const keys = [privilegedKey, standardKey, lowKey];
            const signer = await engine.createSignerById(privilegedKey.id);
            const response = await this._unauthenticatedClient.recoverEidasMember(
                payload, signature);
            const memberRes = await this._unauthenticatedClient.getMember(memberId);
            const updateRes = await this._unauthenticatedClient.updateMember(
                memberId, memberRes.data.member.lastHash, keys, signer,
                [response.data.recoveryEntry]);
            return new Member(
                {env: TEST_ENV, memberId: updateRes.data.member.id,
                    realmId: updateRes.data.member.realmId, cryptoEngine: engine,
                    developerKey: devKey});
        });
    }

    /**
     * Creates a business member under realm of a bank with an EIDAS alias (with value equal to the
     * authNumber from the certificate) and a PRIVILEGED-level public key taken from the
     * certificate. Then onboards the member with the provided certificate.
     * A successful onboarding includes verifying the member and the alias and adding permissions
     * based on the certificate.
     *
     * @param payload payload with eidas certificate and bank id
     * @param signature payload signed with private key corresponding to the certificate public key
     * @returns member id, key id and id of the certificate verification request
     */
    registerWithEidas(
        payload: RegisterWithEidasPayload,
        signature: string
    ): Promise<{memberId: memberId, keyId: keyId, verificationId: verificationId}> {
        return Util.callAsync(this.registerWithEidas, async () => {
            const res = await this._unauthenticatedClient.registerWithEidas(payload, signature);
            return res.data;
        });
    }

    /**
     * Gets the token request result based on its token request ID.
     *
     * @param tokenRequestId - token request ID
     * @return token ID, signature, and transfer ID if present
     */
    getTokenRequestResult(
        tokenRequestId: string
    ): Promise<{tokenId: string, signature: Signature, transferId: string}> {
        return Util.callAsync(this.getTokenRequestResult, async () => {
            const res = await this._unauthenticatedClient.getTokenRequestResult(tokenRequestId);
            return res.data;
        });
    }
}

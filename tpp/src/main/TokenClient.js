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
    ResourceType,
    AccountResources,
    Signature,
    TokenRequest,
    KeyStoreCryptoEngine,
    TokenRequestTransferDestinationsCallbackParameters,
    TransferEndpoint,
    BulkTransferBodyTransfers,
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
}

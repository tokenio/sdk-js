// @flow
import {TokenClient as Core} from '@token-io/core';
import config from '../config.json';
import HttpClient from '../http/HttpClient';
import Member from './Member';
import Util from '../Util';
import UnsecuredFileCryptoEngine from '../security/engines/UnsecuredFileCryptoEngine';
import TransferTokenRequestBuilder from './TransferTokenRequestBuilder';
import AccessTokenRequestBuilder from './AccessTokenRequestBuilder';
import type {
    Alias,
    ResourceType,
    Signature,
    TokenRequest,
    KeyStoreCryptoEngine,
} from '@token-io/core';

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
        this.options = options;
        this._unauthenticatedClient = new HttpClient(options);
        this.UnsecuredFileCryptoEngine = UnsecuredFileCryptoEngine;
        options.keyDir && this.UnsecuredFileCryptoEngine.setDirRoot(options.keyDir);
    }

    /**
     * Creates a business member with a alias and a key pair using the provided engine.
     *
     * @param  alias - alias for the member
     * @param  CryptoEngine - engine to use for key creation and storage
     * @return Promise of created Member
     */
    createMember(
        alias: ?Alias,
        CryptoEngine: Class<KeyStoreCryptoEngine>
    ): Promise<Member> {
        return super.createMemberCore(alias, CryptoEngine, Member, 'BUSINESS');
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
     * @param resources - resources to request access of
     * @return The created TokenRequestBuilder
     */
    createAccessTokenRequest(
        resources: Array<ResourceType>
    ): AccessTokenRequestBuilder {
        return Util.callSync(this.createAccessTokenRequest, () => {
            const payload = {
                accessBody: {type: resources},
            };
            return new AccessTokenRequestBuilder(payload);
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
            return await this.processTokenRequestCallback(urlParams, csrfToken);
        });
    }

    /**
     * Processes a token request callback object and verifies the state and signature.
     * This is similar to parseTokenRequestCallbackUrl
     * but used in the popup flow instead of redirect.
     *
     * @param callback
     * @param csrfToken
     */
    processTokenRequestCallback(
        callback: {tokenId: string, signature: string, state: string},
        csrfToken?: string
    ): Promise<{tokenId: string, innerState: string}> {
        return Util.callAsync(this.parseTokenRequestCallbackUrl, async () => {
            const tokenMember = await this._unauthenticatedClient.getTokenMember();
            const params = {
                tokenId: decodeURIComponent(callback.tokenId),
                state: JSON.parse(decodeURIComponent(callback.state)),
                signature: JSON.parse(decodeURIComponent(callback.signature)),
            };

            if (csrfToken &&
                params.state.csrfTokenHash !== Util.hashString(csrfToken)) {
                throw new Error('Invalid CSRF token');
            }
            const signingKey = Util.getSigningKey(tokenMember.keys, params.signature);
            await this.Crypto.verifyJson(
                {
                    state: encodeURIComponent(JSON.stringify(params.state)),
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

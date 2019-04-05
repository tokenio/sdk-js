// @flow
import {Member as CoreMember, Account} from '@token-io/core';
import config from '../config.json';
import Representable from './Representable';
import TokenRequestBuilder from './TokenRequestBuilder';
import AuthHttpClient from '../http/AuthHttpClient';
import HttpClient from '../http/HttpClient';
import Util from '../Util';
import type {
    Blob,
    BlobPayload,
    Profile,
    ProfilePictureSize,
    Token,
    TokenRequest,
    TokenOperationResult,
    Transfer,
    TransferEndpoint,
    KeyStoreCryptoEngine,
} from '@token-io/core';

/**
 * Represents a Token member.
 */
export default class Member extends CoreMember {
    constructor(options: {
        // Token environment to target
        env: string,
        memberId: string,
        // CryptoEngine for the member's keys
        cryptoEngine: Class<KeyStoreCryptoEngine>,
        // dev key
        developerKey?: string,
        // callback to invoke on any cross-cutting RPC
        globalRpcErrorCallback?: ({name: string, message: string}) => void,
        // enable HTTP error logging if true
        loggingEnabled?: boolean,
        // override the default SDK URL
        customSdkUrl?: string,
        // custom HTTP response interceptor for axios
        customResponseInterceptor?: Object,
    }) {
        super(options);
        this._unauthenticatedClient = new HttpClient(options);
        this._client = new AuthHttpClient(options);
    }

    /**
     * Looks up a member's account by ID.
     *
     * @param accountId - accountId
     * @return Promise resolving to the account
     */
    getAccount(accountId: string): Promise<Account> {
        return Util.callAsync(this.getAccount, async () => {
            const res = await this._client.getAccount(accountId);
            return new Account(res.data.account, this);
        });
    }

    /**
     * Looks up the member's accounts.
     *
     * @return Promise resolving to the accounts
     */
    getAccounts(): Promise<Array<Account>> {
        return Util.callAsync(this.getAccounts, async () => {
            const res = await this._client.getAccounts();
            return res.data.accounts && res.data.accounts.map(a => new Account(a, this)) || [];
        });
    }

    /**
     * Creates a representable that acts as another member via an access token.
     *
     * @param accessTokenId - ID of the access token
     * @return new member that acts as another member
     */
    forAccessToken(accessTokenId: string): Representable {
        return Util.callSync(this.forAccessToken, () => {
            const newMember = new Member(this._options);
            newMember._client.useAccessToken(accessTokenId);
            newMember._client.setSecurityMetadata(this._client.getSecurityMetadata());
            return new Representable(newMember);
        });
    }

    /**
     * Replaces the authenticated member's public profile.
     *
     * @param profile - profile to set
     * @return newly-set profile
     */
    setProfile(profile: Profile): Promise<Profile> {
        return Util.callAsync(this.setProfile, async () => {
            const res = await this._client.setProfile(profile);
            return res.data.profile;
        });
    }

    /**
     * Gets a member's public profile.
     *
     * @param id - member ID whose profile to get
     * @return profile
     */
    getProfile(id: string): Promise<Profile> {
        return Util.callAsync(this.getProfile, async () => {
            const res = await this._client.getProfile(id);
            return res.data.profile;
        });
    }

    /**
     * Uploads the authenticated member's public profile.
     *
     * @param type - MIME type
     * @param data - data in bytes, can be base64 string
     * @return empty promise
     */
    setProfilePicture(
        type: string,
        data: ArrayBuffer | string
    ): Promise<void> {
        return Util.callAsync(this.setProfilePicture, async () => {
            await this._client.setProfilePicture(type, data);
        });
    }

    /**
     * Gets a member's public profile picture.
     *
     * @param id - member ID whose picture to get
     * @param size - desired size category SMALL/MEDIUM/LARGE/ORIGINAL
     * @return downloaded blob
     */
    getProfilePicture(
        id: string,
        size: ProfilePictureSize
    ): Promise<Blob> {
        return Util.callAsync(this.getProfilePicture, async () => {
            const res = await this._client.getProfilePicture(id, size);
            return res.data.blob;
        });
    }

    /**
     * Creates a customization.
     *
     * @param logo - logo
     * @param colors - map of ARGB colors #AARRGGBB
     * @param consentText - consent text
     * @param name - display name
     * @param appName - corresponding app name
     * @return customization ID
     */
    createCustomization(
        logo: BlobPayload,
        colors: ?{[string]: string},
        consentText: ?string,
        name: ?string,
        appName: ?string
    ): Promise<string> {
        return Util.callAsync(this.createCustomization, async () => {
            const res = await this._client.createCustomization(
                logo,
                colors,
                consentText,
                name,
                appName);
            return res.data.customizationId;
        });
    }

    /**
     * Stores a request for a token. Called by a merchant or a TPP that wants access from a user.
     *
     * @param tokenRequest - token request to store
     * @return the stored TokenRequestBuilder
     */
    storeTokenRequest(tokenRequest: TokenRequestBuilder): Promise<TokenRequest> {
        return Util.callAsync(this.storeTokenRequest, async () => {
            tokenRequest.requestPayload.callbackState =
                encodeURIComponent(JSON.stringify(tokenRequest.requestPayload.callbackState));
            const res = await this._client.storeTokenRequest(tokenRequest);
            return res.data.tokenRequest;
        });
    }

    /**
     * Looks up a token by its ID.
     *
     * @param tokenId - ID of the token
     * @return token
     */
    getToken(tokenId: string): Promise<Token> {
        return Util.callAsync(this.getToken, async () => {
            const res = await this._client.getToken(tokenId);
            return res.data.token;
        });
    }

    /**
     * Looks up a existing access token where the calling member is the grantor
     * and given member is the grantee.
     *
     * @param toMemberId - beneficiary of the active access token
     * @return access token returned by the server
     */
    getActiveAccessToken(toMemberId: string): Promise<Token> {
        return Util.callAsync(this.getActiveAccessToken, async () => {
            const res = await this._client.getActiveAccessToken(toMemberId);
            return res.data.token;
        });
    }

    /**
     * Looks up all transfer tokens.
     *
     * @param offset - where to start looking
     * @param limit - how many to look for
     * @return returns a list of Transfer Tokens
     */
    getTransferTokens(
        offset: string,
        limit: number
    ): Promise<{tokens: Array<Token>, offset: string}> {
        return Util.callAsync(this.getTransferTokens, async () => {
            const res = await this._client.getTokens('TRANSFER', offset, limit);
            return {
                tokens: res.data.tokens || [],
                offset: res.data.offset,
            };
        });
    }

    /**
     * Looks up all access tokens.
     *
     * @param offset - where to start looking
     * @param limit - how many to look for
     * @return access tokens - returns a list of access tokens
     */
    getAccessTokens(
        offset: string,
        limit: number
    ): Promise<{tokens: Array<Token>, offset: string}> {
        return Util.callAsync(this.getAccessTokens, async () => {
            const res = await this._client.getTokens('ACCESS', offset, limit);
            return {
                tokens: res.data.tokens || [],
                offset: res.data.offset,
            };
        });
    }

    /**
     * Cancels a token.
     *
     * @param token - token to cancel, can be tokenId
     * @return cancelled token
     */
    cancelToken(token: Token | string): Promise<TokenOperationResult> {
        return Util.callAsync(this.cancelToken, async () => {
            const finalToken = await this._resolveToken(token);
            const cancelled = await this._client.cancelToken(finalToken);
            if (typeof token !== 'string') {
                token.payloadSignatures = cancelled.data.result.token.payloadSignatures;
            }
            return cancelled.data.result;
        });
    }

    /**
     * Redeems a token.
     *
     * @param token - token to redeem. Can also be a tokenId
     * @param amount - amount to redeem
     * @param currency - currency to redeem
     * @param description - optional transfer description
     * @param destinations - transfer destinations
     * @param refId - ID that will be set on created Transfer
     *                Token uses this to detect duplicates
     *                caller might use this to recognize the transfer
     *                if param empty, transfer will have random refId
     * @return Transfer created as a result of this redeem call
     */
    redeemToken(
        token: Token | string,
        amount?: number,
        currency?: string,
        description?: string,
        destinations?: Array<TransferEndpoint> = [],
        refId?: string
    ): Promise<Transfer> {
        return Util.callAsync(this.redeemToken, async () => {
            const finalToken = await this._resolveToken(token);
            if (!amount) {
                amount = finalToken.payload.transfer.lifetimeAmount;
            }
            if (!currency) {
                currency = finalToken.payload.transfer.currency;
            }
            if (!description) {
                description = finalToken.payload.description;
            }
            if (Util.countDecimals(amount) > config.decimalPrecision) {
                throw new Error(
                    `Number of decimals in amount should be at most ${config.decimalPrecision}`);
            }
            const res = await this._client.redeemToken(
                finalToken,
                amount,
                currency,
                description,
                destinations,
                refId);
            if (res.data.transfer.status === 'PENDING_EXTERNAL_AUTHORIZATION') {
                const error: Object = new Error('PENDING_EXTERNAL_AUTHORIZATION');
                error.authorizationDetails = res.data.authorizationDetails;
                throw error;
            }
            return res.data.transfer;
        });
    }

    /**
     * Looks up a transfer.
     *
     * @param transferId - ID to look up
     * @return transfer if found
     */
    getTransfer(transferId: string): Promise<Transfer> {
        return Util.callAsync(this.getTransfer, async () => {
            const res = await this._client.getTransfer(transferId);
            return res.data.transfer;
        });
    }

    /**
     * Looks up all of the member's transfers.
     *
     * @param tokenId - token to use for lookup
     * @param offset - where to start looking
     * @param limit - how many to retrieve
     * @return Transfers
     */
    getTransfers(
        tokenId: string,
        offset: string,
        limit: number
    ): Promise<{transfers: Array<Transfer>, offset: string}> {
        return Util.callAsync(this.getTransfers, async () => {
            const res = await this._client.getTransfers(tokenId, offset, limit);
            return {
                transfers: res.data.transfers || [],
                offset: res.data.offset,
            };
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
            const res = await this._client.getBlob(blobId);
            return res.data.blob;
        });
    }

    _resolveToken(token: string | Token): Promise<Token> {
        return new Promise(resolve => {
            if (typeof token === 'string') {
                this.getToken(token)
                    .then(lookedUp => resolve(lookedUp));
            } else {
                // token is already in JSON representation
                resolve(token);
            }
        });
    }
}

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
    StandingOrderSubmission,
    KeyStoreCryptoEngine,
    TransferDestination,
    BulkTransfer,
    VerifyEidasPayload,
    VerifyEidasResponse,
    GetEidasVerificationStatusResponse,
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
     * @param refId - ID that will be set on created Transfer.
     *                Token uses this to detect duplicates.
     *                Caller might use this to recognize the transfer.
     *                If param empty, transfer will have random refId.
     * @return Transfer created as a result of this redeem call
     */
    redeemToken(
        token: Token | string,
        amount?: number,
        currency?: string,
        description?: string,
        destinations?: Array<TransferDestination> = [],
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
            if (!refId) {
                if (amount === finalToken.payload.transfer.lifetimeAmount) {
                    refId = finalToken.payload.refId;
                } else {
                    refId = Util.generateNonce();
                }
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
     * Redeems a standing order token.
     *
     * @param token - token to redeem. Can also be a tokenId
     * @return standing order submission created as a result of this redeem call
     */
    redeemStandingOrderToken(
        tokenId: string,
    ): Promise<StandingOrderSubmission> {
        return Util.callAsync(this.redeemStandingOrderToken, async () => {
            const res = await this._client.redeemStandingOrderToken(tokenId);
            if (res.data.submission.status === 'FAILED') {
                const error: Object = new Error('FAILED');
                error.authorizationDetails = res.data.authorizationDetails;
                throw error;
            }
            return res.data.submission;
        });
    }

    /**
     * Redeems a bulk transfer token.
     *
     * @param tokenId ID of token to redeem
     * @return bulk transfer record
     */
    redeemBulkTransferToken(tokenId: string): Promise<BulkTransfer> {
        return Util.callAsync(this.redeemBulkTransferToken, async () => {
            const res =  await this._client.createBulkTransfer(tokenId);
            return res.data.transfer;
        });
    }

    /**
     * Looks up an existing bulk transfer.
     *
     * @param bulkTransferId
     * @return bulk transfer record
     */
    getBulkTransfer(bulkTransferId: string): Promise<BulkTransfer> {
        return Util.callAsync(this.getBulkTransfer, async () => {
            const res = await this._client.getBulkTransfer(bulkTransferId);
            return res.data.bulkTransfer;
        });
    }

    /**
     * Looks up an existing Token standing order submission.
     *
     * @param submissionId - ID of the standing order submission
     * @return standing order submission
     */
    getStandingOrderSubmission(submissionId: string): Promise<StandingOrderSubmission> {
        return Util.callAsync(this.getStandingOrderSubmission, async () => {
            const res = await this._client.getStandingOrderSubmission(submissionId);
            return res.data.submission;
        });
    }

    /**
     * Looks up existing Token standing order submissions.
     *
     * @param offset - optional where to start looking
     * @param limit - how many to retrieve
     * @return standing order submissions
     */
    getStandingOrderSubmissions(offset: string, limit: string): Promise<{submissions: Array<StandingOrderSubmission>, offset: string}> {
        return Util.callAsync(this.getStandingOrderSubmissions, async () => {
            const res = await this._client.getStandingOrderSubmissions(offset, limit);
            return {
                submissions: res.data.submissions || [],
                offset: res.data.offset,
            };
        });
    }

    /**
     * Sets destination account for once if it hasn't been set.
     *
     * @param tokenRequestId token request Id
     * @param transferDestinations destination account
     * @return observable that completes when request handled
     */
    setTokenRequestTransferDestinations(tokenRequestId: string, transferDestinations: Array<TransferDestination>): Promise<{}> {
        return Util.callAsync(this.setTokenRequestTransferDestinations, async () => {
            return await this._client.setTokenRequestTransferDestinations(tokenRequestId, transferDestinations);
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

    /**
     * Verifies eIDAS alias with an eIDAS certificate, containing auth number equal to the value
     * of the alias. Before making this call make sure that:<ul>
     *     <li>The member is under the realm of a bank (the one tpp tries to gain access to)</li>
     *     <li>An eIDAS-type alias with the value equal to auth number of the TPP is added
     *     to the member</li>
     *     <li>The realmId of the alias is equal to the member's realmId</li>
     *</ul>
     *
     * @param payload - payload containing the member id and the base64 encoded eIDAS certificate
     * @param signature - the payload signed with a private key corresponding to the certificate
     * @return a result of the verification process, including verification status and
     *       verificationId that can be used later to retrieve the status of the verification using
     *       getEidasVerificationStatus call.
     */
    verifyEidas(payload: VerifyEidasPayload, signature: string): Promise<VerifyEidasResponse> {
        return Util.callAsync(this.verifyEidas, async () => {
            const res = await this._client.verifyEidas(payload, signature);
            return res.data;
        });
    }

    /**
     * Retrieves an eIDAS verification status by verificationId.
     *
     * @param verificationId verification id
     * @return a status of the verification operation together with the certificate and alias value
     */
    async getEidasVerificationStatus(verificationId: string): Promise<GetEidasVerificationStatusResponse> {
        return Util.callAsync(this.getEidasVerificationStatus, async () => {
            const res = await this._client.getEidasVerificationStatus(verificationId);
            return res.data;
        });
    }

    /**
     * Get url to bank authorization page for a token request.
     *
     * @param bankId {string} Bank Id
     * @param tokenRequestId {string} Token Request Id
     * @returns {string} url
     */
    getBankAuthUrl(bankId: string, tokenRequestId: string): Promise<string> {
        return Util.callAsync(this.getBankAuthUrl, async () => {
            const res = await this._client.getBankAuthUrl(bankId, tokenRequestId);
            return res.data.url;
        });
    }

    /**
     * Forward the callback from the bank (after user authentication) to Token.
     *
     * @param bankId {string} Bank Id
     * @param query {string} HTTP query string
     * @returns {string} token request ID
     */
    onBankAuthCallback(bankId: string, query: string): Promise<string> {
        return Util.callAsync(this.onBankAuthCallback, async () => {
            const encodedQuery = query && encodeURIComponent(query) || '';
            const res = await this._client.onBankAuthCallback(bankId, encodedQuery);
            return res.data.tokenRequestId;
        });
    }

    /**
     * Get the raw consent from the bank associated with a token.
     *
     * @param tokenId {string} Token Id
     * @returns {string} raw consent
     */
    getRawConsent(tokenId: string): Promise<string> {
        return Util.callAsync(this.getRawConsent, async () => {
            const res = await this._client.getRawConsent(tokenId);
            return res.data.consent;
        });
    }
}

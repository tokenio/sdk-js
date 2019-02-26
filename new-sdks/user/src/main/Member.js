// @flow
import {Member as CoreMember} from '@token-io/core';
import AccessTokenBuilder from './AccessTokenBuilder';
import AuthHttpClient from '../http/AuthHttpClient';
import config from '../config.json';
import HttpClient from '../http/HttpClient';
import TransferTokenBuilder from './TransferTokenBuilder';
import Util from '../Util';
import Account from './Account';
import type {
    Blob,
    Notification,
    BankAuthorization,
    OauthBankAuthorization,
    Profile,
    ProfilePictureSize,
    ReceiptContact,
    Resource,
    Signature,
    Subscriber,
    Token,
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
     * Links bank accounts to the member.
     *
     * @param authorization - bankAuthorization obtained from bank, or
     * oauthBankAuthorization
     * @return Promise resolving the the Accounts linked
     */
    linkAccounts(
        authorization: OauthBankAuthorization | BankAuthorization
    ): Promise<Array<Account>> {
        return Util.callAsync(this.linkAccounts, async () => {
            if (authorization.accessToken) {
                const res = await this._client.linkAccountsOauth(authorization);
                if (res.data.status === 'FAILURE_BANK_AUTHORIZATION_REQUIRED') {
                    throw new Error('Cannot link accounts. Must send bankAuthorization retrieved' +
                        ' through push notification');
                }
                return res.data.accounts && res.data.accounts.map(a => new Account(a, this)) || [];
            }
            const res = await this._client.linkAccounts(authorization);
            return res.data.accounts && res.data.accounts.map(a => new Account(a, this)) || [];
        });
    }

    /**
     * Unlinks bank accounts previously linked by the linkAccounts call.
     *
     * @param accountIds - account IDs to unlink
     * @return empty promise
     */
    unlinkAccounts(accountIds: Array<string>): Promise<void> {
        return Util.callAsync(this.unlinkAccounts, async() => {
            await this._client.unlinkAccounts(accountIds);
        });
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
     * Gets the default bank account.
     *
     * @return the default bank account
     */
    getDefaultAccount(): Promise<?Account> {
        return Util.callAsync(this.getDefaultAccount, async () => {
            const res = await this._client.getDefaultAccount(this.memberId());
            return res.data.account && new Account(res.data.account, this);
        });
    }

    /**
     * Sets the member's default bank account.
     *
     * @param accountId - the bank account ID
     * @return empty promise
     */
    setDefaultAccount(accountId: string): Promise<void> {
        return Util.callAsync(this.setDefaultAccount, async () => {
            await this._client.setDefaultAccount(accountId, this.memberId());
        });
    }

    /**
     * Looks up if this account is default.
     *
     * @param accountId - the bank account ID
     * @return true if the account is default; false otherwise
     */
    isDefaultAccount(accountId: string): Promise<boolean> {
        return Util.callAsync(this.isDefaultAccount, async () => {
            const defaultAcc = await this.getDefaultAccount();
            return defaultAcc && defaultAcc.id === accountId;
        });
    }

    /**
     * Creates a subscriber to receive notifications of member events, such as step up auth,
     * new device requests, linking account requests, or transfer notifications.
     *
     * @param handler - who is handling the notifications
     * @param handlerInstructions - map of strings with delivery options
     * @return Subscriber
     */
    subscribeToNotifications(
        handler: string = 'token',
        handlerInstructions: Object = {}
    ): Promise<Subscriber> {
        return Util.callAsync(this.subscribeToNotifications, async () => {
            const res = await this._client.subscribeToNotifications(handler, handlerInstructions);
            return res.data.subscriber;
        });
    }

    /**
     * Gets a specific subscriber by ID.
     *
     * @param subscriberId - ID of the subscriber
     * @return subscriber
     */
    getSubscriber(subscriberId: string): Promise<Subscriber> {
        return Util.callAsync(this.getSubscriber, async () => {
            const res = await this._client.getSubscriber(subscriberId);
            return res.data.subscriber;
        });
    }

    /**
     * Gets all subscribers for this member.
     *
     * @return subscribers
     */
    getSubscribers(): Promise<Array<Subscriber>> {
        return Util.callAsync(this.getSubscribers, async () => {
            const res = await this._client.getSubscribers();
            return res.data.subscribers || [];
        });
    }

    /**
     * Gets a specific notification by ID.
     *
     * @param notificationId - ID of the notification
     * @return notification
     */
    getNotification(notificationId: string): Promise<Notification> {
        return Util.callAsync(this.getNotification, async () => {
            const res = await this._client.getNotification(notificationId);
            return res.data.notification;
        });
    }

    /**
     * Gets all notifications for this member.
     *
     * @param offset - where to start looking
     * @param limit - how many to look for
     * @return notifications
     */
    getNotifications(
        offset: string,
        limit: number
    ): Promise<{notifications: Array<Notification>, offset: string}>  {
        return Util.callAsync(this.getNotifications, async () => {
            const res = await this._client.getNotifications(offset, limit);
            return res.data;
        });
    }

    /**
     * Unsubscribes a subscriber from notifications.
     *
     * @param subscriberId - subscriber to remove
     * @return empty promise
     */
    unsubscribeFromNotifications(subscriberId: string): Promise<void> {
        return Util.callAsync(this.unsubscribeFromNotifications, async () => {
            await this._client.unsubscribeFromNotifications(subscriberId);
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
     * @param data - data in bytes
     * @return empty promise
     */
    setProfilePicture(
        type: string,
        data: ArrayBuffer
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
     * Replaces member's receipt contact.
     *
     * @param type - receipt contact type, can only be EMAIL currently
     * @param value - receipt contact value for corresponding type
     * @return empty promise
     */
    setReceiptContact(type: 'EMAIL' = 'EMAIL', value: string): Promise<void> {
        return Util.callAsync(this.setReceiptContact, async () => {
            await this._client.setReceiptContact({type, value});
        });
    }

    /**
     * Gets member's receipt contact.
     *
     * @return receipt contact: value + type
     */
    getReceiptContact(): Promise<ReceiptContact> {
        return Util.callAsync(this.getReceiptContact, async () => {
            const res = await this._client.getReceiptContact();
            return res.data.contact;
        });
    }

    /**
     * Creates a new access token builder, that must be executed.
     *
     * @return promise of a created Access Token
     */
    createAccessTokenBuilder(): AccessTokenBuilder {
        return Util.callSync(this.createAccessTokenBuilder, () => {
            const payload = {access: {resources: []}};
            return new AccessTokenBuilder(payload, this._id, this._client);
        });
    }

    /**
     * Creates a transfer token builder, that when executed, will create a transfer token by
     * performing an API call.
     *
     * @param lifetimeAmount - amount limit on the token
     * @param currency - 3 letter currency code ('EUR', 'USD', etc)
     * @return builder for the token
     */
    createTransferTokenBuilder(
        lifetimeAmount: number | string,
        currency: string
    ): TransferTokenBuilder {
        return Util.callSync(this.createTransferTokenBuilder, () => {
            const payload = {
                transfer: {
                    lifetimeAmount: lifetimeAmount.toString(),
                    currency,
                    instructions: {
                        destinations: [],
                        metadata: {},
                    },
                },
            };
            return new TransferTokenBuilder(payload, this._id, this._client);
        });
    }

    /**
     * Cancels the existing token and creates a replacement for it.
     *
     * @param tokenToCancel - the old token to cancel
     * @param newResources - the new resources for this token to grant access to
     * @return the result of the operation
     */
    replaceAccessToken(
        tokenToCancel: Token | string,
        newResources: Array<Resource>
    ): Promise<TokenOperationResult> {
        return Util.callAsync(this.replaceAccessToken, async () => {
            const finalTokenToCancel = await this._resolveToken(tokenToCancel);
            const res = await this._client.replaceToken(
                finalTokenToCancel,
                newResources);
            return res.data.result;
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
     * Looks up a existing access token where the calling member is the grantor and given member is
     * the grantee.
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
            return res.data;
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
            return res.data;
        });
    }

    /**
     * Endorses a token. If this SDK client doesn't have a sufficiently
     * privileged key to endorse the token, this will return
     * MORE_SIGNATURES_NEEDED and the system pushes a notification to
     * the member prompting them to use a higher-privilege key.
     *
     * @param token - token to endorse, can be the token ID as well
     * @return endorsed token
     */
    endorseToken(token: Token | string): Promise<TokenOperationResult> {
        return Util.callAsync(this.endorseToken, async () => {
            const finalToken = await this._resolveToken(token);
            const endorsed = await this._client.endorseToken(finalToken);
            if (typeof token !== 'string') {
                token.payloadSignatures = endorsed.data.result.token.payloadSignatures;
            }
            return endorsed.data.result;
        });
    }

    /**
     * Cancels a token.
     *
     * @param token - token to cancel. Can also be a tokenId
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
     * @param amount - amount to redeemer
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
        amount: ?number,
        currency: ?string,
        description: ?string,
        destinations: Array<TransferEndpoint> = [],
        refId?: string
    ): Promise<Transfer> {
        return Util.callAsync(this.redeemToken, async () => {
            const finalToken = await this._resolveToken(token);
            if (!amount) {
                amount = finalToken && finalToken.payload.transfer.lifetimeAmount;
            }
            if (!currency) {
                currency = finalToken && finalToken.payload.transfer.currency;
            }
            if (!description) {
                description = finalToken && finalToken.payload.description;
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
            return res.data;
        });
    }

    /**
     * Signs with a Token signature a token request state payload.
     *
     * @param tokenRequestId - token request ID
     * @param tokenId - token ID
     * @param state - url state
     * @return response to the api call
     */
    signTokenRequestState(
        tokenRequestId: string,
        tokenId: string,
        state: string
    ): Promise<Signature> {
        return Util.callAsync(this.signTokenRequestState, async () => {
            const res = await this._client.signTokenRequestState(tokenRequestId, tokenId, state);
            return res.data.signature;
        });
    }

    /**
     * Generates a blocking function to cancel a token. (Called by the payer or the redeemer)
     *
     * @param token - token to cancel. Can also be a tokenId
     * @return {Promise<function|undefined>} blocking function to cancel the token
     */
    getBlockingCancelTokenFunction(token: Token | string): Promise<?() => void> {
        return Util.callAsync(this.getBlockingCancelTokenFunction, async () => {
            const finalToken = await this._resolveToken(token);
            const cancelled = await this._client.cancelToken(finalToken, true);
            if (cancelled && cancelled.data &&
                typeof cancelled.data.dispatchRequest === 'function') {
                return cancelled.data.dispatchRequest;
            }
        });
    }

    _resolveToken(token: Token | string): Promise<Token> {
        return new Promise(resolve => {
            if (typeof token === 'string') {
                this.getToken(token)
                    .then(lookedUp => resolve(lookedUp));
            } else {
                resolve(token);
            }
        });
    }
}

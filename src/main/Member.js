// @flow
import AccessTokenBuilder from './AccessTokenBuilder';
import AuthHttpClient from '../http/AuthHttpClient';
import config from '../config.json';
import HttpClient from '../http/HttpClient';
import KeyStoreCryptoEngine from '../security/engines/KeyStoreCryptoEngine';
import Representable from './Representable';
import TokenRequest from './TokenRequest';
import TransferTokenBuilder from './TransferTokenBuilder';
import Util from '../Util';
import {
    Account,
    Address,
    AddressRecord,
    Alias,
    Balance,
    BankInfo,
    Blob,
    Key,
    Notification,
    NotifyStatus,
    OauthBankAuthorization,
    Profile,
    ReceiptContact,
    RecoveryRule,
    RequestStatus,
    Resource,
    Signature,
    Subscriber,
    Token,
    TokenOperationResult,
    TokenSignature,
    Transaction,
    Transfer,
    TransferEndpoint,
    TrustedBeneficiary,
} from '../proto';
import type {
    NotifyStatusEnum,
    RequestStatusEnum,
} from '../proto';

/**
 * Member object. Allows member-wide actions. Some calls return a promise, and some return
 * objects
 */
export default class Member {
    _id: string;
    _client: AuthHttpClient;
    _unauthenticatedClient: HttpClient;
    _options: Object;

    /**
     * Represents a Member
     *
     * @constructor
     * @param {Object} options - see below
     */
    constructor(options: {
        env: string, // Token environment to target
        memberId: string,
        cryptoEngine: KeyStoreCryptoEngine,
        developerKey: ?string, // dev key
        globalRpcErrorCallback: ?({name: string, message: string}) => void, // callback to invoke on any cross-cutting RPC
        loggingEnabled: ?boolean, // enable HTTP error logging if true
        customSdkUrl: ?string, // override the default SDK URL
    }): void {
        const {memberId} = options;
        this._id = memberId;
        this._client = new AuthHttpClient(options);
        this._unauthenticatedClient = new HttpClient(options);
        this._options = options;
    }

    /**
     * Gets the memberId
     *
     * @return {string} memberId
     */
    memberId(): string {
        return this._id;
    }

    /**
     * Gets all of the member's aliases
     *
     * @return {Promise} aliases - member's aliases
     */
    aliases(): Promise<Array<Alias>> {
        return Util.callAsync(this.aliases, async () => {
            const res = await this._client.getAliases();
            return res.data.aliases ?
                res.data.aliases.map(a => Alias.create(a)) :
                [];
        });
    }

    /**
     * Gets the member's first alias
     *
     * @return {Promise} alias - member's alias
     */
    firstAlias(): Promise<?Alias> {
        return Util.callAsync(this.firstAlias, async () => {
            const res = await this._client.getAliases();
            return res.data.aliases && Alias.create(res.data.aliases[0]);
        });
    }

    /**
     * Gets the member's public keys
     *
     * @return {Promise} keys - keys objects
     */
    keys(): Promise<Array<Key>> {
        return Util.callAsync(this.keys, async () => {
            const member = await this._getMember();
            return member.keys ?
                member.keys.map(k => Key.create(k)) :
                [];
        });
    }

    /**
     * Creates a representable that acts as another member via an access token.
     *
     * @param {string} accessTokenId - Id of the access token
     * @return {Representable} representable - new member that acts as another member
     */
    forAccessToken(accessTokenId: string) {
        const newClient = new AuthHttpClient(this._options);
        newClient.useAccessToken(accessTokenId);
        return new Representable(newClient);
    }

    /**
     * Sets the access token id to be used with this client.
     *
     * @deprecated use forAccessToken instead
     * @param {string} accessTokenId - the access token id
     */
    useAccessToken(accessTokenId: string): void {
        this._client.useAccessToken(accessTokenId);
    }

    /**
     * Clears the access token id used with this client.
     *
     * @deprecated use forAccessToken instead
     */
    clearAccessToken(): void {
        this._client.clearAccessToken();
    }

    /**
     * Sets the customer initiated request flag to true.
     */
    setCustomerInitiated(): void {
        this._client.setCustomerInitiated();
    }

    /**
     * Approves a new key for this member
     *
     * @param {Object} key - key to add
     * @return {Promise} empty - empty promise
     */
    approveKey(key: Key): Promise<void> {
        return Util.callAsync(this.approveKey, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.approveKey(prevHash, key.toJSON());
        });
    }

    /**
     * Approves new keys for this member
     *
     * @param {Array} keys - keys to add
     * @return {Promise} empty - empty promise
     */
    approveKeys(keys: Array<Key>): Promise<void> {
        return Util.callAsync(this.approveKeys, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.approveKeys(prevHash, keys.map(k => k.toJSON()));
        });
    }

    /**
     * Removes a key from this member
     *
     * @param {string} keyId - keyId to remove. Note, keyId is the hash of the pk
     * @return {Promise} empty - empty promise
     */
    removeKey(keyId: string): Promise<void> {
        return Util.callAsync(this.removeKey, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeKey(prevHash, keyId);
        });
    }

    /**
     * Removes keys from this member
     *
     * @param {Array} keyIds - keyIds to remove. Note, keyId is the hash of the pk
     * @return {Promise} empty - empty promise
     */
    removeKeys(keyIds: Array<string>): Promise<void> {
        return Util.callAsync(this.removeKeys, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeKeys(prevHash, keyIds);
        });
    }

    /**
     * Adds an alias to this member
     *
     * @param {Object} alias - alias to add
     * @return {Promise} empty - empty promise
     */
    addAlias(alias: Alias): Promise<void> {
        return this.addAliases([alias]);
    }

    /**
     * Adds aliases to this member
     *
     * @param {Array} aliases - aliases to add
     * @return {Promise} empty - empty promise
     */
    addAliases(aliases: Array<Alias>): Promise<void> {
        return Util.callAsync(this.addAliases, async () => {
            const member = await this._getMember();
            const normalized = await Promise.all(aliases.map(alias =>
                this._normalizeAlias(alias, member.partnerId)));
            const prevHash = await this._getPreviousHash();
            await this._client.addAliases(prevHash, normalized);
        });
    }

    /**
     * Removes an alias from the memberId
     *
     * @param {Object} alias - alias to remove
     * @return {Promise} empty - empty promise
     */
    removeAlias(alias: Alias): Promise<void> {
        return Util.callAsync(this.removeAlias, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeAlias(prevHash, alias.toJSON());
        });
    }

    /**
     * Removes aliases from the memberId
     *
     * @param {Array} aliases - aliases to remove
     * @return {Promise} empty - empty promise
     */
    removeAliases(aliases: Array<Alias>): Promise<void> {
        return Util.callAsync(this.removeAliases, async () => {
            const prevHash = await this._getPreviousHash();
            await this._client.removeAliases(prevHash, aliases.map(a => a.toJSON()));
        });
    }

    /**
     * Set the 'normal consumer' rule as member's recovery rule.
     * (As of Nov 2017, this rule was: To recover, verify an alias.)
     * @return {Promise} promise containing RecoveryRule proto buffer.
     */
    useDefaultRecoveryRule(): Promise<RecoveryRule> {
        return Util.callAsync(this.useDefaultRecoveryRule, async () => {
            const agentResponse = await this._client.getDefaultRecoveryAgent();
            const prevHash = await this._getPreviousHash();
            const rule = {
                recoveryRule: {
                    primaryAgent: agentResponse.data.memberId,
                },
            };
            const res = await this._client.addRecoveryRule(prevHash, rule);
            return RecoveryRule.create(res.data.member.recoveryRule);
        });
    }

    /**
     * Links bank accounts to the member
     *
     * @param {string} authorization - bankAuthorization obtained from bank, or
     * oauthBankAuthorization
     * @return {Promise} accounts - Promise resolving the the Accounts linked
     */
    linkAccounts(
        authorization: OauthBankAuthorization | any
    ): Promise<Array<Account>> {
        return Util.callAsync(this.linkAccounts, async () => {
            if (authorization.accessToken) {
                const res = await this._client.linkAccountsOauth(authorization.toJSON());
                if (res.data.status === 'FAILURE_BANK_AUTHORIZATION_REQUIRED') {
                    throw new Error('Cannot link accounts. Must send bankAuthorization retrieved' +
                        ' through push notification');
                }
                return res.data.accounts.map(a => Account.create(a));
            }
            const res = await this._client.linkAccounts(authorization);
            return res.data.accounts ?
                res.data.accounts.map(a => Account.create(a)) :
                [];
        });
    }

    /**
     * Unlinks bank accounts previously linked by the linkAccounts call.
     *
     * @param {Array} accountIds - account ids to unlink
     * @return {Promise} empty - empty promise
     */
    unlinkAccounts(accountIds: Array<string>): Promise<void> {
        return Util.callAsync(this.unlinkAccounts, async() => {
            await this._client.unlinkAccounts(accountIds);
        });
    }

    /**
     * Looks up a member's account by Id
     *
     * @param {string} accountId - accountId
     * @return {Promise} account - Promise resolving to the account
     * @throws error if account not found
     */
    getAccount(accountId: string): Promise<Account> {
        return Util.callAsync(this.getAccount, async () => {
            const res = await this._client.getAccount(accountId);
            return Account.create(res.data.account);
        });
    }

    /**
     * Looks up the member's accounts
     *
     * @return {Promise} accounts - Promise resolving to the accounts
     */
    getAccounts(): Promise<Array<Account>> {
        return Util.callAsync(this.getAccounts, async () => {
            const res = await this._client.getAccounts();
            return res.data.accounts &&
                res.data.accounts.map(a => Account.create(a)) ||
                [];
        });
    }

    /**
     * Gets the default bank account.
     *
     * @return {Promise} the default bank account
     * @throws error if default account not found
     */
    getDefaultAccount(): Promise<Account> {
        return Util.callAsync(this.getDefaultAccount, async () => {
            const res = await this._client.getDefaultAccount(this.memberId());
            return Account.create(res.data.account);
        });
    }

    /**
     * Sets the member's default bank account.
     *
     * @param {string} accountId - the bank account id
     * @return {Promise} empty - empty promise
     */
    setDefaultAccount(accountId: string): Promise<void> {
        return Util.callAsync(this.setDefaultAccount, async () => {
            await this._client.setDefaultAccount(accountId, this.memberId());
        });
    }

    /**
     * Looks up if this account is default.
     *
     * @param {string} accountId - the bank account id
     * @return {Promise} response - true if the account is default; false otherwise
     */
    isDefaultAccount(accountId: string): Promise<boolean> {
        return Util.callAsync(this.isDefaultAccount, async () => {
            return (await this.getDefaultAccount())?.id === accountId;
        });
    }

    /**
     * Gets the info of a bank, including a link for pairing accounts at this bank
     *
     * @param {string} bankId - id of the bank
     * @return {Object} bankInfo - info
     * @throws error if bank not found
     */
    getBankInfo(bankId: string): Promise<BankInfo> {
        return Util.callAsync(this.getBankInfo, async () => {
            const res = await this._client.getBankInfo(bankId);
            return BankInfo.create(res.data.info);
        });
    }

    /**
     * Creates a subscriber to receive notifications of member events, such as step up auth,
     * new device requests, linking account requests, or transfer notifications
     *
     * @param {string} handler - who is handling the notifications
     * @param {Object} handlerInstructions - map of strings with delivery options
     * @return {Promise} subscriber - Subscriber
     */
    subscribeToNotifications(
        handler: string = 'token',
        handlerInstructions: {} = {}
    ): Promise<Subscriber> {
        return Util.callAsync(this.subscribeToNotifications, async () => {
            const res = await this._client.subscribeToNotifications(handler, handlerInstructions);
            return Subscriber.create(res.data.subscriber);
        });
    }

    /**
     * Gets all subscribers for this member
     *
     * @return {Promise} - subscribers
     */
    getSubscribers(): Promise<Array<Subscriber>> {
        return Util.callAsync(this.getSubscribers, async () => {
            const res = await this._client.getSubscribers();
            return res.data.subscribers &&
                res.data.subscribers.map(s => Subscriber.create(s)) ||
                [];
        });
    }

    /**
     * Gets a specific subscriber by Id
     *
     * @param {string} subscriberId - id of the subscriber
     * @return {Promise} - subscriber
     * @throws error if subscriber not found
     */
    getSubscriber(subscriberId: string): Promise<Subscriber> {
        return Util.callAsync(this.getSubscriber, async () => {
            const res = await this._client.getSubscriber(subscriberId);
            return Subscriber.create(res.data.subscriber);
        });
    }

    /**
     * Gets all notifications for this member
     *
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to look for
     * @return {Promise} - notifications
     */
    getNotifications(
        offset: string,
        limit: number
    ): Promise<{data: Array<Notification>, offset: string}>  {
        return Util.callAsync(this.getNotifications, async () => {
            const res = await this._client.getNotifications(offset, limit);
            const data = res.data.notifications &&
                res.data.notifications.map(n => Notification.create(n)) ||
                [];
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Gets a specific notification by Id
     *
     * @param {string} notificationId - id of the notification
     * @return {Promise} - notification
     * @throws error if notification not found
     */
    getNotification(notificationId: string): Promise<Notification> {
        return Util.callAsync(this.getNotification, async () => {
            const res = await this._client.getNotification(notificationId);
            return Notification.create(res.data.notification);
        });
    }

    /**
     * Unsubscribes from notifications (removes a subscriber)
     *
     * @param {string} subscriberId - subscriber to remove
     * @return {Promise} empty - empty promise
     */
    unsubscribeFromNotifications(subscriberId: string): Promise<void> {
        return Util.callAsync(this.unsubscribeFromNotifications, async () => {
            await this._client.unsubscribeFromNotifications(subscriberId);
        });
    }

    /**
     * Triggers a token step up notification on the user's app
     *
     * @param {string} tokenId - token ID
     * @return {Promise} - notification status
     */
    triggerStepUpNotification(tokenId: string): Promise<NotifyStatusEnum> {
        return Util.callAsync(this.triggerStepUpNotification, async () => {
            const res = await this._client.triggerStepUpNotification(tokenId);
            return NotifyStatus[res.data.status];
        });
    }

    /**
     * Triggers a balance step up notification on the user's app
     * @param {Array} accountIds - array of account ids
     * @return {Promise} - notification status
     */
    triggerBalanceStepUpNotification(accountIds: Array<string>): Promise<NotifyStatusEnum> {
        return Util.callAsync(this.triggerBalanceStepUpNotification, async () => {
            const res = await this._client.triggerBalanceStepUpNotification(accountIds);
            return NotifyStatus[res.data.status];
        });
    }

    /**
     * Triggers a transaction step up notification on the user's app
     * @param {String} accountId - account id
     * @param {String} transactionId - transaction id
     * @return {Promise} - notification status
     */
    triggerTransactionStepUpNotification(
        accountId: string,
        transactionId: string
    ): Promise<NotifyStatusEnum> {
        return Util.callAsync(this.triggerTransactionStepUpNotification, async () => {
            const res = await this._client.triggerTransactionStepUpNotification(
                accountId,
                transactionId);
            return NotifyStatus[res.data.status];
        });
    }

    /**
     * Creates an address for this member, and saves it
     *
     * @param {string} name - name of the address (e.g 'Home')
     * @param {object} address - address
     * @return {Promise} promise of AddressRecord structure
     */
    addAddress(name: string, address: Address): Promise<AddressRecord> {
        return Util.callAsync(this.addAddress, async () => {
            const res = await this._client.addAddress(name, address.toJSON());
            return AddressRecord.create(res.data.address);
        });
    }

    /**
     * Gets the member's address
     *
     * @param {string} addressId - the address id
     * @return {Promise} address - AddressRecord structure
     * @throws error if address not found
     */
    getAddress(addressId: string): Promise<AddressRecord> {
        return Util.callAsync(this.getAddress, async () => {
            const res = await this._client.getAddress(addressId);
            return AddressRecord.create(res.data.address);
        });
    }

    /**
     * Gets the member's addresses
     *
     * @return {Promise} addresses - list of AddressRecord structures
     */
    getAddresses(): Promise<Array<AddressRecord>> {
        return Util.callAsync(this.getAddresses, async () => {
            const res = await this._client.getAddresses();
            return res.data.addresses &&
                res.data.addresses.map(a => AddressRecord.create(a)) ||
                [];
        });
    }

    /**
     * Deletes a member's address by id
     *
     * @param {string} addressId - the address id
     * @return {Promise} empty - empty promise
     */
    deleteAddress(addressId: string): Promise<void> {
        return Util.callAsync(this.deleteAddress, async () => {
            await this._client.deleteAddress(addressId);
        });
    }

    /**
     * Replaces the authenticated member's public profile.
     *
     * @param {Object} profile - profile to set
     * @return {Promise} profile - newly-set profile
     */
    setProfile(profile: Profile): Promise<Profile> {
        return Util.callAsync(this.setProfile, async () => {
            const res = await this._client.setProfile(profile.toJSON());
            return Profile.create(res.data.profile);
        });
    }

    /**
     * Gets a member's public profile.
     *
     * @param {string} id - member id whose profile to get
     * @return {Promise} profile - profile
     * @throws error if profile not found
     */
    getProfile(id: string): Promise<Profile> {
        return Util.callAsync(this.getProfile, async () => {
            const res = await this._client.getProfile(id);
            return Profile.create(res.data.profile);
        });
    }

    /**
     * Uploads the authenticated member's public profile.
     *
     * @param {string} type - MIME type
     * @param {Buffer} data - data in bytes
     * @return {Promise} empty - empty promise
     */
    setProfilePicture(
        type: string,
        data: Uint8Array | Array<number>
    ): Promise<void> {
        return Util.callAsync(this.setProfilePicture, async () => {
            await this._client.setProfilePicture(type, data);
        });
    }

    /**
     * Gets a member's public profile picture.
     *
     * @param {string} id - member id whose picture to get
     * @param {Object} size - desired size category SMALL/MEDIUM/LARGE/ORIGINAL
     * @return {Object} blob - downloaded blob
     * @throws error if profile picture not found
     */
    getProfilePicture(
        id: string,
        size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ORIGINAL'
    ): Promise<Blob> {
        return Util.callAsync(this.getProfilePicture, async () => {
            const res = await this._client.getProfilePicture(id, size);
            return Blob.create(res.data.blob);
        });
    }

    /**
     * Replaces member's receipt contact.
     *
     * @param {string} type - receipt contact type, can only be EMAIL currently
     * @param {string} value - receipt contact value for corresponding type
     * @return {Promise} empty - empty promise
     */
    setReceiptContact(type: 'EMAIL' = 'EMAIL', value: string): Promise<void> {
        return Util.callAsync(this.setReceiptContact, async () => {
            await this._client.setReceiptContact({type, value});
        });
    }

    /**
     * Get member's receipt contact.
     *
     * @return {Object} contact - receipt contact: value + type
     * @throws error if receipt contact not found
     */
    getReceiptContact(): Promise<ReceiptContact> {
        return Util.callAsync(this.getReceiptContact, async () => {
            const res = await this._client.getReceiptContact();
            return ReceiptContact.create(res.data.contact);
        });
    }

    /**
     * Adds a Token member to this member's list of trusted beneficiaries.
     *
     * @param {string} memberId - member ID of the trusted beneficiary to add
     * @return {Promise} empty - empty promise
     */
    addTrustedBeneficiary(memberId: string): Promise<void> {
        return Util.callAsync(this.addTrustedBeneficiary, async () => {
            await this._client.addTrustedBeneficiary(memberId);
        });
    }

    /**
     * Removes a Token member from this member's list of trusted beneficiaries.
     *
     * @param {string} memberId - member ID of the trusted beneficiary to remove
     * @return {Promise} empty - empty promise
     */
    removeTrustedBeneficiary(memberId: string): Promise<void> {
        return Util.callAsync(this.removeTrustedBeneficiary, async () => {
            await this._client.removeTrustedBeneficiary(memberId);
        });
    }

    /**
     * Get the member's list of trusted beneficiaries.
     *
     * @returns {Promise} trusted beneficiaries - list of TrustedBeneficiary objects
     */
    getTrustedBeneficiaries(): Promise<Array<TrustedBeneficiary>> {
        return Util.callAsync(this.getTrustedBeneficiaries, async () => {
            const res = await this._client.getTrustedBeneficiaries();
            return res.data.trustedBeneficiaries || [];
        });
    }

    /**
     * Stores a request for a token. Called by a merchant or a TPP that wants access from a user.
     *
     * @param {Object} tokenRequest - token request to store
     * @return {Promise} the stored TokenRequest
     */
    storeTokenRequest(tokenRequest: TokenRequest): Promise<TokenRequest> {
        return Util.callAsync(this.storeTokenRequest, async () => {
            const res = await this._client.storeTokenRequest(tokenRequest);
            return res.data.tokenRequest;
        });
    }

    /**
     * Creates a new unendorsed access token.
     *
     * @param {Object} alias - the alias of the grantee of the Access Token
     * @param {array} resources - a list of resources to give access to
     * @return {Promise} token - promise of a created Access Token
     */
    createAccessToken(alias: Alias, resources: Array<Resource>): Promise<Token> {
        return Util.callAsync(this.createAccessToken, async () => {
            return await (new AccessTokenBuilder(this._client, this, resources.map(r => r.toJSON()))
                .setFromId(this.memberId())
                .setToAlias(alias.toJSON())
                .execute());
        });
    }

    /**
     * Creates a new access token builder, that must be executed.
     *
     * @return {Promise} token - promise of a created Access Token
     */
    createAccessTokenBuilder(): AccessTokenBuilder {
        return Util.callSync(this.createAccessTokenBuilder, () => {
            return new AccessTokenBuilder(this._client, this, []);
        });
    }

    /**
     * Cancels the existing token and creates a replacement for it.
     *
     * @param {Object} tokenToCancel - the old token to cancel
     * @param {Array} newResources - the new resources for this token to grant access to
     * @return {Promise} operationResult - the result of the operation
     */
    replaceAccessToken(
        tokenToCancel: Token | string,
        newResources: Array<Resource>
    ): Promise<TokenOperationResult> {
        return Util.callAsync(this.replaceAccessToken, async () => {
            const finalTokenToCancel = await this._resolveToken(tokenToCancel);
            const res = await this._client.replaceToken(
                finalTokenToCancel.toJSON(),
                newResources.map(r => r.toJSON()));
            return TokenOperationResult.create(res.data.result);
        });
    }

    /**
     * Cancels the existing token, creates a replacement and endorses it.
     *
     * @param {Object} tokenToCancel - the old token to cancel
     * @param {Array} newResources - the new resources for this token to grant access to
     * @return {Promise} operationResult - the result of the operation
     */
    replaceAndEndorseAccessToken(
        tokenToCancel: Token | string,
        newResources: Array<Resource>
    ): Promise<TokenOperationResult> {
        return Util.callAsync(this.replaceAndEndorseAccessToken, async () => {
            const finalTokenToCancel = await this._resolveToken(tokenToCancel);
            const res = await this._client.replaceAndEndorseToken(
                finalTokenToCancel.toJSON(),
                newResources.map(r => r.toJSON()));
            return TokenOperationResult.create(res.data.result);
        });
    }

    /**
     * @deprecated - use createTransferTokenBuilder instead
     * Creates a transfer token builder, that when executed, will create a transfer token by
     * performing an API call.
     *
     * @param {double} lifetimeAmount - amount limit on the token
     * @param {string} currency - 3 letter currency code ('EUR', 'USD', etc)
     * @return {TransferTokenBuilder} builder - builder for the token
     */
    createTransferToken(
        lifetimeAmount: number,
        currency: string
    ): TransferTokenBuilder {
        return Util.callSync(this.createTransferToken, () => {
            return new TransferTokenBuilder(this._client, this, lifetimeAmount, currency)
                .setFromId(this.memberId());
        });
    }

    /**
     * Creates a transfer token builder, that when executed, will create a transfer token by
     * performing an API call.
     *
     * @param {double} lifetimeAmount - amount limit on the token
     * @param {string} currency - 3 letter currency code ('EUR', 'USD', etc)
     * @return {TransferTokenBuilder} builder - builder for the token
     */
    createTransferTokenBuilder(
        lifetimeAmount: number,
        currency: string
    ): TransferTokenBuilder {
        return Util.callSync(this.createTransferTokenBuilder, () => {
            return new TransferTokenBuilder(this._client, this, lifetimeAmount, currency);
        });
    }

    /**
     * Looks up a token by its Id
     *
     * @param {string} tokenId - id of the token
     * @return {Promise} token - token
     * @throws error if token not found
     */
    getToken(tokenId: string): Promise<Token> {
        return Util.callAsync(this.getToken, async () => {
            const res = await this._client.getToken(tokenId);
            return Token.create(res.data.token);
        });
    }

    /**
     * Looks up a existing access token where the calling member is the grantor and given member is
     * the grantee.
     *
     * @param {string} toMemberId - beneficiary of the active access token
     * @return {Promise} token - access token returned by the server
     */
    getActiveAccessToken(toMemberId: string): Promise<Token> {
        return Util.callAsync(this.getActiveAccessToken, async () => {
            const res = await this._client.getActiveAccessToken(toMemberId);
            return Token.create(res.data.token);
        });
    }

    /**
     * Looks up all transfer tokens
     *
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to look for
     * @return {Promise} tokens - returns a list of Transfer Tokens
     */
    getTransferTokens(
        offset: string,
        limit: number
    ): Promise<{data: Array<Token>, offset: string}> {
        return Util.callAsync(this.getTransferTokens, async () => {
            const res = await this._client.getTokens('TRANSFER', offset, limit);
            const data = res.data.tokens &&
                res.data.tokens.map(t => Token.create(t)) ||
                [];
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Looks up all access tokens
     *
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to look for
     * @return {Promise} access tokens - returns a list of access tokens
     */
    getAccessTokens(
        offset: string,
        limit: number
    ): Promise<{data: Array<Token>, offset: string}> {
        return Util.callAsync(this.getAccessTokens, async () => {
            const res = await this._client.getTokens('ACCESS', offset, limit);
            const data = res.data.tokens &&
                res.data.tokens.map(t => Token.create(t)) ||
                [];
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Endorses a token. If this SDK client doesn't have a sufficiently
     * privileged key to endorse the token, this will return
     * MORE_SIGNATURES_NEEDED and the system pushes a notification to
     * the member prompting them to use a higher-privilege key.
     *
     * @param {Token} token - Transfer token to endorse. Can also be a {string} tokenId
     * @return {Promise} TokenOperationResult - endorsed token
     */
    endorseToken(token: Token | string): Promise<TokenOperationResult> {
        return Util.callAsync(this.endorseToken, async () => {
            let finalToken = await this._resolveToken(token);
            finalToken = finalToken.toJSON();
            const endorsed = await this._client.endorseToken(finalToken);
            if (typeof token !== 'string') {
                token.payloadSignatures = endorsed.data.result.token.payloadSignatures
                    .map(s => TokenSignature.create(s));
            }
            return TokenOperationResult.create(endorsed.data.result);
        });
    }

    /**
     * Cancels a token. (Called by the payer or the redeemer)
     *
     * @param {Token} token - token to cancel. Can also be a {string} tokenId
     * @return {Promise} TokenOperationResult - cancelled token
     */
    cancelToken(token: Token | string): Promise<TokenOperationResult> {
        return Util.callAsync(this.cancelToken, async () => {
            let finalToken = await this._resolveToken(token);
            finalToken = finalToken.toJSON();
            const cancelled = await this._client.cancelToken(finalToken);
            if (typeof token !== 'string') {
                token.payloadSignatures = cancelled.data.result.token.payloadSignatures
                    .map(s => TokenSignature.create(s));
            }
            return TokenOperationResult.create(cancelled.data.result);
        });
    }

    /**
     * Generates a blocking function to cancel a token. (Called by the payer or the redeemer)
     *
     * @param {Token} token - token to cancel. Can also be a {string} tokenId
     * @return {Function} blocking function to cancel the token
     */
    getBlockingCancelTokenFunction(token: Token | string): Promise<?() => void> {
        return Util.callAsync(this.getBlockingCancelTokenFunction, async () => {
            const finalToken = await this._resolveToken(token);
            const cancelled = await this._client.cancelToken(finalToken.toJSON(), true);
            if (cancelled && cancelled.data &&
              typeof cancelled.data.dispatchRequest === 'function') {
                return cancelled.data.dispatchRequest;
            }
        });
    }

    /**
     * Redeems a token. (Called by the payee or redeemer)
     *
     * @param {object} token - token to redeem. Can also be a {string} tokenId
     * @param {int} amount - amount to redeemer
     * @param {string} currency - currency to redeem
     * @param {string} description - optional transfer description
     * @param {Array} destinations - transfer destinations
     * @param {string} refId - Id that will be set on created Transfer.
     *                         Token uses this to detect duplicates.
     *                         Caller might use this to recognize the transfer.
     *                         If param empty, transfer will have random refId.
     * @return {Promise} transfer - Transfer created as a result of this redeem call
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
            let finalToken = await this._resolveToken(token);
            finalToken = finalToken.toJSON();
            if (amount === undefined) {
                amount = finalToken?.payload.transfer.lifetimeAmount;
            }
            if (currency === undefined) {
                currency = finalToken?.payload.transfer.currency;
            }
            if (description === undefined) {
                description = finalToken?.payload.description;
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
                destinations.map(d => d.toJSON()),
                refId);

            if (res.data.transfer.status === 'PENDING_EXTERNAL_AUTHORIZATION') {
                const error: any = new Error('PENDING_EXTERNAL_AUTHORIZATION');
                error.authorizationDetails = res.data.authorizationDetails;
                throw error;
            }
            return Transfer.create(res.data.transfer);
        });
    }

    /**
     * Looks up a transfer
     *
     * @param {string} transferId - id to look up
     * @return {Promise} transfer - transfer if found
     * @throws error if transfer not found
     */
    getTransfer(transferId: string): Promise<Transfer> {
        return Util.callAsync(this.getTransfer, async () => {
            const res = await this._client.getTransfer(transferId);
            return Transfer.create(res.data.transfer);
        });
    }

    /**
     * Looks up all of the member's transfers
     *
     * @param {string} tokenId - token to use for lookup
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to retrieve
     * @return {Promise} transfers - Transfers
     */
    getTransfers(
        tokenId: string,
        offset: string,
        limit: number
    ): Promise<{data: Array<Transfer>, offset: string}> {
        return Util.callAsync(this.getTransfers, async () => {
            const res = await this._client.getTransfers(tokenId, offset, limit);
            const data = res.data.transfers &&
                res.data.transfers.map(t => Transfer.create(t)) ||
                [];
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Looks up the balance of an account
     *
     * @param {string} accountId - id of the account
     * @param {string} keyLevel - key level
     * @return {Promise} balance - Promise of get balance response object
     */
    getBalance(
        accountId: string,
        keyLevel: string
    ): Promise<{balance: Balance, status: RequestStatusEnum}> {
        return Util.callAsync(this.getBalance, async () => {
            const res = await this._client.getBalance(accountId, keyLevel);
            return {
                balance: Balance.create(res.data.balance),
                status: RequestStatus[res.data.status],
            };
        });
    }

    /**
     * Looks up the balances of an array of accounts
     *
     * @param {Array} accountIds - array of account ids
     * @param {string} keyLevel - key level
     * @return {Promise} balance - Promise of get balances response object
     */
    getBalances(
        accountIds: Array<string>,
        keyLevel: string
    ): Promise<Array<{balance: Balance, status: RequestStatusEnum}>> {
        return Util.callAsync(this.getBalances, async () => {
            const res = await this._client.getBalances(accountIds, keyLevel);
            res.data.response = res.data.response && res.data.response.map(b => ({
                balance: Balance.create(b.balance),
                status: RequestStatus[b.status],
            }));
            return res.data.response || [];
        });
    }

    /**
     * Looks up a transaction
     *
     * @param {string} accountId - id of the account
     * @param {string} transactionId - which transaction to look up
     * @param {string} keyLevel - key level
     * @return {Promise} transaction - the Transaction
     * @throws error if transaction not found
     */
    getTransaction(
        accountId: string,
        transactionId: string,
        keyLevel: string
    ): Promise<Transaction> {
        return Util.callAsync(this.getTransaction, async () => {
            const res = await this._client.getTransaction(accountId, transactionId, keyLevel);
            return Transaction.create(res.data.transaction);
        });
    }

    /**
     * Looks up all of the member's transactions for an account
     *
     * @param {string} accountId - id of the account
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to retrieve
     * @param {string} keyLevel - key level
     * @return {Promise} transactions - Transactions
     */
    getTransactions(
        accountId: string,
        offset: string,
        limit: number,
        keyLevel: string
    ): Promise<{data: Array<Transaction>, offset: string}> {
        return Util.callAsync(this.getTransactions, async () => {
            const res = await this._client.getTransactions(accountId, offset, limit, keyLevel);
            const data = res.data.transactions &&
                res.data.transactions.map(t => Transaction.create(t)) ||
                [];
            return {
                data,
                offset: res.data.offset,
            };
        });
    }

    /**
     * Uploads a blob to the server.
     *
     * @param {string} ownerId - owner of the blob
     * @param {string} type - MIME type
     * @param {string} name - name of the file
     * @param {Buffer} data - data in bytes
     * @return {Object} attachment - attachment
     */
    createBlob(
        ownerId: string,
        type: string,
        name: string,
        data: Uint8Array | Array<number>
    ): Promise<{blobId: string, type: string, name: string}> {
        return Util.callAsync(this.createBlob, async () => {
            const res = await this._client.createBlob(ownerId, type, name, data);
            return {
                blobId: res.data.blobId,
                type,
                name,
            };
        });
    }

    /**
     * Downloads a blob from the server.
     *
     * @param {string} blobId - id of the blob
     * @return {Object} blob - downloaded blob
     * @throws error if blob not found
     */
    getBlob(blobId: string): Promise<Blob> {
        return Util.callAsync(this.getBlob, async () => {
            const res = await this._client.getBlob(blobId);
            return Blob.create(res.data.blob);
        });
    }

    /**
     * Downloads a blob from the server, that is attached to a token.
     *
     * @param {string} tokenId - id of the token
     * @param {string} blobId - id of the blob
     * @return {Object} blob - downloaded blob
     * @throws error if token blob not found
     */
    getTokenBlob(
        tokenId: string,
        blobId: string
    ): Promise<Blob> {
        return Util.callAsync(this.getTokenBlob, async () => {
            const res = await this._client.getTokenBlob(tokenId, blobId);
            return Blob.create(res.data.blob);
        });
    }

    /**
     * Sign with a Token signature a token request state payload.
     *
     * @param {string} tokenRequestId - token request id
     * @param {string} tokenId - token id
     * @param {string} state - url state
     * @return {Object} response - response to the api call
     */
    signTokenRequestState(
        tokenRequestId: string,
        tokenId: string,
        state: string
    ): Promise<Signature> {
        return Util.callAsync(this.signTokenRequestState, async () => {
            const res = await this._client.signTokenRequestState(tokenRequestId, tokenId, state);
            return Signature.create(res.data.signature);
        });
    }

    /**
     * Deletes the member.
     *
     * @return {Object} response - response to the api call
     */
    deleteMember(): Promise<void> {
        return Util.callAsync(this.deleteMember, async () => {
            await this._client.deleteMember();
        });
    }

    /**
     * Verifies and affiliated TPP.
     *
     * @param memberId - id of the member to verify
     * @return {Promise} empty - empty promise
     */
    verifyAffiliate(memberId: string): Promise<void> {
        return Util.callAsync(this.verifyAffiliate, async () => {
            await this._client.verifyAffiliate(memberId);
        });
    }

    /**
     * Resolves transfer destinations for the given account ID.
     *
     * @param {string} accountId - id of account to resolve destinations for
     * @returns {Promise} response - resolved transfer endpoints
     */
    resolveTransferDestinations(accountId: string): Promise<TransferEndpoint[]> {
        return Util.callAsync(this.resolveTransferDestinations, async () => {
            await this._client.resolveTransferDestinations(accountId);
        });
    }

    /**
     * Creates a test bank account in a fake bank
     *
     * @deprecated - use createTestBankAccountOauth
     * @param {double} balance - balance of the account
     * @param {string} currency - currency of the account
     * @return {Array} bank authorization to use with linkAccounts
     */
    createTestBankAccount(
        balance: number,
        currency: string
    ): Promise<Array<any>> {
        return Util.callAsync(this.createTestBankAccount, async () => {
            const res = await this._client.createTestBankAccount(balance, currency);
            return res.data.bankAuthorization;
        });
    }

    /**
     * Creates a test bank account in a fake bank
     *
     * @param {double} balance - balance of the account
     * @param {string} currency - currency of the account
     * @return {Array} bank authorization to use with linkAccounts
     */
    createTestBankAccountOauth(
        balance: number,
        currency: string
    ): Promise<OauthBankAuthorization> {
        return Util.callAsync(this.createTestBankAccountOauth, async () => {
            const res = await this._client.createTestBankAccount(balance, currency);
            return OauthBankAuthorization.create(res.data.authorization);
        });
    }
    /**
     * Gets test bank notification.
     *
     * @param {string} subscriberId - id of subscriber
     * @param {string} notificationId - id of notification
     * @return {Object} response - response to the API call
     */
    getTestBankNotification(
        subscriberId: string,
        notificationId: string
    ): Promise<Notification> {
        return Util.callAsync(this.getTestBankNotification, async () => {
            const res = await this._client.getTestBankNotification(subscriberId, notificationId);
            return Notification.create(res.data.notification);
        });
    }

    /**
     * Gets test bank notifications.
     *
     * @param {string} subscriberId - id of subscriber
     * @return {Object} response - response to the API call
     */
    getTestBankNotifications(subscriberId: string): Promise<Array<Notification>> {
        return Util.callAsync(this.getTestBankNotifications, async () => {
            const res = await this._client.getTestBankNotifications(subscriberId);
            return res.data.notifications ?
                res.data.notifications.map(n => Notification.create(n)) :
                [];
        });
    }

    _getPreviousHash() {
        return Util.callAsync(this._getPreviousHash, async () => {
            const member = await this._getMember();
            return member.lastHash;
        });
    }

    _getMember() {
        return Util.callAsync(this._getMember, async () => {
            const res = await this._unauthenticatedClient.getMember(this._id);
            return res.data.member;
        });
    }

    _resolveToken(token: string | Token): Promise<any> {
        return new Promise((resolve) => {
            if (typeof token === 'string') {
                this.getToken(token)
                    .then(lookedUp => resolve(lookedUp));
            } else {
                resolve(token);       // Token, already in json representation
            }
        });
    }

    _normalizeAlias(alias: Alias, partnerId: string): Promise<Alias> {
        return Util.callAsync(this._normalizeAlias, async () => {
            const normalized =
                (await this._unauthenticatedClient.normalizeAlias(alias.toJSON())).data.alias;

            if (partnerId && partnerId !== 'token') {
                // Realm must equal member's partner ID if affiliated
                if (normalized.realm && normalized.realm !== partnerId) {
                    throw new Error('Alias realm must equal partner ID: ' + partnerId);
                }
                normalized.realm = partnerId;
            }
            return normalized;
        });
    }
}

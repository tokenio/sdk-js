// @flow
import AuthHttpClient from '../http/AuthHttpClient';
import HttpClient from '../http/HttpClient';
import KeyStoreCryptoEngine from '../security/engines/KeyStoreCryptoEngine';
import Util from '../Util';
import Account from './Account';
import type {
    Alias,
    Balance,
    BankInfo,
    Key,
    KeyLevel,
    OauthBankAuthorization,
    RecoveryRule,
    SecurityMetadata,
    Transaction,
    Notification,
    Signature,
    TransferDestination,
    StandingOrder,
} from '..';

/**
 * Represents a Token member.
 */
export class Member {
    _id: string;
    _client: AuthHttpClient;
    _unauthenticatedClient: HttpClient;
    _options: Object;

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
        const {memberId} = options;
        this._id = memberId;
        this._options = options;
    }

    /**
     * Gets the member ID.
     *
     * @return the member ID
     */
    memberId(): string {
        return this._id;
    }

    /**
     * Gets the member's last hash.
     *
     * @return the hash of the member object
     */
    lastHash(): string {
        return Util.callAsync(this.lastHash, async () => {
            const member = await this._getMember();
            return member.lastHash;
        });
    }

    /**
     * Gets all of the member's aliases.
     *
     * @return the member's aliases
     */
    aliases(): Promise<Array<Alias>> {
        return Util.callAsync(this.aliases, async () => {
            const res = await this._client.getAliases();
            return res.data.aliases || [];
        });
    }

    /**
     * Gets the member's first alias.
     *
     * @return the member's first alias
     */
    firstAlias(): Promise<?Alias> {
        return Util.callAsync(this.firstAlias, async () => {
            const res = await this._client.getAliases();
            return res.data.aliases && res.data.aliases[0];
        });
    }

    /**
     * Gets the member's public keys.
     *
     * @return keys objects
     */
    keys(): Promise<Array<Key>> {
        return Util.callAsync(this.keys, async () => {
            const member = await this._getMember();
            return member.keys || [];
        });
    }

    /**
     * Sets the security metadata to be sent with each request.
     *
     * @param securityMetadata
     */
    setSecurityMetadata(securityMetadata: SecurityMetadata): void {
        return Util.callSync(this.setSecurityMetadata, () => {
            this._client.setSecurityMetadata(securityMetadata);
        });
    }

    /**
     * Clears the security metadata.
     */
    clearSecurityMetadata(): void {
        return Util.callSync(this.clearSecurityMetadata, () => {
            this._client.clearSecurityMetadata();
        });
    }

    /**
     * Approves a new key for this member.
     *
     * @param key - key to add
     * @return empty promise
     */
    approveKey(key: Key): Promise<void> {
        return Util.callAsync(this.approveKey, async () => {
            const prevHash = await this.lastHash();
            await this._client.approveKey(prevHash, key);
        });
    }

    /**
     * Approves new keys for this member.
     *
     * @param keys - keys to add
     * @return empty promise
     */
    approveKeys(keys: Array<Key>): Promise<void> {
        return Util.callAsync(this.approveKeys, async () => {
            const prevHash = await this.lastHash();
            await this._client.approveKeys(prevHash, keys);
        });
    }

    /**
     * Removes a key from this member.
     *
     * @param keyId - keyId to remove. Note, keyId is the hash of the pk
     * @return empty promise
     */
    removeKey(keyId: string): Promise<void> {
        return Util.callAsync(this.removeKey, async () => {
            const prevHash = await this.lastHash();
            await this._client.removeKey(prevHash, keyId);
        });
    }

    /**
     * Removes keys from this member.
     *
     * @param keyIds - keyIds to remove. Note, keyId is the hash of the pk
     * @return empty promise
     */
    removeKeys(keyIds: Array<string>): Promise<void> {
        return Util.callAsync(this.removeKeys, async () => {
            const prevHash = await this.lastHash();
            await this._client.removeKeys(prevHash, keyIds);
        });
    }

    /**
     * Adds an alias to this member.
     *
     * @param alias - alias to add
     * @return empty promise
     */
    addAlias(alias: Alias): Promise<void> {
        return this.addAliases([alias]);
    }

    /**
     * Adds aliases to this member.
     *
     * @param aliases - aliases to add
     * @return empty promise
     */
    addAliases(aliases: Array<Alias>): Promise<void> {
        return Util.callAsync(this.addAliases, async () => {
            const member = await this._getMember();
            const normalized = await Promise.all(aliases.map(alias =>
                this._normalizeAlias(alias, member.partnerId)));
            const prevHash = await this.lastHash();
            await this._client.addAliases(prevHash, normalized);
        });
    }

    /**
     * Removes an alias from the member.
     *
     * @param alias - alias to remove
     * @return empty promise
     */
    removeAlias(alias: Alias): Promise<void> {
        return Util.callAsync(this.removeAlias, async () => {
            const prevHash = await this.lastHash();
            await this._client.removeAlias(prevHash, alias);
        });
    }

    /**
     * Removes aliases from the member.
     *
     * @param aliases - aliases to remove
     * @return empty promise
     */
    removeAliases(aliases: Array<Alias>): Promise<void> {
        return Util.callAsync(this.removeAliases, async () => {
            const prevHash = await this.lastHash();
            await this._client.removeAliases(prevHash, aliases);
        });
    }

    /**
     * Set the 'normal consumer' rule as member's recovery rule.
     * (As of Nov 2017, this rule was: To recover, verify an alias.)
     *
     * @return promise containing RecoveryRule proto buffer.
     */
    useDefaultRecoveryRule(): Promise<RecoveryRule> {
        return Util.callAsync(this.useDefaultRecoveryRule, async () => {
            const agentResponse = await this._client.getDefaultRecoveryAgent();
            const prevHash = await this.lastHash();
            const rule = {
                recoveryRule: {
                    primaryAgent: agentResponse.data.memberId,
                },
            };
            const res = await this._client.addRecoveryRule(prevHash, rule);
            return res.data.member.recoveryRule;
        });
    }

    /**
     * Gets the info of a bank, including a link for pairing accounts at this bank.
     *
     * @param bankId - ID of the bank
     * @return info
     */
    getBankInfo(bankId: string): Promise<BankInfo> {
        return Util.callAsync(this.getBankInfo, async () => {
            const res = await this._client.getBankInfo(bankId);
            return res.data.info;
        });
    }

    /**
     * Looks up the balance of an account.
     *
     * @param accountId - ID of the account
     * @param keyLevel - key level
     * @return Promise of get balance response object
     */
    getBalance(
        accountId: string,
        keyLevel: KeyLevel
    ): Promise<Balance> {
        return Util.callAsync(this.getBalance, async () => {
            const res = await this._client.getBalance(accountId, keyLevel);
            switch (res.data.status){
            case 'SUCCESSFUL_REQUEST':
                return res.data.balance;
            case 'MORE_SIGNATURES_NEEDED':
                throw new Error('Balance step up required');
            default:
                throw new Error(res.data.status);
            }
        });
    }

    /**
     * Looks up the balances of an array of accounts.
     *
     * @param accountIds - array of account IDs
     * @param keyLevel - key level
     * @return Promise of get balances response object
     */
    getBalances(
        accountIds: Array<string>,
        keyLevel: KeyLevel
    ): Promise<Array<Balance>> {
        return Util.callAsync(this.getBalances, async () => {
            const res = await this._client.getBalances(accountIds, keyLevel);
            return res.data.response && res.data.response.map(b => {
                switch (b.status) {
                case 'SUCCESSFUL_REQUEST':
                    return b.balance;
                case 'MORE_SIGNATURES_NEEDED':
                    throw new Error('Balance step up required');
                default:
                    throw new Error(b.status);
                }
            });
        });
    }

    /**
     * Looks up a transaction.
     *
     * @param accountId - ID of the account
     * @param transactionId - which transaction to look up
     * @param keyLevel - key level
     * @return the Transaction
     */
    getTransaction(
        accountId: string,
        transactionId: string,
        keyLevel: KeyLevel
    ): Promise<Transaction> {
        return Util.callAsync(this.getTransaction, async () => {
            const res = await this._client.getTransaction(accountId, transactionId, keyLevel);
            switch (res.data.status){
            case 'SUCCESSFUL_REQUEST':
                return res.data.transaction;
            case 'MORE_SIGNATURES_NEEDED':
                throw new Error('Transaction step up required');
            default:
                throw new Error(res.data.status);
            }
        });
    }

    /**
     * Looks up all of the member's transactions for an account.
     *
     * @param accountId - ID of the account
     * @param offset - where to start looking
     * @param limit - how many to retrieve
     * @param keyLevel - key level
     * @return Transactions
     */
    getTransactions(
        accountId: string,
        offset: string,
        limit: number,
        keyLevel: KeyLevel,
        startDate: string,
        endDate: string
    ): Promise<{transactions: Array<Transaction>, offset: string}> {
        return Util.callAsync(this.getTransactions, async () => {
            const res = await this._client.getTransactions(accountId, offset, limit, keyLevel, startDate, endDate);
            switch (res.data.status){
            case 'SUCCESSFUL_REQUEST':
                return {
                    transactions: res.data.transactions || [],
                    offset: res.data.offset,
                };
            case 'MORE_SIGNATURES_NEEDED':
                throw new Error('Transactions step up required');
            default:
                throw new Error(res.data.status);
            }
        });
    }

    /**
     * Confirms if an account has sufficient funds for a purchase.
     *
     * @param accountId
     * @param amount
     * @param currency
     * @return true if account has sufficient funds
     */
    confirmFunds(
        accountId: string,
        amount: number | string,
        currency: string
    ): Promise<boolean> {
        return Util.callAsync(this.confirmFunds, async () => {
            const res = await this._client.confirmFunds(accountId, amount, currency);
            return res.data.fundsAvailable;
        });
    }

    /**
     * Signs a token payload with specified level of keys.
     *
     * @param tokenPayload
     * @param keyLevel
     * @returns the proto signature
     */
    signTokenPayload(
        tokenPayload: Object,
        keyLevel: KeyLevel,
    ): Promise<Signature> {
        return Util.callAsync(this.signTokenPayload, async () => {
            return await this._client.tokenOperationSignature(tokenPayload, 'endorsed', keyLevel);
        });
    }

    /**
     * Deletes the member.
     *
     * @return response to the api call
     */
    deleteMember(): Promise<void> {
        return Util.callAsync(this.deleteMember, async () => {
            await this._client.deleteMember();
        });
    }

    /**
     * Resolves transfer destinations for the given account ID.
     *
     * @param accountId - ID of account to resolve destinations for
     * @return resolved transfer destinations
     */
    resolveTransferDestinations(accountId: string): Promise<TransferDestination> {
        return Util.callAsync(this.resolveTransferDestinations, async () => {
            const res = await this._client.resolveTransferDestinations(accountId);
            return res.transferDestinations;
        });
    }

    /**
     * Creates a test bank account in a fake bank
     *
     * @param balance - balance of the account
     * @param currency - currency of the account
     * @return bank authorization to use with linkAccounts
     */
    createTestBankAccount(
        balance: number,
        currency: string
    ): Promise<OauthBankAuthorization> {
        return Util.callAsync(this.createTestBankAccount, async () => {
            const res = await this._client.createTestBankAccount(balance, currency);
            return res.data.authorization;
        });
    }

    /**
     * Creates a test bank account in a fake bank and link it
     *
     * @param balance - balance of the account
     * @param currency - currency of the account
     * @return bank authorization to use with linkAccounts
     */
    createAndLinkTestBankAccount(
        balance: number,
        currency: string
    ): Promise<Account> {
        return Util.callAsync(this.createTestBankAccount, async () => {
            const res = await this._client.createTestBankAccount(balance, currency);
            const res2 = await this._client.linkAccountsOauth(res.data.authorization);
            return res2.data.accounts && new Account(res2.data.accounts[0], this);
        });
    }

    /**
     * Gets test bank notification.
     *
     * @param subscriberId - ID of subscriber
     * @param notificationId - ID of notification
     * @return response to the API call
     */
    getTestBankNotification(
        subscriberId: string,
        notificationId: string
    ): Promise<Notification> {
        return Util.callAsync(this.getTestBankNotification, async () => {
            const res = await this._client.getTestBankNotification(subscriberId, notificationId);
            return res.data.notification;
        });
    }

    /**
     * Gets test bank notifications.
     *
     * @param subscriberId - ID of subscriber
     * @return response to the API call
     */
    getTestBankNotifications(subscriberId: string): Promise<Array<Notification>> {
        return Util.callAsync(this.getTestBankNotifications, async () => {
            const res = await this._client.getTestBankNotifications(subscriberId);
            return res.data.notifications || [];
        });
    }

    /**
     * Looks up an existing standing order for a given account.
     *
     * @param accountId
     * @param standingOrderId
     * @param keyLevel
     * @returns standing order
     */
    getStandingOrder(
        accountId: string,
        standingOrderId: string,
        keyLevel: KeyLevel,
    ): Promise<StandingOrder> {
        return Util.callAsync(this.getStandingOrder, async () => {
            const res = await this._client
                .getStandingOrder(accountId, standingOrderId, keyLevel);
            switch (res.data.status) {
            case 'SUCCESSFUL_REQUEST':
                return res.data.standingOrder;
            case 'MORE_SIGNATURES_NEEDED':
                throw new Error('Standing order step up required');
            default:
                throw new Error(res.data.status);
            }
        });
    }

    /**
     * Looks up standing orders for a given account.
     *
     * @param accountId
     * @param offset
     * @param limit
     * @param keyLevel
     * @returns standing orders
     */
    getStandingOrders(
        accountId: string,
        offset: string,
        limit: number,
        keyLevel: KeyLevel,
    ): Promise<{standingOrders: Array<StandingOrder>, offset: string}> {
        return Util.callAsync(this.getStandingOrders, async () => {
            const res = await this._client
                .getStandingOrders(accountId, offset, limit, keyLevel);
            switch (res.data.status) {
            case 'SUCCESSFUL_REQUEST':
                return {
                    standingOrders: res.data.standingOrders || [],
                    offset: res.data.offset,
                };
            case 'MORE_SIGNATURES_NEEDED':
                throw new Error('Standing order step up required');
            default:
                throw new Error(res.data.status);
            }
        });
    }

    _getMember(): Object {
        return Util.callAsync(this._getMember, async () => {
            const res = await this._unauthenticatedClient.getMember(this._id);
            return res.data.member;
        });
    }

    _normalizeAlias(alias: Alias, partnerId: string): Promise<Alias> {
        return Util.callAsync(this._normalizeAlias, async () => {
            const normalized =
                (await this._unauthenticatedClient.normalizeAlias(alias)).data.alias;

            if (partnerId && partnerId !== 'token') {
                // Realm must equal member's partner ID if affiliated
                if (normalized.realm && normalized.realm !== partnerId) {
                    throw new Error('Alias realm must equal partner ID: ' + partnerId);
                }
                normalized.realm = partnerId;
            }
            if (alias.realmId) {
                normalized.realmId = alias.realmId;
            }
            return normalized;
        });
    }
}

export default Member;

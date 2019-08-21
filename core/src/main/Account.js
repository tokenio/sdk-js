// @flow
import Util from '../Util';
import type Member from './Member';
import type {Balance, Transaction, KeyLevel, StandingOrder} from '..';

/**
 * Represents a bank account.
 */
export class Account {
    account: Object;
    accountMember: Object;

    /**
     * Use Member::getAccount(s).
     */
    constructor(account: Object, member: Member) {
        this.account = account;
        this.accountMember = member;
    }

    /**
     * Gets the account owner.
     *
     * @return member that owns the account
     */
    member(): Member {
        return this.accountMember;
    }

    /**
     * Gets the account ID.
     *
     * @return the account ID
     */
    id(): string {
        return this.account.id;
    }

    /**
     * Gets the account name.
     *
     * @return name of the account
     */
    name(): string {
        return this.account.name;
    }

    /**
     * Gets the account's bank.
     *
     * @return the account's bank
     */
    bankId(): string {
        return this.account.bankId;
    }

    /**
     * Looks up if this account is locked.
     *
     * @return whether this account is locked
     */
    isLocked(): boolean {
        return this.account.isLocked;
    }

    /**
     * Looks up if this account supports retrieval of information such as balance.
     *
     * @return whether this account supports info
     */
    supportsInformation(): boolean {
        return this.account.accountFeatures.supportsInformation;
    }

    /**
     * Looks up if this account supports sending payment.
     *
     * @return whether this account supports sending payment
     */
    supportsSendPayment(): boolean {
        return this.account.accountFeatures.supportsSendPayment;
    }

    /**
     * Looks up if this account supports receiving payment.
     *
     * @return whether this account supports receiving payment
     */
    supportsReceivePayment(): boolean {
        return this.account.accountFeatures.supportsReceivePayment;
    }

    /**
     * Looks up if this account requires external authorization for creating transfers.
     *
     * @return whether this account requires external auth
     */
    requiresExternalAuth(): boolean {
        return this.account.accountFeatures.requiresExternalAuth;
    }

    /**
     * Fetches the raw account object.
     *
     * @return the account object
     */
    toProto(): Object {
        return this.account;
    }

    /**
     * Looks up the account's balance.
     *
     * @param keyLevel
     * @return the account's balance
     */
    getBalance(keyLevel: KeyLevel): Promise<Balance> {
        return Util.callAsync(this.getBalance, async () => {
            const res = await this.accountMember._client.getBalance(this.account.id, keyLevel);
            switch (res.data.status) {
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
     * Looks up a transaction by ID.
     * @param transactionId
     * @param keyLevel
     * @return transaction
     */
    getTransaction(
        transactionId: string,
        keyLevel: KeyLevel
    ): Promise<Transaction> {
        return Util.callAsync(this.getTransaction, async () => {
            const res = await this.accountMember._client
                .getTransaction(this.account.id, transactionId, keyLevel);
            switch (res.data.status) {
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
     * Looks up the account's transactions.
     *
     * @param offset - where to start
     * @param limit - max number to retrieve
     * @param keyLevel
     * @return transactions
     */
    getTransactions(
        offset: string,
        limit: number,
        keyLevel: KeyLevel
    ): Promise<{transactions: Array<Transaction>, offset: string}> {
        return Util.callAsync(this.getTransactions, async () => {
            const res = await this.accountMember._client
                .getTransactions(this.account.id, offset, limit, keyLevel);
            switch (res.data.status) {
            case 'SUCCESSFUL_REQUEST':
                return {
                    transactions: res.data.transactions || [],
                    offset: res.data.offset,
                };
            case 'MORE_SIGNATURES_NEEDED':
                throw new Error('Transaction step up required');
            default:
                throw new Error(res.data.status);
            }
        });
    }

    /**
     * Looks up an existing standing account order for a given account.
     *
     * @param standingOrderId
     * @param keyLevel
     * @return standing order record
     */
    getStandingOrder(
        standingOrderId: string,
        keyLevel: KeyLevel,
    ): Promise<StandingOrder> {
        return Util.callAsync(this.getStandingOrder, async () => {
            const res = await this.accountMember._client
                .getStandingOrder(this.account.id, standingOrderId, keyLevel);
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
     * Looks up all of the member's standing orders on the account
     *
     * @param accountId
     * @param offset
     * @param limit
     * @param keyLevel
     * @returns standing orders
     */
    getStandingOrders(
        offset: string,
        limit: number,
        keyLevel: KeyLevel,
    ): Promise<{standingOrders: Array<StandingOrder>, offset: string}> {
        return Util.callAsync(this.getStandingOrders, async () => {
            const res = await this.accountMember._client
                .getStandingOrders(this.account.id, offset, limit, keyLevel);
            switch (res.data.status) {
            case 'SUCCESSFUL_REQUEST':
                return {
                    transactions: res.data.standingOrders || [],
                    offset: res.data.offset,
                };
            case 'MORE_SIGNATURES_NEEDED':
                throw new Error('Standing order step up required');
            default:
                throw new Error(res.data.status);
            }
        });
    }
}
export default Account;

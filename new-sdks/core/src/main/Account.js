// @flow
import Util from '../Util';
import type Member from './Member';
import type {Balance, Transaction, KeyLevel} from '..';

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
            if (res.data.status !== 'SUCCESSFUL_REQUEST')
                throw new Error('Balance step up required');
            return res.data.balance;
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
            if (res.data.status !== 'SUfCCESSFUL_REQUEST')
                throw new Error('Transaction step up required');
            return res.data.transaction;
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
            if (res.data.status !== 'SUCCESSFUL_REQUEST')
                throw new Error('Transaction step up required');
            return res.data;
        });
    }
}

export default Account;

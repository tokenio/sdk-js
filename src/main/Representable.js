// @flow
import {
    Account,
    AddressRecord,
    Balance,
    Transaction,
} from '../proto';
import type Member from './Member';
import type {
    RequestStatusEnum,
} from '../proto';

/**
 * Represents the part of a Token member that can be accessed through an access token.
 */
export default class Representable {
    _member: Member;

    /**
     * Instantiate a representable that acts on behalf of a Token member.
     *
     * @constructor
     * @param member - the Token member
     */
    constructor(member: Member) {
        this._member = member;
    }

    /**
     * Looks up an account by the account dd
     *
     * @param accountId - the id
     * @return Promise resolving to the account
     * @throws error if account not found
     */
    getAccount(accountId: string): Promise<Account> {
        return this._member.getAccount(accountId);
    }

    /**
     * Looks up linked accounts.
     *
     * @return Promise resolving to the accounts
     */
    getAccounts(): Promise<Array<Account>> {
        return this._member.getAccounts();
    }

    /**
     * Looks up the balance of an account
     *
     * @param accountId - id of the account
     * @param keyLevel - key level
     * @return Promise of get balance response object
     */
    getBalance(
        accountId: string,
        keyLevel: string
    ): Promise<{ balance: Balance, status: RequestStatusEnum }> {
        return this._member.getBalance(accountId, keyLevel);
    }

    /**
     * Looks up the balances of an array of accounts
     *
     * @param accountIds - array of account ids
     * @param keyLevel - key level
     * @return Promise of get balances response object
     */
    getBalances(
        accountIds: Array<string>,
        keyLevel: string
    ): Promise<Array<{ balance: Balance, status: RequestStatusEnum }>> {
        return this._member.getBalances(accountIds, keyLevel);
    }

    /**
     * Looks up a transaction
     *
     * @param accountId - id of the account
     * @param transactionId - which transaction to look up
     * @param keyLevel - key level
     * @return the Transaction
     * @throws error if transaction not found
     */
    getTransaction(
        accountId: string,
        transactionId: string,
        keyLevel: string
    ): Promise<Transaction> {
        return this._member.getTransaction(accountId, transactionId, keyLevel);
    }

    /**
     * Looks up all of the member's transactions for an account
     *
     * @param accountId - id of the account
     * @param offset - where to start looking
     * @param limit - how many to retrieve
     * @param keyLevel - key level
     * @return Transactions
     */
    getTransactions(
        accountId: string,
        offset: string,
        limit: number,
        keyLevel: string
    ): Promise<{data: Array<Transaction>, offset: string}> {
        return this._member.getTransactions(accountId, offset, limit, keyLevel);
    }

    /**
     * Gets the member's address
     *
     * @param addressId - the address id
     * @return AddressRecord structure
     * @throws error if address not found
     */
    getAddress(addressId: string): Promise<AddressRecord> {
        return this._member.getAddress(addressId);
    }

    /**
     * Gets the member's addresses
     *
     * @return list of AddressRecord structures
     */
    getAddresses(): Promise<Array<AddressRecord>> {
        return this._member.getAddresses();
    }
}

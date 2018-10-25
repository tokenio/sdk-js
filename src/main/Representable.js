// @flow
import type {RequestStatusEnum} from '../proto/index';
import {Account, AddressRecord, Balance, Transaction} from '../proto';
import Member from './Member';

/**
 * Represents the part of a Token member that can be accessed through an access token.
 */
export default class Representable {
    _member: Member;

    /**
     * Instantiate a representable that acts on behalf of a Token member.
     *
     * @constructor
     * @param {Member} member - the Token member
     */
    constructor(member: Member) {
        this._member = member;
    }

    /**
     * Looks up an account by the account dd
     *
     * @param {string} accountId - the id
     * @return {Promise} account - Promise resolving to the account
     * @throws error if account not found
     */
    getAccount(accountId: string): Promise<Account> {
        return this._member.getAccount(accountId);
    }

    /**
     * Looks up linked accounts.
     *
     * @return {Promise} accounts - Promise resolving to the accounts
     */
    getAccounts(): Promise<Array<Account>> {
        return this._member.getAccounts();
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
    ): Promise<{ balance: Balance, status: RequestStatusEnum }> {
        return this._member.getBalance(accountId, keyLevel);
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
    ): Promise<Array<{ balance: Balance, status: RequestStatusEnum }>> {
        return this._member.getBalances(accountIds, keyLevel);
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
        return this._member.getTransaction(accountId, transactionId, keyLevel);
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
        return this._member.getTransactions(accountId, offset, limit, keyLevel);
    }

    /**
     * Gets the member's address
     *
     * @param {string} addressId - the address id
     * @return {Promise} address - AddressRecord structure
     * @throws error if address not found
     */
    getAddress(addressId: string): Promise<AddressRecord> {
        return this._member.getAddress(addressId);
    }

    /**
     * Gets the member's addresses
     *
     * @return {Promise} addresses - list of AddressRecord structures
     */
    getAddresses(): Promise<Array<AddressRecord>> {
        return this._member.getAddresses();
    }
}

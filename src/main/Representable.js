// @flow
import type {RequestStatusEnum} from '../proto/index';
import {Account, AddressRecord, Balance, Transaction} from '../proto';
import Util from '../Util';
import AuthHttpClient from '../http/AuthHttpClient';
import {RequestStatus} from '../proto/index';

/**
 * Member object. Allows member-wide actions. Some calls return a promise, and some return
 * objects
 */
export default class Representable {
    _client: AuthHttpClient;

    /**
     * Represents the part of a token member that can be accessed through an access token.
     *
     * @constructor
     * @param {AuthHttpClient} client - the http client
     */
    constructor(client: AuthHttpClient) {
        this._client = client;
    }

    /**
     * Looks up an account by the account dd
     *
     * @param {string} accountId - the id
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
     * Looks up linked accounts.
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
    ): Promise<Array<{ balance: Balance, status: RequestStatusEnum }>> {
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
}

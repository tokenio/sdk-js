// @flow
import {Account} from '@token-io/core';
import type Member from './Member';
import type {
    Balance,
    KeyLevel,
    Transaction,
    StandingOrder,
    TransferDestination,
} from '@token-io/core';

/**
 * Represents the part of a Token member that can be accessed through an access token.
 */
export default class Representable {
    _member: Member;

    /**
     * User Member::forAccessToken.
     */
    constructor(member: Member) {
        this._member = member;
    }

    /**
     * Looks up an account by the account ID.
     *
     * @param accountId - the ID
     * @return Promise resolving to the account
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
        return this._member.getBalance(accountId, keyLevel);
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
        return this._member.getBalances(accountIds, keyLevel);
    }

    /**
     * Looks up an existing transaction for a given account.
     *
     * @param accountId - ID of the account
     * @param transactionId - which transaction to look up
     * @param keyLevel - key level
     * @return Transaction
     */
    getTransaction(
        accountId: string,
        transactionId: string,
        keyLevel: KeyLevel
    ): Promise<Transaction> {
        return this._member.getTransaction(accountId, transactionId, keyLevel);
    }

    /**
     * Looks up transactions for a given account.
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
        return this._member.getTransactions(accountId, offset, limit, keyLevel, startDate, endDate);
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
        return this._member.confirmFunds(accountId, amount, currency);
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
        return this._member.getStandingOrder(accountId, standingOrderId, keyLevel);
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
        return this._member.getStandingOrders(accountId, offset, limit, keyLevel);
    }

    /**
     * Resolves transfer destinations for the given account ID.
     *
     * @param accountId - ID of account to resolve destinations for
     * @return resolved transfer destinations
     */
    resolveTransferDestinations(accountId: string): Promise<TransferDestination> {
        return this._member.resolveTransferDestinations(accountId);
    }
}

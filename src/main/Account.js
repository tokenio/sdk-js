import PagedResult from "./PagedResult";
import Transaction from "./Transaction";
import Util from "../Util";

/**
 * Account class. Allows the member to make account specific operations, move money, etc
 */
export default class Account {
    /**
     * Represents the account
     * @constructor
     * @param {Member} member - member that owns this account
     * @param {object} acc - account json object retrieved from server
     */
    constructor(member, acc) {
        this._member = member;
        this._id = acc.id;
        this._name = acc.name;
        this._bankId = acc.bankId;
    }

    /**
     * return the member
     * @return {Member} member - member
     */
    get member() {
        return this._member;
    }

    /**
     * return the account Id
     * @return {string} accountId - accountId
     */
    get id() {
        return this._id;
    }

    /**
     * return the name of the account
     * @return {string} accountName - name
     */
    get name() {
        return this._name;
    }

    /**
     * return bank Id
     * @returns {string} bankId - bank id
     */
    get bankId() {
        return this._bankId;
    }

    /**
     * Looks up the balance of the account
     * @return {Promise} balance - Promise of balance object
     */
    getBalance() {
        return Util.tryToDo(this.getBalance, async () => {
            const res = await this._member._client.getBalance(this._id);
            return res.data;
        });
    }

    /**
     * Looks up a transaction for the account
     * @param {string} transactionId - which transaction to look up
     * @return {Promise} transaction - the Transaction
     */
    getTransaction(transactionId) {
        return Util.tryToDo(this.getTransaction, async () => {
            const res = await this._member._client.getTransaction(this._id, transactionId);
            return new Transaction(res.data.transaction);
        });
    }

    /**
     * Looks up all of the member's transactions
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to retrieve
     * @return {Promise} transactions - Transactions
     */
    getTransactions(offset, limit) {
        return Util.tryToDo(this.getTransactions, async () => {
            const res = await this._member._client.getTransactions(this._id, offset, limit);
            return new PagedResult(
                res.data.transactions.map(tr => new Transaction(tr)),
                res.data.offset);
        });
    }
}

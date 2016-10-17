import PagedResult from "./PagedResult";
import Transaction from "./Transaction";

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
     * Sets the account name
     * @param {string} name - accountName
     * @return {Promise} empty - empty promise
     */
    setName(name) {
        return this._member._client.setAccountName(this._id, name)
            .then(() => {
                this._name = name;
            })
            .catch(err => this._reject(this.setName, err));
    }

    /**
     * Looks up the balance of the account
     * @return {Promise} balance - Promise of balance object
     */
    getBalance() {
        return this._member._client.getBalance(this._id)
            .then(res => {
                return res.data;
            })
            .catch(err => this._reject(this.getBalance, err));
    }

    /**
     * Looks up a transaction for the account
     * @param {string} transactionId - which transaction to look up
     * @return {Promise} transaction - the Transaction
     */
    getTransaction(transactionId) {
      return this._member._client.getTransaction(this._id, transactionId)
          .then(res => {
              return new Transaction(res.data.transaction);
          })
          .catch(err => this._reject(this.getTransaction, err));
    }

    /**
     * Looks up all of the member's transactions
     * @param {string} offset - where to start looking
     * @param {int} limit - how many to retrieve
     * @return {Promise} transactions - Transactions
     */
    getTransactions(offset, limit) {
        return this._member._client.getTransactions(this._id, offset, limit)
            .then(res => {
                return new PagedResult(
                    res.data.transactions.map(tr => new Transaction(tr)),
                    res.data.offset);
            })
            .catch(err => this._reject(this.getTransactions, err));
    }

    _reject(method, err) {
        return Promise.reject({
            type: method.name,
            error: err,
            reason: (err.response.data !== undefined) ? err.response.data : "UNKNOWN"
        });
    }
}

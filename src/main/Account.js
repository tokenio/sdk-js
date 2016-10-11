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
    setAccountName(name) {
        return this._member._client.setAccountName(this._id, name)
            .then(res => {
                this._name = name;
            });
    }

    /**
     * Looks up the balance of the account
     * @return {Promise} balance - Promise of balance object
     */
    getBalance() {
        return this._member._client.getBalance(this._id)
            .then(res => {
                return res.data;
            });
    }

    // TODO(mariano): Fix me.
    // /**
    //  * Looks up a transaction for the account
    //  * @param {string} transactionId - which transaction to look up
    //  * @return {Promise} transaction - the Transaction
    //  */
    // getTransaction(transactionId) {
    //   return AuthHttpClient.getTransaction(this._member.keys, this._member.id,
    //     this._id, transactionId)
    //   .then(res => {
    //     return new Transaction(res.data);
    //   });
    // }

    /**
     * Looks up all of the member's payments
     * @param {int} offset - where to start looking
     * @param {int} limit - how many to retrieve
     * @return {Promise} transactions - Transactions
     */
    getTransactions(offset = 0, limit = 100) {
        return this._member._client.getTransactions(this._id, offset, limit)
            .then(res => {
                return res.data.transactions.map(tr => new Transaction(tr));
            });
    }
}

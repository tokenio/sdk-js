/**
 * Gets a member's recent transactions
 *
 * @param {Member} payer - payer member
 */
export default async (payer) => {
    const accounts = await payer.getAccounts();
    const accountId = accounts[0].id;

    const pagedResult = await payer.getTransactions(accountId, "0", 10);
    for (var i = 0; i < pagedResult.length; i++) {
        const transaction = pagedResult[i];
        displayTransaction(
            transaction.amount.currency, // "EUR"
            transaction.amount.value,    // "5.00"
            transaction.type,            // "DEBIT" or "CREDIT"
            transaction.status);         // "PENDING" or "SUCCESS" or other TransactionStatus
    }
};

/**
 * Display a transaction.
 *
 * @param {String} currency - one of "EUR", "USD", ...
 * @param {String} value - "5.00"
 * @param {String} type - "DEBIT" or "CREDIT"
 * @param {String} status - "PENDING" or "SUCCESS" or other TransactionStatus
 */
function displayTransaction(currency, value, type, status) {
}

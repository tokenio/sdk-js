/**
 * Gets a logged-in member's account balances two ways.
 *
 * @param {Member} member - logged-in member.
 * @return {Object} balances by currency like {"EUR": 1000.0, "USD": 2000.0 }
 */
export default async (member) => {
    var sums = {};
    const accounts = await member.getAccounts();
    for (var i = 0; i < accounts.length; i++) {
        const balance = await member.getBalance(accounts[i].id);
        const currency = balance.available.currency;
        sums[currency] = (sums[currency] || 0) +
            parseFloat(balance.available.value);
    }
    return sums;
};

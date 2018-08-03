import config from '../config.json';

/**
 * Gets a logged-in member's account balances another way.
 *
 * @param {Member} member - logged-in member.
 * @return {Object} balances by currency like {'EUR': 1000.0, 'USD': 2000.0 }
 */

export default async (member) => {
    var sums = {};
    const accounts = await member.getAccounts();
    const accountIds = accounts.map((account) => (account.id));

    const balancesResponse = await member.getBalances(accountIds, config.KeyLevel.STANDARD);

    for (var i = 0; i < balancesResponse.response.length; i++) {
        const balance = balancesResponse.response[i].balance;
        const currency = balance.available.currency;
        sums[currency] = (sums[currency] || 0) +
            parseFloat(balance.available.value);
    }
    return sums;
};

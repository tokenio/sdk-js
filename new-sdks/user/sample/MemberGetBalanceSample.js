import config from '../src/config.json';

/**
 * Gets a logged-in member's account balances two ways.
 *
 * @param {Member} member - logged-in member.
 * @return {Object} balances by currency like {'EUR': 1000.0, 'USD': 2000.0 }
 */

export default async member => {
    const sums = {};
    const accounts = await member.getAccounts();
    for (let i = 0; i < accounts.length; i++) {
        const balanceResponse = await member.getBalance(accounts[i].id(), config.KeyLevel.STANDARD);
        const currency = balanceResponse.available.currency;
        sums[currency] = (sums[currency] || 0) +
            parseFloat(balanceResponse.available.value);
    }
    return sums;
};

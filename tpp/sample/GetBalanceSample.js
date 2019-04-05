import config from '../src/config.json';

/**
 * Gets a logged-in member's account balances.
 *
 * @param {Member} member - logged-in member.
 * @return {Object} balances by currency like {'EUR': 1000.0, 'USD': 2000.0 }
 */
export const MemberGetBalanceSample = async member => {
    const sums = {};
    const accounts = await member.getAccounts();
    for (let i = 0; i < accounts.length; i++) {
        const balance = await member.getBalance(accounts[i].id(), config.KeyLevel.STANDARD);
        const currency = balance.available.currency;
        sums[currency] = (sums[currency] || 0) +
            parseFloat(balance.available.value);
    }
    return sums;
};

/**
 * Gets a logged-in member's account balances through using the Account class.
 *
 * @param {Member} member - logged-in member.
 * @return {Object} balances by currency like {'EUR': 1000.0, 'USD': 2000.0 }
 */
export const AccountGetBalanceSample = async member => {
    const sums = {};
    const accounts = await member.getAccounts();
    for (let i = 0; i < accounts.length; i++) {
        const balance = await accounts[i].getBalance(config.KeyLevel.STANDARD);
        const currency = balance.available.currency;
        sums[currency] = (sums[currency] || 0) +
            parseFloat(balance.available.value);
    }
    return sums;
};

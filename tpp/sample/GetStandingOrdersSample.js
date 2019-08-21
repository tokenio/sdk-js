import config from '../src/config.json';

/**
 * Gets a member's recent standing orders.
 *
 * @param {Member} payer - payer member
 * @return {Object} array of standing orders.
 */
export default async payer => {
    const accounts = await payer.getAccounts();
    const accountId = accounts[0].id();
    const pagedResult = await payer.getStandingOrders(  // payer is core -> Member.js
        accountId,
        '',
        10,
        config.KeyLevel.STANDARD);
    return pagedResult.standingOrders;
};

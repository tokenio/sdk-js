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
    console.log('payer', accountId);
    const pagedResult = await payer.getStandingOrders(
        accountId,
        '',
        10,
        config.KeyLevel.STANDARD);
    return pagedResult.standingOrders;
};

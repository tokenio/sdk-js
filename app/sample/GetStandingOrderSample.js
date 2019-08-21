import config from '../src/config.json';

/**
 * Gets information about a recently-completed standing order.
 *
 * @param {Member} payer - member
 * @param {Object} standingOrderToken - standingOrderToken
 * @return {Object} standing order record
 */
export default async (payer, standingOrderToken) => {
    const accounts = await payer.getAccounts();
    const accountId = accounts[0].id();

    const {standingOrderId} = standingOrderToken;
    return await payer.getStandingOrder(
        accountId,
        standingOrderId,
        config.KeyLevel.STANDARD);
};

import config from '../src/config.json';

/**
 * Gets information about a recently-completed standing order.
 *
 * @param {Member} payer - member
 * @param {Object} standingOrder - recently-completed standing order
 * @return {Object} standing order record
 */
export default async (payer, standingOrder) => {
    const accounts = await payer.getAccounts();
    const accountId = accounts[0].id();

    const standingOrderId = standingOrder.standingOrderId;
    return await payer.getStandingOrder(
        accountId,
        standingOrderId,
        config.KeyLevel.STANDARD);
};

/**
 * Sample code illustrating how to provision a device.
 * That is, how a member logs in with one device when their
 * account 'lives' on another device.
 */

class ProvisionDeviceSample {

    /**
     * Provision device: generate a key and ask member
     * to approve it on their 'regular' device.
     *
     * @param {Object} Token - Token SDK client
     * @param {Object} alias - alias of member to provision
     * @return {Object} key used in provisioning
     */
    static async provision(Token, alias) {
        // We mostly test in 'node' mode, not 'Browser'
        // mode so use UnsecuredFileCryptoEngine
        // instead of BrowserCryptoEngine.
        const deviceInfo = await Token.provisionDeviceLow(
            alias,
            Token.BrowserCryptoEngine);
        const lowKey = deviceInfo.keys.filter(
            k => k.level === 'LOW'
        )[0];
        const deviceMetadata = {
            application: 'SDK Sample',
        };
        const notifyStatus = await Token.notifyAddKey(
            alias,
            [lowKey],
            deviceMetadata,
        );
        if (notifyStatus !== 'ACCEPTED') {
            console.log('notifyAddKey got ' + notifyStatus); // eslint-disable-line
        }
        return lowKey;
    }

    /* Get member on provisioned device (assuming
     * 'remote' member approved key).
     *
     * @param {Object} Token - Token SDK client
     * @param {Object} alias - alias of member to provision
     * @return {Object} Member, logged in on this device
     */
    static async getMember(Token, alias) {
        const memberStruct = await Token.resolveAlias(alias);
        const localLoggedIn = Token.getMember(
            Token.BrowserCryptoEngine,
            memberStruct.id);
        return localLoggedIn;
    }
}
export default ProvisionDeviceSample;

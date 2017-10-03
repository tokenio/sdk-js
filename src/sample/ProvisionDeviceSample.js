/**
 * Sample code illustrating how to provision a device.
 * That is, how a member logs in with one device when their
 * account "lives" on another device.
 */
class PollNotificationsSample {

    /**
     * Provision device: generate a key and ask member
     * to approve it on their "regular" device.
     *
     * @param {Object} Token - Token SDK client
     * @param {Object} alias - alias of member to provision
     * @return {Object} key used in provisioning
     */
    static async provision(Token, alias) {
        // We mostly test in "node" mode, not "Browser"
        // mode so use UnsecuredFileCryptoEngine
        // instead of BrowserCryptoEngine.
        const deviceInfo = await Token.provisionDeviceLow(
            alias,
            Token.UnsecuredFileCryptoEngine);
        for (var ix = 0; ix < deviceInfo.keys.length; ix++) {
            const key = deviceInfo.keys[ix];
            if (key.level === Token.KeyLevel.LOW) {
                const notifyStatus = await Token.notifyAddKey(
                    alias,
                    'SDK Sample',
                    key,
                    Token.KeyLevel.LOW);
                if (notifyStatus !== "ACCEPTED") {
                    console.log("notifyAddKey got " + notifyStatus);
                }
                return key;
            }
        }
    }

    /* Log in on provisioned device (assuming
     * "remote" member approved key).
     *
     * @param {Object} Token - Token SDK client
     * @param {Object} alias - alias of member to provision
     * @return {Object} Member, logged in on this device
     */
    static async login(Token, alias) {
        const memberStruct = await Token.resolveAlias(alias);
        const localLoggedIn = Token.login(
            Token.UnsecuredFileCryptoEngine,
            memberStruct.id);
        return localLoggedIn;
    }
}
export default PollNotificationsSample;

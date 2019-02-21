import {TokenClient} from '../../user';
import config from '../../user/src/config.json';

const Token = new TokenClient({env: TEST_ENV, developerKey: config.devKey[TEST_ENV]});

export default class TestUtil {
    /**
     * Retries the supplied function until it either runs successfully or the timeout has passed.
     *
     * @param {function} fn - function to run until success or timeout
     * @param {number} timeoutMs - milliseconds to wait before timing out
     * @param {number} waitTimeMs - milliseconds to wait after failed invocation of the supplied
     *                              function before retrying
     */
    static async waitUntil(fn, timeoutMs = 10000, waitTimeMs = 500) {
        const start = Date.now();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                await fn();
                return;
            } catch (e) {
                if (Date.now() - start > timeoutMs) {
                    throw e;
                }
                await new Promise(resolve => setTimeout(resolve, waitTimeMs));
            }
        }
    }

    static async createUserMember(providedAlias) {
        const alias = {
            type: 'EMAIL',
            value: `${Token.Util.generateNonce()}+nv@example.com`,
        };
        const member = await Token.createMember(providedAlias || alias, Token.MemoryCryptoEngine);
        await member.createAndLinkTestBankAccount(200, 'EUR');
        return member;
    }

    static async createAccessToken(grantor, granteeAlias) {
        const accountId = (await grantor.getAccounts())[0].id();
        const accessToken = await grantor.createAccessTokenBuilder()
            .forAccount(accountId)
            .forAccountBalance(accountId)
            .setToAlias(granteeAlias)
            .execute();
        const endorsed = await grantor.endorseToken(accessToken);
        return endorsed.token;
    }

    static async createTransferToken(payer, payeeAlias) {
        const accountId = (await payer.getAccounts())[0].id();
        const transferToken = await payer.createTransferTokenBuilder(100, 'EUR')
            .setAccountId(accountId)
            .setToAlias(payeeAlias)
            .setDescription('Book Purchase')
            .execute();
        const endorsed = await payer.endorseToken(transferToken);
        return endorsed.token;
    }
}

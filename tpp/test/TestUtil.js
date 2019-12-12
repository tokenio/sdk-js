import {TokenClient} from '@token-io/app';

const Token = new TokenClient({env: TEST_ENV});

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

    static async createStandingOrderToken(payer, payeeAlias) {
        const accountId = (await payer.getAccounts())[0].id();
        const destination = {
            sepa: {
                iban: '123',
            },
        };
        const standingOrderTokenBuilder = await payer.createStandingOrderTokenBuilder(100, 'EUR', 'MNTH', '2018-02-15', '2019-02-15')
            .setAccountId(accountId)
            .setToAlias(payeeAlias)
            .addTransferDestination(destination)
            .buildPayload();
        const {resolvedPayload, policy} = await payer.prepareToken(standingOrderTokenBuilder);
        const signature = [await payer.signTokenPayload(resolvedPayload, policy.singleSignature.signer.keyLevel)];
        const standingOrderToken = await payer.createToken(resolvedPayload, signature);
        const endorsed = await payer.endorseToken(standingOrderToken);
        return endorsed.token;
    }

    static async createBulkTransferToken(payer, payeeAlias) {
        const accountId = (await payer.getAccounts())[0].id();
        const transfers = [
            {
                amount: '20',
                currency: 'USD',
                refId: '1234a',
                description: 'order1',
                destination: {
                    sepa: {
                        iban: '123',
                    }},
            },
            {
                amount: '20',
                currency: 'USD',
                refId: '1234b',
                description: 'order2',
                destination: {
                    sepa: {
                        iban: '123',
                    },
                },
            },
            {
                amount: '30',
                currency: 'USD',
                refId: '1234c',
                description: 'order1',
                destination: {
                    sepa: {
                        iban: '123',
                    },
                },
            },
        ];
        const source = {
            account: {
                token: {
                    memberId: payer._id,
                    accountId,
                },
            },
            customerData: {
                legalNames: ['Southside'],
            },
        };
        const bulkTransferTokenBuilder = await payer.createBulkTransferTokenBuilder(transfers, '70')
            .setToAlias(payeeAlias)
            .setSource(source)
            .setRefId('123123')
            .buildPayload();
        const {resolvedPayload, policy} = await payer.prepareToken(bulkTransferTokenBuilder);
        const signature = [await payer.signTokenPayload(resolvedPayload, policy.singleSignature.signer.keyLevel)];
        const bulkTransferToken = await payer.createToken(resolvedPayload, signature);
        return bulkTransferToken;
    }

    static formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
}

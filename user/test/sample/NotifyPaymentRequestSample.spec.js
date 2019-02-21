import {TokenClient} from '../../src';
import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import NotifyPaymentRequestSample from '../../sample/NotifyPaymentRequestSample';
const {assert} = require('chai');

describe('NotifyPaymentRequestSample test', () => {
    it('Should run the sample', async () => {
        const devKey = require('../../src/config.json').devKey[TEST_ENV];
        const Token = new TokenClient({env: TEST_ENV, developerKey: devKey});
        const payee = await CreateMemberSample();
        const payer = await CreateMemberSample();
        await LinkMemberAndBankSample(payer);
        await payer.subscribeToNotifications('token', {
            PLATFORM: 'TEST',
            TARGET: Token.Util.generateNonce(),
        });
        const payerAlias = await payer.firstAlias();
        const res = await NotifyPaymentRequestSample(Token, payee, payerAlias);
        assert.equal(res, 'ACCEPTED');
    });
});

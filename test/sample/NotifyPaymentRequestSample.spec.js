import {NotifyStatus, TokenIO} from '../../src';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import NotifyPaymentRequestSample from '../../src/sample/NotifyPaymentRequestSample';

const {assert} = require('chai');

describe('NotifyPaymentRequestSample test', () => {
    it('Should run the sample', async () => {
        const devKey = require('../../src/config.json').devKey[TEST_ENV];
        const Token = new TokenIO({env: TEST_ENV, developerKey: devKey});

        const payee = await CreateMemberSample();
        const payer = await CreateMemberSample();

        await LinkMemberAndBankSample(payee);
        await LinkMemberAndBankSample(payer);

        await payer.subscribeToNotifications('token', {
            PLATFORM: 'TEST',
            TARGET: Token.Util.generateNonce(),
        });

        const payerAlias = await payer.firstAlias();
        const res = await NotifyPaymentRequestSample(Token, payee, payerAlias);
        assert.equal(res, NotifyStatus.ACCEPTED);
    });
});

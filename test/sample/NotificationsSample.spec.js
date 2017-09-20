/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import PollNotificationsSample from '../../src/sample/PollNotificationsSample';
import NotifyPaymentRequestSample from '../../src/sample/NotifyPaymentRequestSample';

describe('NotificationsSample test', () => {
    it('PollNotificationsSample should run', async () => {
        const TokenLib = require('../../src');
        const Token = new TokenLib(TEST_ENV);
        const payer = await CreateMemberSample();
        await PollNotificationsSample.subscribeMember(payer);
        const payee = await CreateMemberSample();
        await LinkMemberAndBankSample(payer);
        await LinkMemberAndBankSample(payee);

        const payerAlias = {
            type: 'USERNAME',
            value: await payer.firstAlias()
        };
        const res = await NotifyPaymentRequestSample(Token, payee, payerAlias);
        assert.isOk(res);

        await PollNotificationsSample.get(payer);
    });
});

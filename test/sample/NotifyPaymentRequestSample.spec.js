/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import NotifyPaymentRequestSample from '../../src/sample/NotifyPaymentRequestSample';

describe('NotifyPaymentRequestSample test', () => {
    it('Should run the sample', async () => {
        const TokenLib = require('../../src');
        const Token = new TokenLib(TEST_ENV);

        const payee = await CreateMemberSample();
        const payer = await CreateMemberSample();
        await LinkMemberAndBankSample(payee);
        await LinkMemberAndBankSample(payer);

        await payer.subscribeToNotifications("token", {
            PLATFORM: 'TEST',
            TARGET: Token.Util.generateNonce(),
        });

        const payerAlias = {
            type: 'USERNAME',
            value: await payer.firstAlias()
        };
        const res = await NotifyPaymentRequestSample(Token, payee, payerAlias);
        assert.equal(res, 'ACCEPTED');
    });
});

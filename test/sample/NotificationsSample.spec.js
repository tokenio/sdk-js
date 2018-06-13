/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import PollNotificationsSample from '../../src/sample/PollNotificationsSample';
import TestUtil from '../TestUtil';

describe('NotificationsSample test', () => {
    it('PollNotificationsSample should run', async () => {
        const payer = await CreateMemberSample();
        const payee = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await payer.firstAlias());
            assert.isOk(await payee.firstAlias());
        });
        await PollNotificationsSample.subscribeMember(payee);
        const auth = await payer.createTestBankAccount(200, 'EUR');
        const accounts = await payer.linkAccounts(auth);
        await LinkMemberAndBankSample(payee);

        const payerAlias = await payer.firstAlias();

        const token = await payer.createTransferToken(100.00, 'EUR')
              .setAccountId(accounts[0].id)
              .setRedeemerAlias(payerAlias)
              .setToAlias(await payee.firstAlias())
              .addDestination({account: {token: {memberId: payee.memberId()}}})
              .execute();
        await payer.endorseToken(token);
        await payer.redeemToken(token, 100.00, "EUR", "transfer notify sample");

        await PollNotificationsSample.get(payee);
    });
});

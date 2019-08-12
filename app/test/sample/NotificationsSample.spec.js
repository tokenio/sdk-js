import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import PollNotificationsSample from '../../sample/PollNotificationsSample';

describe('NotificationsSample test', () => {
    it('PollNotificationsSample should run', async () => {
        const payer = await CreateMemberSample();
        const payee = await CreateMemberSample();

        await PollNotificationsSample.subscribeMember(payee);
        const auth = await payer.createTestBankAccount(200, 'EUR');
        const accounts = await payer.linkAccounts(auth);
        await LinkMemberAndBankSample(payee);

        const token = await payer.createTransferTokenBuilder(100.00, 'EUR')
            .setAccountId(accounts[0].id())
            .setToAlias(await payee.firstAlias())
            .addTransferDestinations([{token: {memberId: payee.memberId()}}])
            .execute();
        await payer.endorseToken(token);
        await payee.redeemToken(token, 100.00, 'EUR', 'transfer notify sample');

        await PollNotificationsSample.get(payee);
    });
});

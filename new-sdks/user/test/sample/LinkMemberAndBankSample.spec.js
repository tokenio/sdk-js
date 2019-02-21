import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
const {assert} = require('chai');

describe('LinkMemberAndBankSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        const accounts = await member.getAccounts();
        assert.isAtLeast(accounts.length, 1);
    });
});

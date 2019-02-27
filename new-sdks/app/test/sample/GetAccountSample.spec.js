import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import GetAccountSample from '../../sample/GetAccountSample';
const {assert} = require('chai');

describe('GetAccountSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        const accounts = await member.getAccounts();
        const account = await GetAccountSample(member, accounts[0].id());
        assert.equal(account.id(), accounts[0].id());
        assert.equal(account.name(), accounts[0].name());
        assert.equal(account.bankId(), accounts[0].bankId());
    });
});

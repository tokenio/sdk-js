import CreateMemberSample from '../../sample/CreateMemberSample';
import GetAccountSample from '../../sample/GetAccountSample';
const {assert} = require('chai');

describe('GetAccountSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const account = await member.createAndLinkTestBankAccount(200, 'EUR');
        const res = await GetAccountSample(member, account.id());
        assert.equal(account.id(), res.id());
        assert.equal(account.name(), res.name());
        assert.equal(account.bankId(), res.bankId());
    });
});

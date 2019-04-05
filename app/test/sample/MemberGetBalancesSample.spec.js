import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import MemberGetBalancesSample from '../../sample/MemberGetBalancesSample';
const {assert} = require('chai');

describe('MemberGetBalancesSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        const sums = await MemberGetBalancesSample(member);
        assert.equal(sums.EUR, 200);
    });
});

import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import MemberGetBalanceSample from '../../sample/MemberGetBalanceSample';
const {assert} = require('chai');

describe('MemberGetBalanceSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        const sums = await MemberGetBalanceSample(member);
        assert.equal(sums.EUR, 200);
    });
});

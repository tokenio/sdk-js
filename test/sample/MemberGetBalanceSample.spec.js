import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import MemberGetBalanceSample from '../../src/sample/MemberGetBalanceSample';

const {assert} = require('chai');

describe('MemberGetBalanceSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        const sums = await MemberGetBalanceSample(member);

        assert.equal(sums.EUR, 200);
    });
});

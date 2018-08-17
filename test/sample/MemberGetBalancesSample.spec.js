import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import MemberGetBalancesSample from '../../src/sample/MemberGetBalancesSample';

const {assert} = require('chai');

describe('MemberGetBalancesSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        const sums = await MemberGetBalancesSample(member);

        assert.equal(sums.EUR, 200);
    });
});

import CreateMemberSample from '../../sample/CreateMemberSample';
import {MemberGetBalanceSample, AccountGetBalanceSample} from '../../sample/GetBalanceSample';
import MemberGetBalancesSample from '../../sample/MemberGetBalancesSample';
const {assert} = require('chai');

describe('GetBalanceSample test', () => {
    let member;

    before(async () => {
        member = await CreateMemberSample();
        await member.createAndLinkTestBankAccount(200, 'EUR');
    });

    it('MemberGetBalanceSample test', async () => {
        const sums = await MemberGetBalanceSample(member);
        assert.equal(sums.EUR, 200);
    });

    it('AccountGetBalanceSample test', async () => {
        const sums = await AccountGetBalanceSample(member);
        assert.equal(sums.EUR, 200);
    });

    it('MemberGetBalancesSample test', async () => {
        const sums = await MemberGetBalancesSample(member);
        assert.equal(sums.EUR, 200);
    });
});

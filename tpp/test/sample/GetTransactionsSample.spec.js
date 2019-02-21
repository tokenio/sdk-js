import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemTransferTokenSample from '../../sample/RedeemTransferTokenSample';
import GetTransactionsSample from '../../sample/GetTransactionsSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetTransactionSample test', () => {
    it('Should run the sample', async () => {
        const tppMember = await CreateMemberSample();
        const userMember = await TestUtil.createUserMember();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createTransferToken(userMember, tppAlias);
        await RedeemTransferTokenSample(tppMember, res.id);
        const transactions = await GetTransactionsSample(userMember);
        assert.equal(transactions.length, 1);
    });
});

import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemTransferTokenSample from '../../sample/RedeemTransferTokenSample';
import GetTransactionSample from '../../sample/GetTransactionSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetTransactionSample test', () => {
    it('Should run the sample', async () => {
        const tppMember = await CreateMemberSample();
        const userMember = await TestUtil.createUserMember();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createTransferToken(userMember, tppAlias);
        const transfer = await RedeemTransferTokenSample(tppMember, res.id);
        const transaction = await GetTransactionSample(userMember, transfer);
        assert.equal(transaction.amount.value, 5);
    });
});

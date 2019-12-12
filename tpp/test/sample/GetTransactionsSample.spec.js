import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemTransferTokenSample from '../../sample/RedeemTransferTokenSample';
import { GetTransactions, GetTransactionsWithDate } from '../../sample/GetTransactionsSample';
import TestUtil from '../TestUtil';
const { assert } = require('chai');

describe('GetTransactionsSample test', () => {
    it('Get Transactions without date', async () => {
        const tppMember = await CreateMemberSample();
        const userMember = await TestUtil.createUserMember();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createTransferToken(userMember, tppAlias);
        await RedeemTransferTokenSample(tppMember, res.id);
        const transactions = await GetTransactions(userMember);
        assert.equal(transactions.length, 1);
    });

    it('Get Transaction with date', async () => {
        const tppMember = await CreateMemberSample();
        const userMember = await TestUtil.createUserMember();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createTransferToken(userMember, tppAlias);
        await RedeemTransferTokenSample(tppMember, res.id);
        const today = TestUtil.formatDate(Date.now());
        const transactions = await GetTransactionsWithDate(userMember, today);
        assert.equal(transactions.length, 1);
    });
});

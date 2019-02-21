import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../sample/CreateAndEndorseTransferTokenSample';
import RedeemTransferTokenSample from '../../../tpp/sample/RedeemTransferTokenSample';
import GetTransactionsSample from '../../sample/GetTransactionsSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetTransactionsSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(userMember, tppAlias);
        await RedeemTransferTokenSample(tppMember, res.id);
        const transactions = await GetTransactionsSample(userMember);
        assert.equal(transactions.length, 1);
    });
});

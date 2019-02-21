import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../sample/CreateAndEndorseTransferTokenSample';
import RedeemTransferTokenSample from '../../../tpp/sample/RedeemTransferTokenSample';
import GetTransactionSample from '../../sample/GetTransactionSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetTransactionSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(userMember, tppAlias);
        const transfer = await RedeemTransferTokenSample(tppMember, res.id);
        const transaction = await GetTransactionSample(userMember, transfer);
        assert.equal(transaction.amount.value, 5);
    });
});

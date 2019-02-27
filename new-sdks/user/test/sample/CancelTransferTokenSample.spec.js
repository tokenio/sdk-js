import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../sample/CreateAndEndorseTransferTokenSample';
import CancelTransferTokenSample from '../../sample/CancelTransferTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CancelTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(userMember, tppAlias);
        const res2 = await CancelTransferTokenSample(userMember, res.id);
        assert.equal(res2.status, 'SUCCESS');
    });
});

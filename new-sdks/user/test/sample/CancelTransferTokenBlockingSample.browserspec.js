import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../sample/CreateAndEndorseTransferTokenSample';
import CancelTransferTokenBlockingSample from '../../sample/CancelTransferTokenBlockingSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CancelTransferTokenBlockingSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(userMember, tppAlias);
        const blockingCancelToken = await CancelTransferTokenBlockingSample(userMember, res.id);
        assert.doesNotThrow(blockingCancelToken, Error);
    });
});

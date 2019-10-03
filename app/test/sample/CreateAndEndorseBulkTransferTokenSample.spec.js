import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseBulkTransferTokenSample from '../../sample/CreateAndEndorseBulkTransferTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CreateAndEndorseBulkTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseBulkTransferTokenSample(userMember, tppAlias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

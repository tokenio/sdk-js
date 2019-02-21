import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../sample/CreateAndEndorseTransferTokenSample';
import CreateTransferTokenWithUnusualOptionsSample
    from '../../sample/CreateTransferTokenWithUnusualOptionsSample';
import CreateTransferTokenToDestinationSample
    from '../../sample/CreateTransferTokenToDestinationSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CreateAndEndorseTransferTokenSample test', () => {
    let userMember, tppMember, tppAlias;

    before(async () => {
        userMember = await CreateMemberSample();
        tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        tppAlias = await tppMember.firstAlias();
    });

    it('Regular', async () => {
        const res = await CreateAndEndorseTransferTokenSample(userMember, tppAlias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });

    it('Unusual options', async () => {
        const res = await CreateTransferTokenWithUnusualOptionsSample(userMember, tppMember);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });

    it('To destination', async () => {
        const res = await CreateTransferTokenToDestinationSample(userMember, tppAlias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

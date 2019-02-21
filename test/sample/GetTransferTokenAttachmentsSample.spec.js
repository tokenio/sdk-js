import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenWithAttachmentSample
    from '../../src/sample/CreateAndEndorseTransferTokenWithAttachmentSample';
import GetTransferTokenAttachmentsSample from '../../src/sample/GetTransferTokenAttachmentsSample';

const {assert} = require('chai');

describe('GetTransferTokenAttachmentsSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);
        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseTransferTokenWithAttachmentSample(
            member,
            member2Alias);
        const attachmentDatas = await GetTransferTokenAttachmentsSample(member2, res.id);
        assert.equal(attachmentDatas.length, 1);
        assert.equal(attachmentDatas[0].length, 42);
    });
});

const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenWithAttachmentSample from '../../src/sample/CreateAndEndorseTransferTokenWithAttachmentSample';
import GetTransferTokenAttachmentsSample from '../../src/sample/GetTransferTokenAttachmentsSample';

describe('GetTransferTokenAttachmentsSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Username = await member2.firstUsername();
        const res = await CreateAndEndorseTransferTokenWithAttachmentSample(member, member2Username);
        GetTransferTokenAttachmentsSample(member2, res.id);
    });
});

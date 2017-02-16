const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import CancelAccessTokenSample from '../../src/sample/CancelAccessTokenSample';

describe('CancelAccessTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await LinkMemberAndBankSample(member);

        const member2Username = await member2.firstUsername();
        const res = await CreateAndEndorseAccessTokenSample(member, member2Username);
        const res2 = await CancelAccessTokenSample(member, res.id);
        assert.equal(res2.status, 'SUCCESS');
    });
});
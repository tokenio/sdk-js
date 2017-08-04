/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import GetAccessTokensSample from '../../src/sample/GetAccessTokensSample';

describe('GetAccessTokensSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await LinkMemberAndBankSample(member);

        const member2Username = await member2.firstUsername();
        const createdToken = await CreateAndEndorseAccessTokenSample(member, member2Username);
        const foundToken = await GetAccessTokensSample(member, member2Username);
        assert.equal(createdToken.id, foundToken.id);
    });
});

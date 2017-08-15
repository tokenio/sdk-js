/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import GetAccessTokensSample from '../../src/sample/GetAccessTokensSample';
import ReplaceAndEndorseAccessTokenSample
    from '../../src/sample/ReplaceAndEndorseAccessTokenSample';

describe('ReplaceAndEndorseAccessTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await LinkMemberAndBankSample(member);

        const member2Alias = {type: 'USERNAME', value: await member2.firstAlias()};
        await CreateAndEndorseAccessTokenSample(member, member2Alias);
        const foundToken = await GetAccessTokensSample(member, member2Alias);
        const something = await ReplaceAndEndorseAccessTokenSample(member, foundToken);
        assert.deepEqual(something.payload.to.alias, member2Alias);
    });
});
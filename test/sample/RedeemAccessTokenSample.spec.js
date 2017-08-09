/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import RedeemAccessTokenSample from '../../src/sample/RedeemAccessTokenSample';

describe('RedeemAccessTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await LinkMemberAndBankSample(member);

        const member2Alias = {type: 'USERNAME', value: await member2.firstAlias()};
        const res = await CreateAndEndorseAccessTokenSample(member, member2Alias);
        const accounts = await RedeemAccessTokenSample(member2, res.id);

        assert.isAtLeast(accounts.length, 1);
    });
});

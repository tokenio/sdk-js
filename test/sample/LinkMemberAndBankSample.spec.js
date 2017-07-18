/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';

describe('LinkMemberAndBankSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        const accounts = await member.getAccounts();
        assert.isAtLeast(accounts.length, 1);
    });
});

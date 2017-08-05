/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import GetAccountSample from '../../src/sample/GetAccountSample';

describe('GetAccountSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        const accounts = await member.getAccounts();
        const account = await GetAccountSample(member, accounts[0].id);
        assert.equal(account.id, accounts[0].id);
        assert.equal(account.name, accounts[0].name);
        assert.equal(account.bankId, accounts[0].bankId);
        assert.equal(account.tags, accounts[0].tags);
    });
});

/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
  from '../../src/sample/CreateAndEndorseTransferTokenSample';
import CreateTransferTokenWithUnusualOptionsSample
  from '../../src/sample/CreateTransferTokenWithUnusualOptionsSample';
import CreateTransferTokenFromAuthSample
  from '../../src/sample/CreateTransferTokenFromAuthSample';
import CreateTransferTokenToDestinationSample
  from '../../src/sample/CreateTransferTokenToDestinationSample';

describe('CreateAndEndorseTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Username = await member2.firstUsername();
        const res = await CreateAndEndorseTransferTokenSample(member, member2Username);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

describe('CreateTransferTokenWithUnusualOptionsSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const res = await CreateTransferTokenWithUnusualOptionsSample(member, member2);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

describe('CreateTransferTokenFromAuthSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        const member2Username = await member2.firstUsername();
        await LinkMemberAndBankSample(member2);

        const res = await CreateTransferTokenFromAuthSample(member, member2Username);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

describe('CreateTransferTokenToDestinationSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        const member2Username = await member2.firstUsername();
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const res = await CreateTransferTokenToDestinationSample(member, member2Username);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

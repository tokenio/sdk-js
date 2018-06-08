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
import CreateTransferTokenToDestinationSample
  from '../../src/sample/CreateTransferTokenToDestinationSample';
import TestUtil from '../TestUtil';

describe('CreateAndEndorseTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
            assert.isOk(await member2.firstAlias());
        });
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(member, member2Alias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

describe('CreateTransferTokenWithUnusualOptionsSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
            assert.isOk(await member2.firstAlias());
        });
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const res = await CreateTransferTokenWithUnusualOptionsSample(member, member2);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

describe('CreateTransferTokenToDestinationSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
            assert.isOk(await member2.firstAlias());
        });
        const member2Alias = await member2.firstAlias();
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const res = await CreateTransferTokenToDestinationSample(member, member2Alias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

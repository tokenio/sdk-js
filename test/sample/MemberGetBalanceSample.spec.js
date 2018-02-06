/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import MemberGetBalanceSample from '../../src/sample/MemberGetBalanceSample';

describe('MemberGetBalanceSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        const sums = await MemberGetBalanceSample(member);

        assert.equal(sums.EUR, 200);
    });
});
